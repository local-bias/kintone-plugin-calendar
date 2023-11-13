import { atom } from 'recoil';

const PREFIX = 'sidebar';

export const displayingCategoriesState = atom<string[] | null>({
  key: `${PREFIX}displayingCategoriesState`,
  default: null,
});
