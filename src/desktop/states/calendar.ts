import { EventInput } from '@fullcalendar/react';
import { atom, selector } from 'recoil';
import { displayingCategoriesState } from './sidebar';

export type PluginCalendarEvent = EventInput & { note?: string; category?: string };

const PREFIX = 'calendar';

export const calendarEventsState = atom<PluginCalendarEvent[]>({
  key: `${PREFIX}calendarEventsState`,
  default: [],
  effects: [
    ({ onSet }) => {
      onSet((newEvents) => {
        console.debug('🐘 カレンダーイベントが更新されました', newEvents);
      });
    },
  ],
});

export const filteredCalendarEventsState = selector<PluginCalendarEvent[]>({
  key: `${PREFIX}filteredCalendarEventsState`,
  get: ({ get }) => {
    const allEvents = get(calendarEventsState);
    const categories = get(displayingCategoriesState);

    if (!categories) {
      return allEvents;
    }

    return allEvents.filter((event) => !event.category || categories.includes(event.category));
  },
});
