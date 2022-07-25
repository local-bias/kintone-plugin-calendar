import { selector } from 'recoil';
import { getAppViews, getUserDefinedFields } from '@common/kintone-api';
import { kx } from '../../types/kintone.api';
import { ViewForResponse } from '@kintone/rest-api-client/lib/client/types';

const PREFIX = 'kintone';

export const appFieldsState = selector<kx.FieldProperty[]>({
  key: `${PREFIX}appFieldsState`,
  get: async () => {
    const properties = await getUserDefinedFields();

    const values = Object.values(properties);

    return values.sort((a, b) => a.label.localeCompare(b.label, 'ja'));
  },
});

export const dateTimeFieldsState = selector<kx.FieldProperty[]>({
  key: `${PREFIX}dateTimeFieldsState`,
  get: async ({ get }) => {
    const fields = get(appFieldsState);

    return fields.filter((field) => field.type === 'DATETIME');
  },
});

export const stringFieldsState = selector<kx.FieldProperty[]>({
  key: `${PREFIX}stringFieldsState`,
  get: async ({ get }) => {
    const fields = get(appFieldsState);

    const types: kx.FieldPropertyType[] = ['SINGLE_LINE_TEXT', 'MULTI_LINE_TEXT', 'RICH_TEXT'];

    return fields.filter((field) => types.includes(field.type));
  },
});

export const checkboxFieldsState = selector<kx.property.CheckBox[]>({
  key: `${PREFIX}checkboxFieldsState`,
  get: async ({ get }) => {
    const fields = get(appFieldsState);
    const checkboxFields = fields.filter((field) => field.type === 'CHECK_BOX');
    return checkboxFields as kx.property.CheckBox[];
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
