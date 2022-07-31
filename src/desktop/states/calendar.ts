import { EventInput } from '@fullcalendar/react';
import { atom } from 'recoil';

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
