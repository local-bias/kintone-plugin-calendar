import { produce } from 'immer';
import { DateTime } from 'luxon';
import { getAppId } from '@lb-ribbit/kintone-xapp';

import { kintoneClient } from '@/desktop/kintone-api';

import { PluginCalendarEvent } from './states/calendar';
import { DateInput } from '@fullcalendar/core';
import { COLORS } from './static';
import { kintoneAPI } from '@konomi-app/kintone-utilities';

export const getDefaultStartDate = (): Date => {
  const now = DateTime.local();
  const { minute } = now;

  if ([0, 30].includes(minute)) {
    return now.toJSDate();
  } else if (minute < 30) {
    return now.set({ minute: 30 }).toJSDate();
  }
  return now.plus({ hours: 1 }).set({ minute: 0 }).toJSDate();
};

export const getDefaultEndDate = (): Date => {
  const now = DateTime.local();
  const { minute } = now;

  if (minute === 0) {
    return now.set({ minute: 30 }).toJSDate();
  } else if (minute === 30) {
    return now.plus({ hours: 1 }).set({ minute: 0 }).toJSDate();
  } else if (minute < 30) {
    return now.plus({ hours: 1 }).set({ minute: 30 }).toJSDate();
  }
  return now.plus({ hours: 2 }).set({ minute: 0 }).toJSDate();
};

export const completeCalendarEvent = (eventInput: PluginCalendarEvent) => {
  return produce(eventInput, (draft) => {
    if (!draft.start) draft.start = draft.end;
    if (!draft.end) draft.end = draft.start;
  });
};

export const convertEventIntoRecord = (
  eventInput: PluginCalendarEvent,
  condition: kintone.plugin.Condition
) => {
  const { calendarEvent } = condition;
  const start = eventInput.start ? convertCalendarDateIntoKintoneDate(eventInput.start) : null;
  const end = eventInput.end ? convertCalendarDateIntoKintoneDate(eventInput.end) : null;

  const record: Record<string, any> = {};

  if (calendarEvent.titleField) {
    record[calendarEvent.titleField] = { value: eventInput.title };
  }
  if (calendarEvent.startField) {
    record[calendarEvent.startField] = { value: start || '' };
  }
  if (calendarEvent.endField) {
    record[calendarEvent.endField] = { value: end || '' };
  }
  if (condition.enablesAllDay && condition.allDayOption && calendarEvent.allDayField) {
    record[calendarEvent.allDayField] = {
      value: eventInput.allDay ? [condition.allDayOption] : [],
    };
  }
  if (condition.enablesNote && calendarEvent.noteField) {
    record[calendarEvent.noteField] = { value: eventInput.note };
  }
  if (calendarEvent.categoryField) {
    record[calendarEvent.categoryField] = { value: eventInput.category };
  }

  console.log('♻ カレンダーイベントがkintoneレコードに変換されました', { eventInput, record });
  return record;
};

export const convertRecordIntoEvent = (
  condition: kintone.plugin.Condition,
  properties: kintoneAPI.FieldProperties,
  record: kintoneAPI.RecordData
): PluginCalendarEvent => {
  const calendarEvent: PluginCalendarEvent = {
    id: record.$id.value as string | undefined,
    start: record[condition.calendarEvent?.startField]?.value as string | undefined,
    end: record[condition.calendarEvent?.endField]?.value as string | undefined,
    title: record[condition.calendarEvent?.titleField]?.value as string | undefined,
    note: record[condition.calendarEvent?.noteField]?.value as string | undefined,
    category: record[condition.calendarEvent?.categoryField]?.value as string | undefined,
    backgroundColor: getEventBackgroundColor(
      record[condition.calendarEvent.categoryField]?.value,
      condition,
      properties
    ),
  };

  console.log('🐇', { condition, record });

  if (condition.enablesAllDay && condition.allDayOption) {
    const options = record[condition.calendarEvent.allDayField].value as string[];
    calendarEvent.allDay = options.includes(condition.allDayOption);
  }

  return calendarEvent;
};

export const addNewRecord = async (
  eventInput: PluginCalendarEvent,
  condition: kintone.plugin.Condition
): Promise<PluginCalendarEvent> => {
  const newEvent = { ...eventInput, title: eventInput.title || '（タイトルなし）' };

  const record = convertEventIntoRecord(newEvent, condition);

  console.log('💿 次のレコードを登録します', record);

  const response = await kintoneClient.record.addRecord({ app: getAppId()!, record });

  newEvent.id = response.id;
  return newEvent;
};

export const updateRecord = async (
  eventInput: PluginCalendarEvent,
  condition: kintone.plugin.Condition
) => {
  const { id } = eventInput;
  if (!id) {
    throw 'スケジュールに紐づくレコードが存在しません、一覧を更新し、再度お試しください';
  }

  const app = getAppId()!;
  const record = convertEventIntoRecord(eventInput, condition);
  return kintoneClient.record.updateRecord({ app, id, record });
};

export const getEventBackgroundColor = (
  value: kintoneAPI.RecordData[string]['value'] | undefined,
  condition: kintone.plugin.Condition,
  properties: kintoneAPI.FieldProperties
) => {
  if (!value) {
    return COLORS[0];
  }

  const keyProperty = properties[condition.calendarEvent.categoryField];
  if (
    keyProperty.type === 'CHECK_BOX' ||
    keyProperty.type === 'DROP_DOWN' ||
    keyProperty.type === 'RADIO_BUTTON'
  ) {
    const index = Object.values(keyProperty.options).findIndex((option) => option.label === value);
    if (index === -1) {
      return COLORS[0];
    }
    return COLORS[index % (COLORS.length - 1)];
  }

  return COLORS[0];
};

const convertCalendarDateIntoKintoneDate = (eventDate: DateInput) => {
  if (typeof eventDate === 'string') {
    return eventDate;
  } else if (typeof eventDate === 'number') {
    return DateTime.fromSeconds(eventDate);
  } else if (Array.isArray(eventDate)) {
    return DateTime.local(eventDate[0], eventDate[1], eventDate[2]).toISO();
  } else if (typeof eventDate === 'object') {
    return DateTime.fromJSDate(eventDate).toISO();
  }
  return eventDate;
};

export const dateInputToDateTime = (dateInput: DateInput): DateTime => {
  if (typeof dateInput === 'string') {
    return DateTime.fromISO(dateInput);
  } else if (typeof dateInput === 'number') {
    return DateTime.fromSeconds(dateInput);
  } else if (Array.isArray(dateInput)) {
    return DateTime.local(dateInput[0], dateInput[1], dateInput[2]);
  } else if (typeof dateInput === 'object') {
    return DateTime.fromJSDate(dateInput);
  }
  return dateInput;
};

export const dateTimeToDateInput = (dateTime: DateTime): DateInput => {
  return dateTime.toJSDate();
};
