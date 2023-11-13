import { produce } from 'immer';

/**
 * プラグインがアプリ単位で保存している設定情報を返却します
 */
export const restoreStorage = (id: string): Plugin.Config => {
  /** 復元した設定情報 */
  const config: Record<string, string> = kintone.plugin.app.getConfig(id);

  // 空の場合は雛形を返却します
  if (!Object.keys(config).length) {
    return createConfig();
  }

  return Object.entries(config).reduce<any>(
    (acc, [key, value]) => ({ ...acc, [key]: JSON.parse(value) }),
    {}
  );
};

/**
 * アプリにプラグインの設定情報を保存します
 * @param target 保存する設定情報
 * @param callback 実行完了後イベント
 */
export const storeStorage = (target: Record<string, any>, callback?: () => void): void => {
  const converted = Object.entries(target).reduce(
    (acc, [key, value]) => ({ ...acc, [key]: JSON.stringify(value) }),
    {}
  );

  kintone.plugin.app.setConfig(converted, callback);
};

/**
 * プラグインの設定情報のひな形を返却します
 */
const createConfig = (): Plugin.Config => ({
  version: 1,
  conditions: [getNewCondition()],
});

export const getNewCondition = (): Plugin.Condition => ({
  viewId: '',
  initialView: 'timeGridWeek',
  enablesAllDay: true,
  allDayOption: '',
  enablesNote: false,
  slotMinTime: '0:00:00',
  slotMaxTime: '24:00:00',
  calendarEvent: {
    titleField: '',
    startField: '',
    endField: '',
    allDayField: '',
    noteField: '',
    categoryField: '',
  },
});

export const getUpdatedStorage = <T extends keyof Plugin.Condition>(
  storage: Plugin.Config | null,
  props: {
    conditionIndex: number;
    key: T;
    value: Plugin.Condition[T];
  }
) => {
  const { conditionIndex, key, value } = props;
  return produce(storage, (draft) => {
    if (!draft) {
      return;
    }
    draft.conditions[conditionIndex][key] = value;
  });
};

export const getConditionField = <T extends keyof Plugin.Condition>(
  storage: Plugin.Config | null,
  props: {
    conditionIndex: number;
    key: T;
    defaultValue: NonNullable<Plugin.Condition[T]>;
  }
): NonNullable<Plugin.Condition[T]> => {
  const { conditionIndex, key, defaultValue } = props;
  if (!storage || !storage.conditions[conditionIndex]) {
    return defaultValue;
  }
  return storage.conditions[conditionIndex][key] ?? defaultValue;
};
