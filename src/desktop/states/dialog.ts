import { produce } from 'immer';
import { atom } from 'jotai';
import { addNewRecord, reschedule } from '../actions';
import { calendarEventsAtom, PluginCalendarEvent } from './calendar';
import { appPropertiesAtom, loadingAtom, pluginConditionAtom } from './kintone';
import { focusAtom } from 'jotai-optics';

export const dialogShownAtom = atom<boolean>(false);

export const dialogPropsAtom = atom<{ new: boolean; event: PluginCalendarEvent }>({
  new: false,
  event: {},
});
export const dialogEventAtom = focusAtom(dialogPropsAtom, (o) => o.prop('event'));
export const dialogEventTitleAtom = focusAtom(dialogEventAtom, (o) => o.prop('title'));
export const dialogEventNoteAtom = focusAtom(dialogEventAtom, (o) => o.prop('note'));

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
