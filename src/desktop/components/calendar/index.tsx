import React, { FC } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import FullCalendar, {
  DateSelectArg,
  EventAddArg,
  EventChangeArg,
  EventClickArg,
  EventRemoveArg,
} from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import allLocales from '@fullcalendar/core/locales-all';
import { calendarEventsState } from '../../states/calendar';
import produce from 'immer';
import { dialogPropsState, dialogShownState } from '../../states/dialog';
import { completeCalendarEvent, convertEventApiIntoEventInput, updateRecord } from '../../actions';
import { pluginConditionState } from '../../states/kintone';
import { useSnackbar } from 'notistack';

const Component: FC = () => {
  const calendarEvents = useRecoilValue(calendarEventsState);
  const pluginCondition = useRecoilValue(pluginConditionState);
  const { enqueueSnackbar } = useSnackbar();

  const onEventClick = useRecoilCallback(
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

  const onEventAdd = (props: EventAddArg) => {
    console.info('📅 イベントが追加されました', props);
  };

  const onDateSelect = useRecoilCallback(
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

  const onEventChange = useRecoilCallback(
    ({ set, snapshot }) =>
      async (props: EventChangeArg) => {
        const changed = props.event;
        set(calendarEventsState, (current) =>
          produce(current, (draft) => {
            const index = draft.findIndex(({ id }) => id === changed.id);
            if (index === -1) {
              console.warn('紐づくレコードが見つかりませんでした', index);
              return;
            }
            draft[index] = {
              ...draft[index],
              start: changed.start || draft[index].start,
              end: changed.end || draft[index].end,
            };
          })
        );

        const condition = await snapshot.getPromise(pluginConditionState);
        const eventInput = convertEventApiIntoEventInput(props.event);
        await updateRecord(eventInput, condition!);
        console.info('レコードを更新しました');
      },
    []
  );

  const onEventRemove = (props: EventRemoveArg) => {
    console.info('📅 イベントが削除されました', props);
  };

  return (
    <FullCalendar
      locale='ja'
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView='timeGridWeek'
      locales={allLocales}
      headerToolbar={{
        left: 'prev,next today',
        center: '',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      }}
      events={calendarEvents}
      allDaySlot={pluginCondition?.enablesAllDay}
      editable
      selectable
      selectMirror
      slotMinTime={pluginCondition?.slotMinTime || '0:00:00'}
      slotMaxTime={pluginCondition?.slotMaxTime || '24:00:00'}
      themeSystem='normal'
      select={onDateSelect}
      eventClick={onEventClick}
      eventChange={onEventChange}
      eventAdd={onEventAdd}
      eventRemove={onEventRemove}
      height='auto'
    />
  );
};

export default Component;
