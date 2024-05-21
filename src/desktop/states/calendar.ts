import { EventInput } from '@fullcalendar/core';
import { atom, selector } from 'recoil';
import { displayingCategoriesState } from './sidebar';
import { hasEndTimeState, hasStartTimeState } from './plugin';
import { getNextDay } from '@/lib/calendar';

export type PluginCalendarEvent = EventInput & { note?: string; category?: string };

const PREFIX = 'calendar';

export const calendarEventsState = atom<PluginCalendarEvent[]>({
  key: `${PREFIX}calendarEventsState`,
  default: [],
  effects: [
    ({ onSet }) => {
      onSet((newEvents) => {
        process.env.NODE_ENV === 'development' &&
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
    const hasEndTime = get(hasEndTimeState);
    const hasStartTime = get(hasStartTimeState);

    if (!categories) {
      if (!hasEndTime && !hasStartTime) {
        return allEvents.map((event) => ({
          ...event,
          end: event.end ? getNextDay(event.end) : undefined,
        }));
      }
      return allEvents;
    }

    const filtered = allEvents.filter(
      (event) => !event.category || categories.includes(event.category)
    );

    console.log({ hasEndTime, hasStartTime });
    if (!hasEndTime && !hasStartTime) {
      return filtered.map((event) => ({
        ...event,
        end: event.end ? getNextDay(event.end) : undefined,
      }));
    }
    return filtered;
  },
});
