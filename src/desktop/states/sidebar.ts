import { atom } from 'jotai';

export const sidebarExpandedAtom = atom<boolean>(true);
export const toggleSidebarExpandedAtom = atom(null, (_, set) => {
  set(sidebarExpandedAtom, (current) => !current);
});

export const displayingCategoriesAtom = atom<string[] | null>(null);
