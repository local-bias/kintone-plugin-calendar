import { produce } from 'immer';
import { DateTime } from 'luxon';
import { getAppId } from '@lb-ribbit/kintone-xapp';

import { PluginCalendarEvent } from './states/calendar';
import { DateInput } from '@fullcalendar/core';
import { COLORS } from './static';
import { addRecord, kintoneAPI, updateRecord } from '@konomi-app/kintone-utilities';
import { GUEST_SPACE_ID } from '@/lib/global';

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

export const getKintoneRecordFromCalendarEvent = (params: {
  calendarEvent: PluginCalendarEvent;
  condition: Plugin.Condition;
  properties: kintoneAPI.FieldProperties;
}) => {
  const { calendarEvent, condition, properties } = params;
  const { calendarEvent: calendarConfig } = condition;
  let start = calendarEvent.start ? convertCalendarDateIntoKintoneDate(calendarEvent.start) : null;
  let end = calendarEvent.end ? convertCalendarDateIntoKintoneDate(calendarEvent.end) : null;

  const startProperty = properties[calendarConfig.startField];
  const endProperty = properties[calendarConfig.endField];

  if (startProperty.type === 'DATE') {
    start = start?.split('T')[0] ?? null;
  }
  if (endProperty.type === 'DATE') {
    end = end?.split('T')[0] ?? null;
  }

  const record: Record<string, any> = {};

  if (calendarConfig.titleField) {
    record[calendarConfig.titleField] = { value: calendarEvent.title };
  }
  if (calendarConfig.startField) {
    record[calendarConfig.startField] = { value: start || '' };
  }
  if (calendarConfig.endField) {
    record[calendarConfig.endField] = { value: end || '' };
  }
  if (condition.enablesAllDay && condition.allDayOption && calendarConfig.allDayField) {
    record[calendarConfig.allDayField] = {
      value: calendarEvent.allDay ? [condition.allDayOption] : [],
    };
  }
  if (condition.enablesNote && calendarConfig.noteField) {
    record[calendarConfig.noteField] = { value: calendarEvent.note };
  }
  if (calendarConfig.categoryField) {
    record[calendarConfig.categoryField] = { value: calendarEvent.category };
  }

  process.env.NODE_ENV === 'development' &&
    console.log('♻ カレンダーイベントがkintoneレコードに変換されました', {
      calendarEvent,
      record,
    });
  return record;
};

export const getCalendarEventFromKintoneRecord = (params: {
  condition: Plugin.Condition;
  properties: kintoneAPI.FieldProperties;
  record: kintoneAPI.RecordData;
}): PluginCalendarEvent => {
  const { condition, properties, record } = params;

  const startProperty = properties[condition.calendarEvent.startField];
  const endProperty = properties[condition.calendarEvent.endField];

  const calendarEvent: PluginCalendarEvent = {
    id: record.$id.value as string | undefined,
    start: record[condition.calendarEvent.startField]?.value as string | undefined,
    end: record[condition.calendarEvent.endField]?.value as string | undefined,
    title: record[condition.calendarEvent.titleField]?.value as string | undefined,
    note: record[condition.calendarEvent.noteField]?.value as string | undefined,
    category: record[condition.calendarEvent.categoryField]?.value as string | undefined,
    backgroundColor: getEventBackgroundColor(
      record[condition.calendarEvent.categoryField]?.value,
      condition,
      properties
    ),
  };

  if (startProperty.type === 'DATE' || endProperty.type === 'DATE') {
    calendarEvent.allDay = true;
  } else if (condition.enablesAllDay && condition.allDayOption) {
    const options = record[condition.calendarEvent.allDayField].value as string[];
    calendarEvent.allDay = options.includes(condition.allDayOption);
  }

  process.env.NODE_ENV === 'development' &&
    console.info('♻ kintoneレコードがカレンダーイベントに変換されました', {
      record,
      calendarEvent,
    });

  return calendarEvent;
};

export const addNewRecord = async (params: {
  calendarEvent: PluginCalendarEvent;
  condition: Plugin.Condition;
  properties: kintoneAPI.FieldProperties;
}): Promise<PluginCalendarEvent> => {
  const { calendarEvent, condition, properties } = params;

  const newEvent = { ...calendarEvent, title: calendarEvent.title || '（タイトルなし）' };

  const record = getKintoneRecordFromCalendarEvent({
    calendarEvent: newEvent,
    condition,
    properties,
  });

  const response = await addRecord({
    app: getAppId()!,
    record,
    guestSpaceId: GUEST_SPACE_ID,
    debug: process.env.NODE_ENV === 'development',
  });

  newEvent.id = response.id;
  return newEvent;
};

export const reschedule = async (params: {
  calendarEvent: PluginCalendarEvent;
  condition: Plugin.Condition;
  properties: kintoneAPI.FieldProperties;
}) => {
  const { calendarEvent, condition, properties } = params;
  const { id } = calendarEvent;
  if (!id) {
    throw 'スケジュールに紐づくレコードが存在しません、一覧を更新し、再度お試しください';
  }

  const app = getAppId()!;
  const record = getKintoneRecordFromCalendarEvent({ calendarEvent, condition, properties });
  return updateRecord({
    app,
    id,
    record,
    guestSpaceId: GUEST_SPACE_ID,
    debug: process.env.NODE_ENV === 'development',
  });
};

export const getEventBackgroundColor = (
  value: kintoneAPI.RecordData[string]['value'] | undefined,
  condition: Plugin.Condition,
  properties: kintoneAPI.FieldProperties
) => {
  if (!value) {
    return COLORS[0];
  }

  const keyProperty: kintoneAPI.FieldProperty | undefined =
    properties[condition.calendarEvent.categoryField];
  if (
    keyProperty?.type === 'CHECK_BOX' ||
    keyProperty?.type === 'DROP_DOWN' ||
    keyProperty?.type === 'RADIO_BUTTON'
  ) {
    const index = Object.values(keyProperty.options).findIndex((option) => option.label === value);
    if (index === -1) {
      return COLORS[0];
    }
    return COLORS[index % (COLORS.length - 1)];
  }

  return COLORS[0];
};

const convertCalendarDateIntoKintoneDate = (eventDate: DateInput): string | null => {
  if (typeof eventDate === 'string') {
    return eventDate;
  } else if (typeof eventDate === 'number') {
    return DateTime.fromSeconds(eventDate).toISO();
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
