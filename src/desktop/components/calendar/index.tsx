import React, { FC } from 'react';
import FullCalendar, { DateSelectArg, EventChangeArg, EventClickArg } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import allLocales from '@fullcalendar/core/locales-all';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { calendarEventsState } from '../../states/calendar';
import produce from 'immer';
import { dialogPropsState, dialogShownState } from '../../states/dialog';
import { completeCalendarEvent } from '../../actions';

const Component: FC = () => {
  const calendarEvents = useRecoilValue(calendarEventsState);

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

  const onEventAdd = (props: any) => {};

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
        const changed = props.event;
        set(calendarEventsState, (current) =>
          produce(current, (draft) => {
            const index = draft.findIndex((event) => event.id === changed.id);
            if (index !== -1) {
              draft[index] = {
                ...draft[index],
                start: changed.start || draft[index].start,
                end: changed.end || draft[index].end,
              };
            }
          })
        );
      },
    []
  );

  const onEventRemove = (props: any) => {};

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
