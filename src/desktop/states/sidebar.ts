import { atom } from 'recoil';

const PREFIX = 'sidebar';

export const sidebarExpandedState = atom<boolean>({
  key: `${PREFIX}sidebarExpandedState`,
  default: false,
});

export const displayingCategoriesState = atom<string[] | null>({
  key: `${PREFIX}displayingCategoriesState`,
  default: null,
});
