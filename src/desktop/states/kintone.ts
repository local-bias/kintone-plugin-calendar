import { atom } from 'recoil';

const PREFIX = 'kintone';

export const pluginConditionState = atom<kintone.plugin.Condition | null>({
  key: `${PREFIX}pluginConditionState`,
  default: null,
});
