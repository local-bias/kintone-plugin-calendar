import { derive } from 'jotai-derive';
import { appPropertiesAtom, pluginConditionAtom } from './kintone';

export const hasStartTimeAtom = derive(
  [pluginConditionAtom, appPropertiesAtom],
  (condition, properties) => {
    if (!condition?.calendarEvent.startField) {
      return false;
    }

    const startField = properties[condition.calendarEvent.startField];
    if (!startField) {
      return false;
    }

    return startField.type === 'DATETIME';
  }
);

export const hasEndTimeAtom = derive(
  [pluginConditionAtom, appPropertiesAtom],
  (condition, properties) => {
    if (!condition?.calendarEvent.endField) {
      return false;
    }

    const endField = properties[condition.calendarEvent.endField];
    if (!endField) {
      return false;
    }

    return endField.type === 'DATETIME';
  }
);
