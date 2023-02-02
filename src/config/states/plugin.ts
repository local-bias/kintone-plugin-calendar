import { getConditionField, getUpdatedStorage } from '@common/plugin';
import produce from 'immer';
import { atom, selector, selectorFamily } from 'recoil';

const PREFIX = 'plugin';

export const pluginIdState = atom<string>({ key: `${PREFIX}pluginIdState`, default: '' });

export const storageState = atom<kintone.plugin.Storage | null>({
  key: `${PREFIX}storageState`,
  default: null,
});

export const loadingState = atom<boolean>({
  key: `${PREFIX}loadingState`,
  default: false,
});

export const tabIndexState = atom<number>({
  key: `${PREFIX}tabIndexState`,
  default: 0,
});

export const conditionsState = selector<kintone.plugin.Condition[]>({
  key: `${PREFIX}conditionsState`,
  get: ({ get }) => {
    const storage = get(storageState);
    return storage?.conditions ?? [];
  },
});

export const conditionState = selectorFamily<kintone.plugin.Condition | null, number>({
  key: `${PREFIX}conditionState`,
  get:
    (conditionIndex) =>
    ({ get }) => {
      const storage = get(storageState);
      return !storage ? null : storage.conditions[conditionIndex] ?? null;
    },
  set:
    (conditionIndex) =>
    ({ set }, newValue) => {
      set(storageState, (current) =>
        produce(current, (draft) => {
          if (!draft) {
            return;
          }
          draft.conditions[conditionIndex] = newValue as kintone.plugin.Condition;
        })
      );
    },
});

export const viewIdState = selector<string>({
  key: `${PREFIX}viewIdState`,
  get: ({ get }) => {
    const conditionIndex = get(tabIndexState);
    return getConditionField(get(storageState), {
      conditionIndex,
      key: 'viewId',
      defaultValue: '',
    });
  },
  set: ({ get, set }, newValue) => {
    const conditionIndex = get(tabIndexState);
    set(storageState, (current) =>
      getUpdatedStorage(current, {
        conditionIndex,
        key: 'viewId',
        value: newValue as string,
      })
    );
  },
});

export const initialViewState = selector<kintone.plugin.ViewType>({
  key: `${PREFIX}initialViewState`,
  get: ({ get }) => {
    const conditionIndex = get(tabIndexState);
    return getConditionField(get(storageState), {
      conditionIndex,
      key: 'initialView',
      defaultValue: 'timeGridWeek',
    });
  },
  set: ({ get, set }, newValue) => {
    const conditionIndex = get(tabIndexState);
    set(storageState, (current) =>
      getUpdatedStorage(current, {
        conditionIndex,
        key: 'initialView',
        value: newValue as kintone.plugin.ViewType,
      })
    );
  },
});

export const enablesAllDayState = selector<boolean>({
  key: `${PREFIX}enablesAllDayState`,
  get: ({ get }) => {
    const conditionIndex = get(tabIndexState);
    return getConditionField(get(storageState), {
      conditionIndex,
      key: 'enablesAllDay',
      defaultValue: true,
    });
  },
  set: ({ get, set }, newValue) => {
    const conditionIndex = get(tabIndexState);
    set(storageState, (current) =>
      getUpdatedStorage(current, {
        conditionIndex,
        key: 'enablesAllDay',
        value: newValue as boolean,
      })
    );
  },
});

export const allDayOptionState = selector<string>({
  key: `${PREFIX}allDayOptionState`,
  get: ({ get }) => {
    const conditionIndex = get(tabIndexState);
    return getConditionField(get(storageState), {
      conditionIndex,
      key: 'allDayOption',
      defaultValue: '',
    });
  },
  set: ({ get, set }, newValue) => {
    const conditionIndex = get(tabIndexState);
    set(storageState, (current) =>
      getUpdatedStorage(current, {
        conditionIndex,
        key: 'allDayOption',
        value: newValue as string,
      })
    );
  },
});

export const enablesNoteState = selector<boolean>({
  key: `${PREFIX}enablesNoteState`,
  get: ({ get }) => {
    const conditionIndex = get(tabIndexState);
    return getConditionField(get(storageState), {
      conditionIndex,
      key: 'enablesNote',
      defaultValue: false,
    });
  },
  set: ({ get, set }, newValue) => {
    const conditionIndex = get(tabIndexState);
    set(storageState, (current) =>
      getUpdatedStorage(current, {
        conditionIndex,
        key: 'enablesNote',
        value: newValue as boolean,
      })
    );
  },
});

export const slotMinTimeState = selector<string>({
  key: `${PREFIX}slotMinTimeState`,
  get: ({ get }) => {
    const conditionIndex = get(tabIndexState);
    return getConditionField(get(storageState), {
      conditionIndex,
      key: 'slotMinTime',
      defaultValue: '0:00:00',
    });
  },
  set: ({ get, set }, newValue) => {
    const conditionIndex = get(tabIndexState);
    set(storageState, (current) =>
      getUpdatedStorage(current, {
        conditionIndex,
        key: 'slotMinTime',
        value: newValue as string,
      })
    );
  },
});

export const slotMaxTimeState = selector<string>({
  key: `${PREFIX}slotMaxTimeState`,
  get: ({ get }) => {
    const conditionIndex = get(tabIndexState);
    return getConditionField(get(storageState), {
      conditionIndex,
      key: 'slotMaxTime',
      defaultValue: '24:00:00',
    });
  },
  set: ({ get, set }, newValue) => {
    const conditionIndex = get(tabIndexState);
    set(storageState, (current) =>
      getUpdatedStorage(current, {
        conditionIndex,
        key: 'slotMaxTime',
        value: newValue as string,
      })
    );
  },
});

export const calendarEventState = selector<any>({
  key: `${PREFIX}calendarEventState`,
  get: ({ get }) => {
    const conditionIndex = get(tabIndexState);
    return getConditionField(get(storageState), {
      conditionIndex,
      key: 'calendarEvent',
      defaultValue: {
        titleField: '',
        startField: '',
        endField: '',
        allDayField: '',
        noteField: '',
        categoryField: '',
      },
    });
  },
  set: ({ get, set }, newValue) => {
    const conditionIndex = get(tabIndexState);
    set(storageState, (current) =>
      getUpdatedStorage(current, {
        conditionIndex,
        key: 'calendarEvent',
        value: newValue,
      })
    );
  },
});
