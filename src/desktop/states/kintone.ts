import { GUEST_SPACE_ID } from '@/lib/global';
import { PREDEFINED_FIELDS } from '@/lib/kintone-rest-api';
import { getSortedOptions } from '@/lib/utils';
import { PluginCondition } from '@/schema/plugin-config';
import { getAppId, getFormFields, kintoneAPI } from '@konomi-app/kintone-utilities';
import { atom } from 'jotai';

export const pluginConditionAtom = atom<PluginCondition | null>(null);

export const loadingAtom = atom<boolean>(false);

export const kintoneRecordsAtom = atom<kintoneAPI.RecordData[]>([]);

export const appPropertiesAtom = atom<Promise<kintoneAPI.FieldProperties>>(async () => {
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
});

export const calendarEventCategoryAtom = atom<Promise<string[] | null>>(async (get) => {
  const condition = get(pluginConditionAtom);
  if (!condition?.calendarEvent.categoryField) {
    return null;
  }

  const properties = await get(appPropertiesAtom);
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
});
