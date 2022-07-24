import { kintoneClient } from '@common/kintone-api';
import { EventInput } from '@fullcalendar/react';
import { getAppId } from '@lb-ribbit/kintone-xapp';
import produce from 'immer';
import { DateTime } from 'luxon';

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

export const completeCalendarEvent = (eventInput: EventInput) => {
  return produce(eventInput, (draft) => {
    if (!draft.start) draft.start = draft.end;
    if (!draft.end) draft.end = draft.start;
  });
};

const convertEventIntoRecord = (eventInput: EventInput, condition: kintone.plugin.Condition) => {
  const { calendarEvent } = condition;
  const start = eventInput.start ? DateTime.fromJSDate(eventInput.start as Date).toISO() : null;
  const end = eventInput.end ? DateTime.fromJSDate(eventInput.end as Date).toISO() : null;
  return {
    [calendarEvent.titleField]: { value: eventInput.title },
    [calendarEvent.startField]: { value: start || '' },
    [calendarEvent.endField]: { value: end || '' },
  };
};

export const addNewRecord = async (
  eventInput: EventInput,
  condition: kintone.plugin.Condition
): Promise<EventInput> => {
  const newEvent = { ...eventInput, title: eventInput.title || '（タイトルなし）' };

  const record = convertEventIntoRecord(newEvent, condition);

  const response = await kintoneClient.record.addRecord({ app: getAppId()!, record });

  newEvent.id = response.id;
  return newEvent;
};

export const updateRecord = async (eventInput: EventInput, condition: kintone.plugin.Condition) => {
  const { id } = eventInput;
  if (!id) {
    throw 'スケジュールに紐づくレコードが存在しません、一覧を更新し、再度お試しください';
  }

  const app = getAppId()!;
  const record = convertEventIntoRecord(eventInput, condition);
  return kintoneClient.record.updateRecord({ app, id, record });
};
