import { PLUGIN_ID } from '@/common/global';
import { restoreStorage } from '@/common/plugin';
import { atom } from 'recoil';

const PREFIX = 'plugin';

export const storageState = atom<kintone.plugin.Storage>({
  key: `${PREFIX}storageState`,
  default: restoreStorage(PLUGIN_ID),
});

export const loadingState = atom<boolean>({
  key: `${PREFIX}loadingState`,
  default: false,
});
