import { PLUGIN_ID } from '@/lib/global';
import { restoreStorage } from '@/lib/plugin';
import { atom } from 'recoil';

const PREFIX = 'plugin';

export const storageState = atom<Plugin.Config>({
  key: `${PREFIX}storageState`,
  default: restoreStorage(PLUGIN_ID),
});

export const loadingState = atom<boolean>({
  key: `${PREFIX}loadingState`,
  default: false,
});
