import { EventChangeArg, EventClickArg, EventRemoveArg } from '@fullcalendar/core';
import { atom, useSetAtom } from 'jotai';
import { enqueueSnackbar } from 'notistack';
import { reschedule } from '../actions';
import { calendarEventsAtom } from '../states/calendar';
import { dialogPropsAtom, dialogShownAtom } from '../states/dialog';
import { appPropertiesAtom, loadingAtom, pluginConditionAtom } from '../states/kintone';
import { isDev } from '@/lib/global';
import { extractErrorMessage } from '@/lib/error';

const handleCalendarEventDeleteAtom = atom(null, (get, set, props: EventRemoveArg) => {
  console.info('📅 イベントが削除されました', props);
});

const handleCalendarEventClickAtom = atom(null, (get, set, props: EventClickArg) => {
  const calendarEvents = get(calendarEventsAtom);
  const foundEvent = calendarEvents.find(
    (event) => event.id && props.event.id && event.id === props.event.id
  );
  if (!foundEvent) {
    enqueueSnackbar('クリックしたイベントの取得に失敗しました', { variant: 'error' });
    return;
  }
  set(dialogPropsAtom, {
    new: false,
    event: foundEvent,
  });
  set(dialogShownAtom, true);
});

const handleCalendarEventChangeAtom = atom(null, async (get, set, props: EventChangeArg) => {
  set(loadingAtom, true);

  try {
    const changed = props.event;

    const properties = await get(appPropertiesAtom);
    const events = get(calendarEventsAtom);
    let index = 0;
    const targetEvent = events.find(({ id }, i) => {
      index = i;
      return id === props.event.id;
    });
    if (!targetEvent) {
      console.warn('更新対象レコードに紐づくカレンダーイベントの取得に失敗しました');
      return;
    }

    console.log({ changed, targetEvent });

    const newEvent = {
      ...targetEvent,
      start: changed.start || targetEvent.start,
      end: changed.end || targetEvent.end,
    };
    set(calendarEventsAtom, (current) => {
      const newEvents = [...current];
      newEvents[index] = newEvent;
      return newEvents;
    });

    const condition = get(pluginConditionAtom);
    await reschedule({
      calendarEvent: newEvent,
      condition: condition!,
      properties,
    });
    isDev && console.info('レコードを更新しました');
  } catch (error) {
    console.error(error);
    enqueueSnackbar(`レコードの更新に失敗しました: ${extractErrorMessage(error)}`, {
      variant: 'error',
    });
  } finally {
    set(loadingAtom, false);
  }
});

export const useCalendar = () => {
  const onCalendarEventRemove = useSetAtom(handleCalendarEventDeleteAtom);
  const onCalendarEventClick = useSetAtom(handleCalendarEventClickAtom);
  const onCalendarEventChange = useSetAtom(handleCalendarEventChangeAtom);

  return { onCalendarEventClick, onCalendarEventChange, onCalendarEventRemove };
};
