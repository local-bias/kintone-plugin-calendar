import { GUEST_SPACE_ID } from '@/lib/global';
import { getAppId, getFormFields, kintoneAPI } from '@konomi-app/kintone-utilities';
import { atom } from 'jotai';
import { derive } from 'jotai-derive';
import { calendarAllDayState } from './plugin';

const currentAppIdAtom = atom<number>(() => {
  const appId = getAppId();
  if (!appId) {
    throw new Error('アプリIDが取得できませんでした');
  }
  return appId;
});

export const appFieldsAtom = atom<Promise<kintoneAPI.FieldProperty[]>>(async (get) => {
  const app = get(currentAppIdAtom);
  const { properties } = await getFormFields({
    app,
    preview: true,
    guestSpaceId: GUEST_SPACE_ID,
    debug: process.env.NODE_ENV === 'development',
  });

  const values = Object.values(properties);

  return values.sort((a, b) => a.label.localeCompare(b.label, 'ja'));
});

export const dateTimeFieldsAtom = derive([appFieldsAtom], (fields) => {
  const types: kintoneAPI.FieldPropertyType[] = ['DATETIME', 'DATE'];

  return fields.filter((field) => types.includes(field.type)) as (
    | kintoneAPI.property.DateTime
    | kintoneAPI.property.Date
  )[];
});

type TextFieldProperty =
  | kintoneAPI.property.SingleLineText
  | kintoneAPI.property.MultiLineText
  | kintoneAPI.property.RichText;

export const stringFieldsAtom = derive([appFieldsAtom], (fields) => {
  const types: kintoneAPI.FieldPropertyType[] = [
    'SINGLE_LINE_TEXT',
    'MULTI_LINE_TEXT',
    'RICH_TEXT',
  ];

  return fields.filter((field) => types.includes(field.type)) as TextFieldProperty[];
});

export const checkboxFieldsAtom = derive([appFieldsAtom], (fields) => {
  return fields.filter((field) => field.type === 'CHECK_BOX') as kintoneAPI.property.CheckBox[];
});

export const selectableFieldsAtom = derive([appFieldsAtom], (fields) => {
  const types: kintoneAPI.FieldPropertyType[] = ['CHECK_BOX', 'DROP_DOWN', 'RADIO_BUTTON'];

  return fields.filter((field) => types.includes(field.type)) as (
    | kintoneAPI.property.CheckBox
    | kintoneAPI.property.Dropdown
    | kintoneAPI.property.RadioButton
  )[];
});

export const allAppViewsAtom = atom<Record<string, kintoneAPI.view.Response>>({});

export const customViewsAtom = atom((get) => {
  const allViews = get(allAppViewsAtom);
  const filtered = Object.entries(allViews).filter(([, view]) => view.type === 'CUSTOM');
  return Object.fromEntries(filtered);
});

export const alldayOptionsAtom = derive(
  [calendarAllDayState, checkboxFieldsAtom],
  (allDayField, checkboxFields) => {
    if (!allDayField) {
      return [];
    }

    const field = checkboxFields.find((field) => field.code === allDayField);
    if (!field) {
      return [];
    }

    return Object.keys(field.options);
  }
);
