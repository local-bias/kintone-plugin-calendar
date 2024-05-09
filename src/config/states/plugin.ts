import { getUpdatedStorage, restorePluginConfig } from '@/lib/plugin';
import { produce } from 'immer';
import { RecoilState, atom, selector, selectorFamily } from 'recoil';

const PREFIX = 'plugin';

export const storageState = atom<Plugin.Config>({
  key: `${PREFIX}storageState`,
  default: restorePluginConfig(),
});

export const loadingCountState = atom<number>({
  key: `${PREFIX}loadingCountState`,
  default: 0,
});

export const loadingState = selector<boolean>({
  key: `${PREFIX}loadingState`,
  get: ({ get }) => get(loadingCountState) > 0,
});

export const tabIndexState = atom<number>({
  key: `${PREFIX}tabIndexState`,
  default: 0,
});

export const conditionsState = selector<Plugin.Condition[]>({
  key: `${PREFIX}conditionsState`,
  get: ({ get }) => {
    const storage = get(storageState);
    return storage?.conditions ?? [];
  },
});

const conditionPropertyState = selectorFamily<
  Plugin.Condition[keyof Plugin.Condition],
  keyof Plugin.Condition
>({
  key: `${PREFIX}conditionPropertyState`,
  get:
    (key) =>
    ({ get }) => {
      const conditionIndex = get(tabIndexState);
      const storage = get(storageState);
      return storage.conditions[conditionIndex][key];
    },
  set:
    (key) =>
    ({ get, set }, newValue) => {
      const conditionIndex = get(tabIndexState);
      set(storageState, (current) =>
        getUpdatedStorage(current, {
          conditionIndex,
          key,
          value: newValue as Plugin.Condition[keyof Plugin.Condition],
        })
      );
    },
});

export const calendarEventState = selectorFamily<
  Plugin.Condition['calendarEvent'][keyof Plugin.Condition['calendarEvent']],
  keyof Plugin.Condition['calendarEvent']
>({
  key: `${PREFIX}calendarEventState`,
  get:
    (key) =>
    ({ get }) => {
      const conditionIndex = get(tabIndexState);
      const storage = get(storageState);
      return storage.conditions[conditionIndex].calendarEvent[key];
    },
  set:
    (key) =>
    ({ get, set }, newValue) => {
      const conditionIndex = get(tabIndexState);
      set(storageState, (current) =>
        produce(current, (draft) => {
          draft.conditions[conditionIndex].calendarEvent[key] =
            newValue as Plugin.Condition['calendarEvent'][keyof Plugin.Condition['calendarEvent']];
        })
      );
    },
});

export const getConditionPropertyState = <T extends keyof Plugin.Condition>(property: T) =>
  conditionPropertyState(property) as unknown as RecoilState<Plugin.Condition[T]>;

export const viewIdState = getConditionPropertyState('viewId');
export const initialViewState = getConditionPropertyState('initialView');
export const enablesAllDayState = getConditionPropertyState('enablesAllDay');
export const alldayOptionState = getConditionPropertyState('allDayOption');
export const enablesNoteState = getConditionPropertyState('enablesNote');
export const slotMinTimeState = getConditionPropertyState('slotMinTime');
export const slotMaxTimeState = getConditionPropertyState('slotMaxTime');

export const calendarTitleState = calendarEventState('titleField');
export const calendarStartState = calendarEventState('startField');
export const calendarEndState = calendarEventState('endField');
export const calendarAllDayState = calendarEventState('allDayField');
export const calendarNoteState = calendarEventState('noteField');
export const calendarCategoryState = calendarEventState('categoryField');
