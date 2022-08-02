import { getUserDefinedFields } from '@common/kintone-api';
import { kx } from '@type/kintone.api';
import { atom, selector } from 'recoil';

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

export const appPropertiesState = selector<kx.FieldProperties>({
  key: `${PREFIX}appPropertiesState`,
  get: () => getUserDefinedFields(),
});

export const calendarEventCategoryState = selector<string[] | null>({
  key: `${PREFIX}calendarEventCategoryState`,
  get: ({ get }) => {
    const condition = get(pluginConditionState);
    if (!condition || !condition.calendarEvent.categoryField) {
      return null;
    }

    const properties = get(appPropertiesState);
    const categoryProperty = properties[condition.calendarEvent.categoryField];

    if (
      categoryProperty.type !== 'CHECK_BOX' &&
      categoryProperty.type !== 'RADIO_BUTTON' &&
      categoryProperty.type !== 'DROP_DOWN'
    ) {
      return null;
    }

    return Object.keys(categoryProperty.options);
  },
});
