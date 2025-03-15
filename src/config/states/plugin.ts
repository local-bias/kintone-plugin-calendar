import { getUpdatedStorage, restorePluginConfig } from '@/lib/plugin';
import { PluginCondition, PluginConfig } from '@/schema/plugin-config';
import { produce } from 'immer';
import { RecoilState, atom, selector, selectorFamily } from 'recoil';

const PREFIX = 'plugin';

export const storageState = atom<PluginConfig>({
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

export const conditionsState = selector<PluginCondition[]>({
  key: `${PREFIX}conditionsState`,
  get: ({ get }) => {
    const storage = get(storageState);
    return storage?.conditions ?? [];
  },
});

const conditionPropertyState = selectorFamily<
  PluginCondition[keyof PluginCondition],
  keyof PluginCondition
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
          value: newValue as PluginCondition[keyof PluginCondition],
        })
      );
    },
});

export const calendarEventState = selectorFamily<
  PluginCondition['calendarEvent'][keyof PluginCondition['calendarEvent']],
  keyof PluginCondition['calendarEvent']
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
            newValue as PluginCondition['calendarEvent'][keyof PluginCondition['calendarEvent']];
        })
      );
    },
});

export const getConditionPropertyState = <T extends keyof PluginCondition>(property: T) =>
  conditionPropertyState(property) as unknown as RecoilState<PluginCondition[T]>;

export const viewIdState = getConditionPropertyState('viewId');
export const initialViewState = getConditionPropertyState('initialView');
export const enablesAllDayState = getConditionPropertyState('enablesAllDay');
export const alldayOptionState = getConditionPropertyState('allDayOption');
export const enablesNoteState = getConditionPropertyState('enablesNote');
export const slotMinTimeState = getConditionPropertyState('slotMinTime');
export const slotMaxTimeState = getConditionPropertyState('slotMaxTime');

export const calendarTitleState = calendarEventState('inputTitleField');
export const calendarStartState = calendarEventState('startField');
export const calendarEndState = calendarEventState('endField');
export const calendarAllDayState = calendarEventState('allDayField');
export const calendarNoteState = calendarEventState('noteField');
export const calendarCategoryState = calendarEventState('categoryField');
