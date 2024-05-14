import { selector } from 'recoil';
import { appPropertiesState, pluginConditionState } from './kintone';

const PREFIX = 'plugin';

export const hasStartTimeState = selector<boolean>({
  key: `${PREFIX}hasStartTimeState`,
  get: ({ get }) => {
    const condition = get(pluginConditionState);
    const properties = get(appPropertiesState);

    if (!condition?.calendarEvent.startField) {
      return false;
    }

    const startField = properties[condition.calendarEvent.startField];
    if (!startField) {
      return false;
    }

    return startField.type === 'DATETIME';
  },
});

export const hasEndTimeState = selector<boolean>({
  key: `${PREFIX}hasEndTimeState`,
  get: ({ get }) => {
    const condition = get(pluginConditionState);
    const properties = get(appPropertiesState);

    if (!condition?.calendarEvent.endField) {
      return false;
    }

    const endField = properties[condition.calendarEvent.endField];
    if (!endField) {
      return false;
    }

    return endField.type === 'DATETIME';
  },
});
