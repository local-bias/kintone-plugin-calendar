import { kx } from '@type/kintone.api';
import { atom } from 'recoil';

const PREFIX = 'kintone';

export const pluginConditionState = atom<kintone.plugin.Condition | null>({
  key: `${PREFIX}pluginConditionState`,
  default: null,
});

export const loadingState = atom<boolean>({
  key: `${PREFIX}loadingState`,
  default: false,
});

export const kintoneRecordsState = atom<kx.RecordData[]>({
  key: `${PREFIX}kintoneRecordsState`,
  default: [],
});
