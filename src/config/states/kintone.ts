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
