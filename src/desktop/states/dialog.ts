import { atom } from 'recoil';
import { PluginCalendarEvent } from './calendar';

const PREFIX = 'dialog';

export const dialogShownState = atom<boolean>({
  key: `${PREFIX}dialogShownState`,
  default: false,
});

export const dialogPropsState = atom<{
  new: boolean;
  event: PluginCalendarEvent;
}>({
  key: `${PREFIX}dialogPropsState`,
  default: {
    new: false,
    event: {},
  },
});
