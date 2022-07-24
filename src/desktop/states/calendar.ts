import { EventInput } from '@fullcalendar/react';
import { atom } from 'recoil';

const PREFIX = 'calendar';

export const calendarEventsState = atom<EventInput[]>({
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
