import { produce } from 'immer';
import { atom } from 'jotai';
import { SetStateAction } from 'react';
import { addNewRecord, reschedule, dateInputToDateTime, dateTimeToDateInput } from '../actions';
import { calendarEventsAtom, PluginCalendarEvent } from './calendar';
import { appPropertiesAtom, loadingAtom, pluginConditionAtom } from './kintone';

export const dialogShownAtom = atom<boolean>(false);

export const dialogPropsAtom = atom<{ new: boolean; event: PluginCalendarEvent }>({
  new: false,
  event: {},
});

export const handleDialogCloseAtom = atom(null, async (get, set) => {
  const currentProps = await get(dialogPropsAtom);

  if (currentProps.new) {
    set(calendarEventsAtom, (current) => current.filter(({ id }) => id !== currentProps.event.id));
  }
  set(dialogShownAtom, false);
  set(dialogPropsAtom, { new: false, event: {} });
});

// export const dialogEventAtom = focusAtom(dialogPropsAtom, (o) => o.prop('event'));
export const dialogEventAtom = atom(
  (get) => get(dialogPropsAtom).event,
  (get, set, newValue: SetStateAction<PluginCalendarEvent>) => {
    set(dialogPropsAtom, (current) =>
      produce(current, (draft) => {
        draft.event = typeof newValue === 'function' ? newValue(draft.event) : newValue;
      })
    );
  }
);

// export const dialogEventTitleAtom = focusAtom(dialogEventAtom, (o) => o.prop('title'));
export const dialogEventTitleAtom = atom(
  (get) => get(dialogEventAtom).title,
  (get, set, newValue: SetStateAction<string | undefined>) => {
    set(dialogEventAtom, (current) =>
      produce(current, (draft) => {
        draft.title = typeof newValue === 'function' ? newValue(draft.title) : newValue;
      })
    );
  }
);

// export const dialogEventNoteAtom = focusAtom(dialogEventAtom, (o) => o.prop('note'));
export const dialogEventNoteAtom = atom(
  (get) => get(dialogEventAtom).note,
  (get, set, newValue: SetStateAction<string | undefined>) => {
    set(dialogEventAtom, (current) =>
      produce(current, (draft) => {
        draft.note = typeof newValue === 'function' ? newValue(draft.note) : newValue;
      })
    );
  }
);

export const dialogAllDayAtom = atom(
  (get) => get(dialogEventAtom).allDay,
  (get, set, newValue: SetStateAction<boolean>) => {
    set(dialogEventAtom, (current) =>
      produce(current, (draft) => {
        draft.allDay = typeof newValue === 'function' ? newValue(!!draft.allDay) : newValue;
      })
    );
  }
);

export const handleDialogSubmitAtom = atom(null, async (get, set) => {
  set(loadingAtom, true);
  try {
    const currentProps = await get(dialogPropsAtom);
    const condition = await get(pluginConditionAtom);
    const properties = await get(appPropertiesAtom);

    // 全日イベントの場合、FullCalendarが期待する形式（終了日が翌日の0時0分）に調整
    const adjustedEvent = produce(currentProps.event, (draft) => {
      if (draft.allDay && draft.end) {
        const endDateTime = dateInputToDateTime(draft.end);
        const adjustedEndDateTime = endDateTime.plus({ days: 1 });
        draft.end = dateTimeToDateInput(adjustedEndDateTime);
      }
    });

    if (currentProps.new) {
      const newEvent = await addNewRecord({
        calendarEvent: adjustedEvent,
        condition: condition!,
        properties,
      });
      set(dialogPropsAtom, (current) =>
        produce(current, (draft) => {
          draft.event = newEvent;
        })
      );
      set(calendarEventsAtom, (current) =>
        produce(current, (draft) => {
          const index = draft.findIndex((event) => event.id === currentProps.event.id);
          draft[index] = newEvent;
        })
      );
    } else {
      await reschedule({
        calendarEvent: adjustedEvent,
        condition: condition!,
        properties,
      });
      set(calendarEventsAtom, (current) =>
        produce(current, (draft) => {
          const index = draft.findIndex((event) => event.id === currentProps.event.id);
          draft[index] = adjustedEvent;
        })
      );
    }

    set(dialogShownAtom, false);
    set(dialogPropsAtom, { new: false, event: {} });
  } catch (error) {
    console.error(error);
  } finally {
    set(loadingAtom, false);
  }
});
