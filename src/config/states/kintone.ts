import { atom, selector } from 'recoil';
import { ViewForResponse } from '@kintone/rest-api-client/lib/src/client/types';
import { getAppId } from '@lb-ribbit/kintone-xapp';
import { getFormFields, kintoneAPI } from '@konomi-app/kintone-utilities';
import { GUEST_SPACE_ID } from '@/lib/global';
import { calendarAllDayState } from './plugin';

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

export const dateTimeFieldsState = selector<
  (kintoneAPI.property.DateTime | kintoneAPI.property.Date)[]
>({
  key: `${PREFIX}dateTimeFieldsState`,
  get: async ({ get }) => {
    const fields = get(appFieldsState);

    const types: kintoneAPI.FieldPropertyType[] = ['DATETIME', 'DATE'];

    return fields.filter((field) => types.includes(field.type)) as (
      | kintoneAPI.property.DateTime
      | kintoneAPI.property.Date
    )[];
  },
});

type TextFieldProperty =
  | kintoneAPI.property.SingleLineText
  | kintoneAPI.property.MultiLineText
  | kintoneAPI.property.RichText;

export const stringFieldsState = selector<TextFieldProperty[]>({
  key: `${PREFIX}stringFieldsState`,
  get: async ({ get }) => {
    const fields = get(appFieldsState);

    const types: kintoneAPI.FieldPropertyType[] = [
      'SINGLE_LINE_TEXT',
      'MULTI_LINE_TEXT',
      'RICH_TEXT',
    ];

    return fields.filter((field) => types.includes(field.type)) as TextFieldProperty[];
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

export const allAppViewsState = atom<Record<string, kintoneAPI.view.Response>>({
  key: `${PREFIX}allAppViewsState`,
  default: {},
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

export const alldayOptionsState = selector<string[]>({
  key: 'alldayOptionsState',
  get: ({ get }) => {
    const targetField = get(calendarAllDayState);
    if (!targetField) {
      return [];
    }
    const checkboxFields = get(checkboxFieldsState);

    const field = checkboxFields.find((field) => field.code === targetField);
    if (!field) {
      return [];
    }

    return Object.keys(field.options);
  },
});
