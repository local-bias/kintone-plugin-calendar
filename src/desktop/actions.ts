import { GUEST_SPACE_ID } from '@/lib/global';
import { htmlToMarkdown, markdownToHtml } from '@/lib/html-markdown-converter';
import { t } from '@/lib/i18n-plugin';
import { getSortedOptions } from '@/lib/utils';
import { PluginCondition } from '@/schema/plugin-config';
import { DateInput } from '@fullcalendar/core';
import {
  addRecord,
  AddRecordParams,
  getAppId,
  getYuruChara,
  kintoneAPI,
  updateRecord,
} from '@konomi-app/kintone-utilities';
import { produce } from 'immer';
import { DateTime } from 'luxon';
import { PluginCalendarEvent } from './states/calendar';

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

export const getKintoneRecordFromCalendarEvent = async (params: {
  calendarEvent: PluginCalendarEvent;
  condition: PluginCondition;
  properties: kintoneAPI.FieldProperties;
}): Promise<AddRecordParams['record']> => {
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

  const record: AddRecordParams['record'] = {};

  if (calendarConfig.inputTitleField) {
    record[calendarConfig.inputTitleField] = { value: calendarEvent.title ?? '' };
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
    const noteProperty = properties[calendarConfig.noteField];
    const isRichText = noteProperty?.type === 'RICH_TEXT';
    // リッチテキストフィールドの場合のみMarkdown→HTML変換を実施
    const noteValue = isRichText
      ? await markdownToHtml(calendarEvent.note ?? '')
      : calendarEvent.note ?? '';
    record[calendarConfig.noteField] = { value: noteValue };
  }
  if (calendarConfig.categoryField) {
    record[calendarConfig.categoryField] = { value: calendarEvent.category ?? '' };
  }

  process.env.NODE_ENV === 'development' &&
    console.log('♻ カレンダーイベントがkintoneレコードに変換されました', {
      calendarEvent,
      record,
    });
  return record;
};

export const getCalendarEventFromKintoneRecord = async (params: {
  condition: PluginCondition;
  properties: kintoneAPI.FieldProperties;
  record: kintoneAPI.RecordData;
}): Promise<PluginCalendarEvent> => {
  const { condition, properties, record } = params;

  const startProperty = properties[condition.calendarEvent.startField];
  const endProperty = properties[condition.calendarEvent.endField];

  const colors = getEventColors({
    value: record[condition.calendarEvent.categoryField]?.value,
    condition,
    properties,
  });

  // リッチテキストフィールドの場合のみHTML→Markdown変換を実施
  const noteProperty = properties[condition.calendarEvent.noteField];
  const isRichText = noteProperty?.type === 'RICH_TEXT';
  const rawNote = record[condition.calendarEvent.noteField]?.value as string | undefined;
  const noteValue = rawNote && isRichText ? await htmlToMarkdown(rawNote) : rawNote;

  const calendarEvent: PluginCalendarEvent = {
    id: record.$id.value as string | undefined,
    start: record[condition.calendarEvent.startField]?.value as string | undefined,
    end: record[condition.calendarEvent.endField]?.value as string | undefined,
    title: record[condition.calendarEvent.inputTitleField]?.value as string | undefined,
    note: noteValue,
    category: record[condition.calendarEvent.categoryField]?.value as string | undefined,
    __quickSearch: getYuruChara(
      [
        record[condition.calendarEvent.inputTitleField]?.value,
        noteValue,
        record[condition.calendarEvent.categoryField]?.value,
      ]
        .filter(Boolean)
        .join('_$$_')
    ),
    ...colors,
  };

  // 日付フィールドが使用されている場合、自動的に全日イベントとする
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
  condition: PluginCondition;
  properties: kintoneAPI.FieldProperties;
}): Promise<PluginCalendarEvent> => {
  const { calendarEvent, condition, properties } = params;

  const newEvent = {
    ...calendarEvent,
    title: calendarEvent.title || t('desktop.calendar.noTitle'),
  };

  const record = await getKintoneRecordFromCalendarEvent({
    calendarEvent: newEvent,
    condition,
    properties,
  });

  process.env.NODE_ENV === 'development' && console.info('レコードを追加します', record);

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
  condition: PluginCondition;
  properties: kintoneAPI.FieldProperties;
}) => {
  const { calendarEvent, condition, properties } = params;
  const { id } = calendarEvent;
  if (!id) {
    throw t('desktop.error.scheduleRecordNotFound');
  }

  const app = getAppId()!;
  const record = await getKintoneRecordFromCalendarEvent({ calendarEvent, condition, properties });
  return updateRecord({
    app,
    id,
    record,
    guestSpaceId: GUEST_SPACE_ID,
    debug: process.env.NODE_ENV === 'development',
  });
};

const getForegroundColor = (backgroundColor: string) => {
  try {
    const hex = backgroundColor.substring(1);
    const [r, g, b] = [
      parseInt(hex.substring(0, 2), 16),
      parseInt(hex.substring(2, 4), 16),
      parseInt(hex.substring(4, 6), 16),
    ];
    const brightness = r * 0.299 + g * 0.587 + b * 0.114;
    return brightness > 186 ? '#000000' : '#ffffff';
  } catch (error) {
    console.log('failed to get foreground color', error);
    return '#ffffff';
  }
};

const getEventBackgroundColor = (
  value: kintoneAPI.RecordData[string]['value'] | undefined,
  condition: PluginCondition,
  properties: kintoneAPI.FieldProperties
) => {
  const { colors } = condition;
  if (!value) {
    return colors[0];
  }

  const keyProperty: kintoneAPI.FieldProperty | undefined =
    properties[condition.calendarEvent.categoryField];
  if (
    keyProperty?.type === 'CHECK_BOX' ||
    keyProperty?.type === 'DROP_DOWN' ||
    keyProperty?.type === 'RADIO_BUTTON'
  ) {
    const index = getSortedOptions(keyProperty.options).findIndex(
      (option) => option.label === value
    );
    if (index === -1) {
      return colors[0];
    }
    return colors[index % colors.length];
  }

  return colors[0];
};

export const getEventColors = (params: {
  value: kintoneAPI.RecordData[string]['value'] | undefined;
  condition: PluginCondition;
  properties: kintoneAPI.FieldProperties;
}): Pick<PluginCalendarEvent, 'backgroundColor' | 'borderColor' | 'textColor' | 'color'> => {
  const { value, condition, properties } = params;

  const background = getEventBackgroundColor(value, condition, properties);
  const foreground = getForegroundColor(background);

  return {
    color: `${foreground}aa`,
    backgroundColor: background,
    borderColor: `${foreground}22`,
    textColor: foreground,
  };
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
