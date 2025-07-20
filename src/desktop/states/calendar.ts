import { GUEST_SPACE_ID, isDev } from '@/lib/global';
import { DateSelectArg, EventInput } from '@fullcalendar/core';
import { deleteAllRecords, getAppId, getYuruChara } from '@konomi-app/kintone-utilities';
import { produce } from 'immer';
import { atom } from 'jotai';
import { enqueueSnackbar } from 'notistack';
import {
  addNewRecord,
  completeCalendarEvent,
  getDefaultEndDate,
  getDefaultStartDate,
} from '../actions';
import { dialogPropsAtom, dialogShownAtom } from './dialog';
import { appPropertiesAtom, loadingAtom, pluginConditionAtom } from './kintone';
import { displayingCategoriesAtom } from './sidebar';
import { ComponentRef } from 'react';
import FullCalendar from '@fullcalendar/react';

export type PluginCalendarEvent = EventInput & {
  note?: string;
  category?: string;
  __quickSearch?: string;
};

export const fullcalendarRefAtom = atom<ComponentRef<typeof FullCalendar> | null>(null);
export const fullcalendarApiAtom = atom((get) => get(fullcalendarRefAtom)?.getApi());

export const calendarEventsAtom = atom<PluginCalendarEvent[]>([]);

export const searchInputAtom = atom<string>('');
export const handleSearchInputChangeAtom = atom(
  null,
  (_, set, event: React.ChangeEvent<HTMLInputElement>) => {
    set(searchInputAtom, event.target.value);
  }
);

export const categoryFilteredCalendarEventsAtom = atom<PluginCalendarEvent[]>((get) => {
  const allEvents = get(calendarEventsAtom);
  const categories = get(displayingCategoriesAtom);

  if (!categories) {
    return allEvents;
  }

  return allEvents.filter((event) => !event.category || categories.includes(event.category));
});

export const textFilteredCalendarEventsAtom = atom<PluginCalendarEvent[]>((get) => {
  const allEvents = get(categoryFilteredCalendarEventsAtom);
  const searchInput = get(searchInputAtom);

  if (!searchInput) {
    return allEvents;
  }

  const searchWords = searchInput
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .map((word) => getYuruChara(word.trim()));
  if (searchWords.length === 0) {
    return allEvents;
  }

  return allEvents.filter((event) => {
    return searchWords.every((word) => event.__quickSearch && event.__quickSearch.includes(word));
  });
});

export const handleCalendarDateSelectAtom = atom(null, (_, set, props: DateSelectArg) => {
  isDev && console.info('📅 日付が選択されました', props);

  const temporaryKey = Math.random().toString();

  const completed = completeCalendarEvent({
    id: temporaryKey,
    allDay: props.allDay,
    start: props.start,
    end: props.end,
    __quickSearch: '',
  });

  set(calendarEventsAtom, (current) => produce(current, (draft) => [...draft, completed]));
  set(dialogPropsAtom, {
    new: true,
    event: completed,
  });
  set(dialogShownAtom, true);
});

export const handleCalendarEventAddAtom = atom(null, (get, set, props: EventInput) => {
  console.info('📅 イベントが追加されました', props);
});

export const handleTemporaryEventAddAtom = atom(null, (_, set) => {
  const temporaryKey = Math.random().toString();

  const completed = completeCalendarEvent({
    id: temporaryKey,
    allDay: false,
    title: '',
    start: getDefaultStartDate(),
    end: getDefaultEndDate(),
    __quickSearch: '',
  });

  set(calendarEventsAtom, (current) => produce(current, (draft) => [...draft, completed]));
  set(dialogPropsAtom, { new: true, event: completed });
  set(dialogShownAtom, true);
});

/**
 * カレンダーイベントをコピーして新規追加する
 */
export const handleCalendarEventCopyAtom = atom(null, async (get, set) => {
  try {
    set(loadingAtom, true);

    const currentProps = get(dialogPropsAtom);
    if (!currentProps.event.id) {
      throw new Error('新規イベントをコピーすることはできません');
    }

    const condition = get(pluginConditionAtom);
    const properties = await get(appPropertiesAtom);
    const newEvent = await addNewRecord({
      calendarEvent: completeCalendarEvent({
        ...currentProps.event,
        id: undefined,
        title: `${currentProps.event.title} (コピー)`,
      }),
      condition: condition!,
      properties,
    });
    set(calendarEventsAtom, (current) => [...current, newEvent]);
    set(dialogShownAtom, false);
    enqueueSnackbar('イベントのコピーしました', { variant: 'success' });
  } finally {
    set(loadingAtom, false);
  }
});

export const handleCalendarEventDeleteAtom = atom(null, async (get, set) => {
  set(loadingAtom, true);
  try {
    const currentProps = await get(dialogPropsAtom);
    const eventId = currentProps.event.id;
    if (!eventId) {
      throw '対象イベントに紐づくレコード情報の取得に失敗しました、一覧を再表示した上で再度お試しください';
    }

    set(calendarEventsAtom, (current) => current.filter((event) => event.id !== eventId));
    set(dialogShownAtom, false);
    set(dialogPropsAtom, { new: false, event: {} });
    const app = getAppId()!;
    await deleteAllRecords({
      app,
      ids: [Number(eventId)],
      guestSpaceId: GUEST_SPACE_ID,
      debug: process.env.NODE_ENV === 'development',
    });
    enqueueSnackbar('レコードの削除が完了しました', { variant: 'success' });
  } finally {
    set(loadingAtom, false);
  }
});
