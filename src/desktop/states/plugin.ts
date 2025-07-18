import { CalendarViewType } from '@/schema/calendar';
import { derive } from 'jotai-derive';
import { atomWithDefault } from 'jotai/utils';
import { endFieldPropertyAtom, pluginConditionAtom, startFieldPropertyAtom } from './kintone';

export const hasStartTimeAtom = derive([startFieldPropertyAtom], (startField) => {
  return startField?.type === 'DATETIME';
});

export const hasEndTimeAtom = derive([endFieldPropertyAtom], (endField) => {
  return endField?.type === 'DATETIME';
});

export const isTimeSupportedAtom = derive(
  [hasStartTimeAtom, hasEndTimeAtom],
  (hasStartTime, hasEndTime) => {
    return hasStartTime && hasEndTime;
  }
);

export const calendarGridTypeAtom = atomWithDefault<CalendarViewType>((get) => {
  return get(pluginConditionAtom)?.initialView ?? 'timeGridWeek';
});
