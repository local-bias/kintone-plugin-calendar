import { EventInput } from '@fullcalendar/react';
import { atom } from 'recoil';

const PREFIX = 'dialog';

export const dialogShownState = atom<boolean>({
  key: `${PREFIX}dialogShownState`,
  default: false,
});

export const dialogPropsState = atom<{
  new: boolean;
  event: EventInput;
}>({
  key: `${PREFIX}dialogPropsState`,
  default: {
    new: false,
    event: {},
  },
});
