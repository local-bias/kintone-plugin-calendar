import React, { FC } from 'react';
import { useRecoilValue } from 'recoil';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import allLocales from '@fullcalendar/core/locales-all';
import { filteredCalendarEventsState } from '../../states/calendar';
import { pluginConditionState } from '../../states/kintone';
import { useCalendar } from '@/desktop/hooks/use-calendar';

const Component: FC = () => {
  const calendarEvents = useRecoilValue(filteredCalendarEventsState);
  const pluginCondition = useRecoilValue(pluginConditionState);
  const {
    onCalendarDateSelect,
    onCalendarEventAdd,
    onCalendarEventClick,
    onCalendarEventChange,
    onCalendarEventRemove,
  } = useCalendar();

  return (
    <FullCalendar
      locale='ja'
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView={pluginCondition?.initialView ?? 'timeGridWeek'}
      views={{
        timeGridThreeDay: {
          type: 'timeGrid',
          duration: { days: 3 },
          buttonText: '3日',
        },
        timeGridFiveDay: {
          type: 'timeGrid',
          duration: { days: 5 },
          buttonText: '5日',
        },
      }}
      locales={allLocales}
      headerToolbar={{
        left: 'prev,next today',
        center: '',
        right: 'dayGridMonth,timeGridWeek,timeGridFiveDay,timeGridThreeDay,timeGridDay',
      }}
      events={calendarEvents}
      allDaySlot={pluginCondition?.enablesAllDay}
      editable
      selectable
      selectMirror
      slotMinTime={pluginCondition?.slotMinTime || '0:00:00'}
      slotMaxTime={pluginCondition?.slotMaxTime || '24:00:00'}
      themeSystem='normal'
      select={onCalendarDateSelect}
      eventClick={onCalendarEventClick}
      eventChange={onCalendarEventChange}
      eventAdd={onCalendarEventAdd}
      eventRemove={onCalendarEventRemove}
      height='auto'
    />
  );
};

export default Component;
