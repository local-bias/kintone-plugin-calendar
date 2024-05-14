import { GUEST_SPACE_ID } from '@/lib/global';
import { PREDEFINED_FIELDS } from '@/lib/kintone-rest-api';
import { getSortedOptions } from '@/lib/utils';
import { getFormFields, kintoneAPI } from '@konomi-app/kintone-utilities';
import { getAppId } from '@lb-ribbit/kintone-xapp';
import { atom, selector } from 'recoil';

const PREFIX = 'kintone';

export const pluginConditionState = atom<Plugin.Condition | null>({
  key: `${PREFIX}pluginConditionState`,
  default: null,
});

export const loadingState = atom<boolean>({
  key: `${PREFIX}loadingState`,
  default: false,
});

export const kintoneRecordsState = atom<kintoneAPI.RecordData[]>({
  key: `${PREFIX}kintoneRecordsState`,
  default: [],
});

export const appPropertiesState = selector<kintoneAPI.FieldProperties>({
  key: `${PREFIX}appPropertiesState`,
  get: async () => {
    const { properties } = await getFormFields({
      app: getAppId()!,
      guestSpaceId: GUEST_SPACE_ID,
      debug: process.env.NODE_ENV === 'development',
    });

    const filtered = Object.entries(properties).reduce<kintoneAPI.FieldProperties>(
      (acc, [key, property]) => {
        if (PREDEFINED_FIELDS.includes(property.type)) {
          return acc;
        }
        return { ...acc, [key]: property };
      },
      {}
    );
    return filtered;
  },
});

export const calendarEventCategoryState = selector<string[] | null>({
  key: `${PREFIX}calendarEventCategoryState`,
  get: ({ get }) => {
    const condition = get(pluginConditionState);
    if (!condition?.calendarEvent.categoryField) {
      return null;
    }

    const properties = get(appPropertiesState);
    const categoryProperty: kintoneAPI.FieldProperty | undefined =
      properties[condition.calendarEvent.categoryField];

    if (
      !categoryProperty ||
      (categoryProperty.type !== 'CHECK_BOX' &&
        categoryProperty.type !== 'RADIO_BUTTON' &&
        categoryProperty.type !== 'DROP_DOWN')
    ) {
      return null;
    }

    return getSortedOptions(categoryProperty.options ?? {}).map((option) => option.label);
  },
});
