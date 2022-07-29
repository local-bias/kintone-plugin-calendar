import { atom } from 'recoil';

const PREFIX = 'sidebar';

export const sidebarExpandedState = atom<boolean>({
  key: `${PREFIX}sidebarExpandedState`,
  default: false,
});
