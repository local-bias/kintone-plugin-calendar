import { useCalendar } from '@/desktop/hooks/use-calendar';
import allLocales from '@fullcalendar/core/locales-all';
import jaJP from '@fullcalendar/core/locales/ja';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useAtomValue, useSetAtom } from 'jotai';
import { FC } from 'react';
import {
  textFilteredCalendarEventsAtom,
  handleCalendarDateSelectAtom,
  handleCalendarEventAddAtom,
} from '../../states/calendar';
import { pluginConditionAtom } from '../../states/kintone';

const Component: FC = () => {
  const calendarEvents = useAtomValue(textFilteredCalendarEventsAtom);
  const pluginCondition = useAtomValue(pluginConditionAtom);
  const onCalendarDateSelect = useSetAtom(handleCalendarDateSelectAtom);
  const onCalendarEventAdd = useSetAtom(handleCalendarEventAddAtom);
  const { onCalendarEventClick, onCalendarEventChange, onCalendarEventRemove } = useCalendar();

  return (
    <FullCalendar
      locale={jaJP}
      locales={allLocales}
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
      headerToolbar={{
        left: 'title',
        center: '',
        right:
          'dayGridMonth,timeGridWeek,timeGridFiveDay,timeGridThreeDay,timeGridDay today prev,next',
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
      handleWindowResize
    />
  );
};

const CalendarContainer: FC = () => {
  return (
    <div className='p-4'>
      <Component />
    </div>
  );
};

export default CalendarContainer;
