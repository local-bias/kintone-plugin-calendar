import { GUEST_SPACE_ID } from '@/lib/global';
import { DateSelectArg, EventInput } from '@fullcalendar/core';
import { deleteAllRecords, getAppId } from '@konomi-app/kintone-utilities';
import { produce } from 'immer';
import { atom } from 'jotai';
import { enqueueSnackbar } from 'notistack';
import { completeCalendarEvent, getDefaultEndDate, getDefaultStartDate } from '../actions';
import { dialogPropsAtom, dialogShownAtom } from './dialog';
import { loadingAtom } from './kintone';
import { displayingCategoriesAtom } from './sidebar';

export type PluginCalendarEvent = EventInput & { note?: string; category?: string };

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

  const searchWords = searchInput.split(/\s+/).filter((word) => word.length > 0);
  if (searchWords.length === 0) {
    return allEvents;
  }

  return allEvents.filter((event) => {
    const title = event.title || '';
    const note = event.note || '';
    return searchWords.every((word) => title.includes(word) || note.includes(word));
  });
});

export const handleCalendarDateSelectAtom = atom(null, (get, set, props: DateSelectArg) => {
  const temporaryKey = Math.random().toString();

  const completed = completeCalendarEvent({
    id: temporaryKey,
    allDay: props.allDay,
    start: props.start,
    end: props.end,
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
  });

  set(calendarEventsAtom, (current) => produce(current, (draft) => [...draft, completed]));
  set(dialogPropsAtom, { new: true, event: completed });
  set(dialogShownAtom, true);
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
