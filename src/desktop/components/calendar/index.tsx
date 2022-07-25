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
import { completeCalendarEvent } from '../../actions';
import { pluginConditionState } from '../../states/kintone';

const Component: FC = () => {
  const calendarEvents = useRecoilValue(calendarEventsState);
  const pluginCondition = useRecoilValue(pluginConditionState);

  const onEventClick = useRecoilCallback(
    ({ set }) =>
      (props: EventClickArg) => {
        set(dialogPropsState, {
          new: false,
          event: {
            id: props.event.id,
            allDay: props.event.allDay,
            start: props.event.start || undefined,
            end: props.event.end || undefined,
            title: props.event.title,
          },
        });
        set(dialogShownState, true);
      },
    []
  );

  const onEventAdd = (props: EventAddArg) => {};

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
    ({ set }) =>
      (props: EventChangeArg) => {
        console.log('🐶 onEventChange', props);
        const changed = props.event;
        set(calendarEventsState, (current) =>
          produce(current, (draft) => {
            const index = draft.findIndex((event) => event.id === changed.id);
            if (index !== -1) {
              return;
            }
            draft[index] = {
              ...draft[index],
              start: changed.start || draft[index].start,
              end: changed.end || draft[index].end,
            };
          })
        );
      },
    []
  );

  const onEventRemove = (props: EventRemoveArg) => {};

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
      themeSystem='normal'
      select={onDateSelect}
      eventClick={onEventClick}
      eventAdd={onEventAdd}
      eventChange={onEventChange}
      eventRemove={onEventRemove}
    />
  );
};

export default Component;
