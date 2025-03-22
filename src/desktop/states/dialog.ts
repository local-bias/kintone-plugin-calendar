import { produce } from 'immer';
import { atom } from 'jotai';
import { SetStateAction } from 'react';
import { addNewRecord, reschedule } from '../actions';
import { calendarEventsAtom, PluginCalendarEvent } from './calendar';
import { appPropertiesAtom, loadingAtom, pluginConditionAtom } from './kintone';

export const dialogShownAtom = atom<boolean>(false);

export const dialogPropsAtom = atom<{ new: boolean; event: PluginCalendarEvent }>({
  new: false,
  event: {},
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

export const handleDialogSubmitAtom = atom(null, async (get, set) => {
  set(loadingAtom, true);
  try {
    const currentProps = await get(dialogPropsAtom);
    const condition = await get(pluginConditionAtom);
    const properties = await get(appPropertiesAtom);

    if (currentProps.new) {
      const newEvent = await addNewRecord({
        calendarEvent: currentProps.event,
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
        calendarEvent: currentProps.event,
        condition: condition!,
        properties,
      });
      set(calendarEventsAtom, (current) =>
        produce(current, (draft) => {
          const index = draft.findIndex((event) => event.id === currentProps.event.id);
          draft[index] = currentProps.event;
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
