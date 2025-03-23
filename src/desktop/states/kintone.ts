import { GUEST_SPACE_ID } from '@/lib/global';
import { PREDEFINED_FIELDS } from '@/lib/kintone-rest-api';
import { getSortedOptions } from '@/lib/utils';
import { PluginCondition } from '@/schema/plugin-config';
import { getAppId, getFormFields, kintoneAPI } from '@konomi-app/kintone-utilities';
import { atom } from 'jotai';
import { derive } from 'jotai-derive';

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

export const categoryFieldPropertyAtom = derive(
  [appPropertiesAtom, pluginConditionAtom],
  (formFields, pluginCondition) => {
    if (!pluginCondition?.calendarEvent.categoryField) {
      return null;
    }
    return formFields[pluginCondition.calendarEvent.categoryField];
  }
);

export const calendarEventCategoryAtom = derive([categoryFieldPropertyAtom], (categoryProperty) => {
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
