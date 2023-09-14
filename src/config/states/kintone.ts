import { selector } from 'recoil';
import { getAppViews } from '@/common/kintone-api';
import { ViewForResponse } from '@kintone/rest-api-client/lib/src/client/types';
import { getAppId } from '@lb-ribbit/kintone-xapp';
import { getFormFields, kintoneAPI } from '@konomi-app/kintone-utilities';
import { GUEST_SPACE_ID } from '@/common/global';

const PREFIX = 'kintone';

export const appFieldsState = selector<kintoneAPI.FieldProperty[]>({
  key: `${PREFIX}appFieldsState`,
  get: async () => {
    const app = getAppId()!;
    const { properties } = await getFormFields({
      app,
      preview: true,
      guestSpaceId: GUEST_SPACE_ID,
      debug: process.env.NODE_ENV === 'development',
    });

    const values = Object.values(properties);

    return values.sort((a, b) => a.label.localeCompare(b.label, 'ja'));
  },
});

export const dateTimeFieldsState = selector<kintoneAPI.FieldProperty[]>({
  key: `${PREFIX}dateTimeFieldsState`,
  get: async ({ get }) => {
    const fields = get(appFieldsState);

    return fields.filter((field) => field.type === 'DATETIME');
  },
});

export const stringFieldsState = selector<kintoneAPI.FieldProperty[]>({
  key: `${PREFIX}stringFieldsState`,
  get: async ({ get }) => {
    const fields = get(appFieldsState);

    const types: kintoneAPI.FieldPropertyType[] = [
      'SINGLE_LINE_TEXT',
      'MULTI_LINE_TEXT',
      'RICH_TEXT',
    ];

    return fields.filter((field) => types.includes(field.type));
  },
});

export const checkboxFieldsState = selector<kintoneAPI.property.CheckBox[]>({
  key: `${PREFIX}checkboxFieldsState`,
  get: async ({ get }) => {
    const fields = get(appFieldsState);
    const checkboxFields = fields.filter((field) => field.type === 'CHECK_BOX');
    return checkboxFields as kintoneAPI.property.CheckBox[];
  },
});

export const selectableFieldsState = selector<
  (kintoneAPI.property.CheckBox | kintoneAPI.property.Dropdown | kintoneAPI.property.RadioButton)[]
>({
  key: `${PREFIX}selectableFieldsState`,
  get: async ({ get }) => {
    const fields = get(appFieldsState);
    const targetFields = fields.filter((field) =>
      ['CHECK_BOX', 'DROP_DOWN', 'RADIO_BUTTON'].includes(field.type)
    );
    return targetFields as (
      | kintoneAPI.property.CheckBox
      | kintoneAPI.property.Dropdown
      | kintoneAPI.property.RadioButton
    )[];
  },
});

const allAppViewsState = selector({
  key: 'allAppViewsState',
  get: async () => {
    const allViews = await getAppViews();
    return allViews;
  },
});

export const customViewsState = selector({
  key: 'customViewsState',
  get: async ({ get }) => {
    const allViews = get(allAppViewsState);

    const filtered = Object.entries(allViews).filter(([_, view]) => view.type === 'CUSTOM');

    return filtered.reduce<Record<string, ViewForResponse>>(
      (acc, [name, view]) => ({ ...acc, [name]: view }),
      {}
    );
  },
});
