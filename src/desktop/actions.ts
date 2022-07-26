import produce from 'immer';
import { DateTime } from 'luxon';
import { getAppId } from '@lb-ribbit/kintone-xapp';

import { kx } from '@type/kintone.api';
import { kintoneClient } from '@common/kintone-api';

import { PluginCalendarEvent } from './states/calendar';
import { EventApi, EventInput } from '@fullcalendar/react';

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
  const start = eventInput.start ? DateTime.fromJSDate(eventInput.start as Date).toISO() : null;
  const end = eventInput.end ? DateTime.fromJSDate(eventInput.end as Date).toISO() : null;

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

  return record;
};

export const convertEventApiIntoEventInput = (api: EventApi): PluginCalendarEvent => {
  return {
    id: api.id,
    start: api.start ?? undefined,
    end: api.end ?? undefined,
    title: api.title,
    allDay: api.allDay,
  };
};

export const convertRecordIntoEvent = (
  condition: kintone.plugin.Condition,
  record: kx.RecordData
): PluginCalendarEvent => {
  const calendarEvent: PluginCalendarEvent = {
    id: record.$id.value as string | undefined,
    start: record[condition.calendarEvent?.startField]?.value as string | undefined,
    end: record[condition.calendarEvent?.endField]?.value as string | undefined,
    title: record[condition.calendarEvent?.titleField]?.value as string | undefined,
    note: record[condition.calendarEvent?.noteField]?.value as string | undefined,
  };

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
