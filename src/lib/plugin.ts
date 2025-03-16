import { DEFAULT_COLORS } from '@/desktop/static';
import { AnyPluginConfig, PluginCondition, PluginConfig } from '@/schema/plugin-config';
import { restoreStorage } from '@konomi-app/kintone-utilities';
import { produce } from 'immer';
import { nanoid } from 'nanoid';
import { PLUGIN_ID } from './global';

export const getNewCondition = (): PluginCondition => ({
  id: nanoid(),
  viewId: '',
  initialView: 'timeGridWeek',
  enablesAllDay: true,
  allDayOption: '',
  enablesNote: false,
  slotMinTime: '0:00:00',
  slotMaxTime: '24:00:00',
  colors: DEFAULT_COLORS,
  daysOfWeek: [1, 2, 3, 4, 5],
  calendarEvent: {
    inputTitleField: '',
    displayTitleField: '',
    startField: '',
    endField: '',
    allDayField: '',
    noteField: '',
    categoryField: '',
  },
});

/**
 * プラグインの設定情報のひな形を返却します
 */
export const createConfig = (): PluginConfig => ({
  version: 3,
  common: {},
  conditions: [getNewCondition()],
});

/**
 * 古いバージョンの設定情報を新しいバージョンに変換します
 * @param anyConfig 保存されている設定情報
 * @returns 新しいバージョンの設定情報
 */
export const migrateConfig = (config: AnyPluginConfig): PluginConfig => {
  const { version } = config;
  switch (version) {
    case undefined:
    case 1: {
      return migrateConfig({
        version: 2,
        conditions: config.conditions.map((condition) => ({
          ...condition,
          colors: DEFAULT_COLORS,
        })),
      });
    }
    case 2: {
      return migrateConfig({
        version: 3,
        common: {},
        conditions: config.conditions.map((condition) => ({
          ...condition,
          id: nanoid(),
          daysOfWeek: [1, 2, 3, 4, 5],
          calendarEvent: {
            ...condition.calendarEvent,
            inputTitleField: condition.calendarEvent.titleField,
            displayTitleField: '',
          },
        })),
      });
    }
    default: {
      return config;
    }
  }
};

/**
 * プラグインの設定情報を復元します
 */
export const restorePluginConfig = (): PluginConfig => {
  const config = restoreStorage<AnyPluginConfig>(PLUGIN_ID) ?? createConfig();
  return migrateConfig(config);
};

export const getUpdatedStorage = <T extends keyof PluginCondition>(
  storage: PluginConfig,
  props: {
    conditionIndex: number;
    key: T;
    value: PluginCondition[T];
  }
) => {
  const { conditionIndex, key, value } = props;
  return produce(storage, (draft) => {
    draft.conditions[conditionIndex][key] = value;
  });
};

export const getConditionField = <T extends keyof PluginCondition>(
  storage: PluginConfig,
  props: {
    conditionIndex: number;
    key: T;
    defaultValue: NonNullable<PluginCondition[T]>;
  }
): NonNullable<PluginCondition[T]> => {
  const { conditionIndex, key, defaultValue } = props;
  if (!storage.conditions[conditionIndex]) {
    return defaultValue;
  }
  return storage.conditions[conditionIndex][key] ?? defaultValue;
};
