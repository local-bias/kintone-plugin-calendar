import { useRecoilCallback } from 'recoil';
import {
  DateSelectArg,
  EventAddArg,
  EventChangeArg,
  EventClickArg,
  EventRemoveArg,
} from '@fullcalendar/core';
import { calendarEventsState } from '../states/calendar';
import { dialogPropsState, dialogShownState } from '../states/dialog';
import { useSnackbar } from 'notistack';
import { appPropertiesState, loadingState, pluginConditionState } from '../states/kintone';
import { completeCalendarEvent, reschedule } from '../actions';
import { produce } from 'immer';

export const useCalendar = () => {
  const { enqueueSnackbar } = useSnackbar();

  const onCalendarDateSelect = useRecoilCallback(
    ({ set }) =>
      async (props: DateSelectArg) => {
        const temporaryKey = Math.random().toString();

        const completed = completeCalendarEvent({
          id: temporaryKey,
          allDay: props.allDay,
          start: props.start,
          end: props.end,
        });

        set(calendarEventsState, (current) => produce(current, (draft) => [...draft, completed]));
        set(dialogPropsState, {
          new: true,
          event: completed,
        });
        set(dialogShownState, true);
      },
    []
  );

  const onCalendarEventAdd = useRecoilCallback(
    () => (props: EventAddArg) => {
      console.info('📅 イベントが追加されました', props);
    },
    []
  );

  const onCalendarEventRemove = useRecoilCallback(
    () => (props: EventRemoveArg) => {
      process.env.NODE_ENV === 'development' && console.info('📅 イベントが削除されました', props);
    },
    []
  );

  const onCalendarEventClick = useRecoilCallback(
    ({ set, snapshot }) =>
      async (props: EventClickArg) => {
        const calendarEvents = await snapshot.getPromise(calendarEventsState);
        const foundEvent = calendarEvents.find(
          (event) => event.id && props.event.id && event.id === props.event.id
        );
        if (!foundEvent) {
          enqueueSnackbar('クリックしたイベントの取得に失敗しました', { variant: 'error' });
          return;
        }
        set(dialogPropsState, {
          new: false,
          event: foundEvent,
        });
        set(dialogShownState, true);
      },
    []
  );

  const onCalendarEventChange = useRecoilCallback(
    ({ set, snapshot }) =>
      async (props: EventChangeArg) => {
        set(loadingState, true);

        try {
          const changed = props.event;

          const properties = await snapshot.getPromise(appPropertiesState);
          const events = await snapshot.getPromise(calendarEventsState);
          let index = 0;
          const targetEvent = events.find(({ id }, i) => {
            index = i;
            return id === props.event.id;
          });
          if (!targetEvent) {
            console.warn('更新対象レコードに紐づくカレンダーイベントの取得に失敗しました');
            return;
          }

          const newEvent = {
            ...targetEvent,
            start: changed.start || targetEvent.start,
            end: changed.end || targetEvent.end,
          };
          set(calendarEventsState, (current) => {
            const newEvents = [...current];
            newEvents[index] = newEvent;
            return newEvents;
          });

          const condition = await snapshot.getPromise(pluginConditionState);
          await reschedule({
            calendarEvent: newEvent,
            condition: condition!,
            properties,
          });
          console.info('レコードを更新しました');
        } finally {
          set(loadingState, false);
        }
      },
    []
  );

  return {
    onCalendarDateSelect,
    onCalendarEventAdd,
    onCalendarEventClick,
    onCalendarEventChange,
    onCalendarEventRemove,
  };
};
