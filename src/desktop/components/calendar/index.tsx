import { useCalendar } from '@/desktop/hooks/use-calendar';
import { getSlotTime } from '@/lib/calendar';
import allLocales from '@fullcalendar/core/locales-all';
import jaJP from '@fullcalendar/core/locales/ja';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  fullcalendarRefAtom,
  handleCalendarDateSelectAtom,
  handleCalendarEventAddAtom,
  textFilteredCalendarEventsAtom,
} from '../../states/calendar';
import { pluginConditionAtom } from '../../states/kintone';
import DayHeader from './day-header';
import CalendarEvent from './event';

function FullCalendarRoot() {
  const setFullcalendarRef = useSetAtom(fullcalendarRefAtom);
  const calendarEvents = useAtomValue(textFilteredCalendarEventsAtom);
  const pluginCondition = useAtomValue(pluginConditionAtom);
  const onCalendarDateSelect = useSetAtom(handleCalendarDateSelectAtom);
  const onCalendarEventAdd = useSetAtom(handleCalendarEventAddAtom);
  const { onCalendarEventClick, onCalendarEventChange, onCalendarEventRemove } = useCalendar();

  return (
    <FullCalendar
      ref={setFullcalendarRef}
      locale={jaJP}
      locales={allLocales}
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView={pluginCondition?.initialView ?? 'timeGridWeek'}
      businessHours={{
        daysOfWeek: pluginCondition?.daysOfWeek,
        startTime: '00:00',
        endTime: '24:00',
      }}
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
      firstDay={pluginCondition?.firstDay}
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
      slotMinTime={getSlotTime(pluginCondition?.slotMinTime || '0')}
      slotMaxTime={getSlotTime(pluginCondition?.slotMaxTime || '24')}
      themeSystem='normal'
      nowIndicator
      slotLabelContent={(props) => <span className='text-foreground/50'>{props.text}</span>}
      allDayContent={(props) => <span className='text-foreground/50'>{props.text}</span>}
      dayHeaderContent={DayHeader}
      // slotLaneContent={(props) => <pre>{JSON.stringify(props, null, 2)}</pre>}
      // weekNumberContent={(props) => <pre>{JSON.stringify(props, null, 2)}</pre>}
      // moreLinkContent={(props) => <pre>{JSON.stringify(props, null, 2)}</pre>}
      eventContent={CalendarEvent}
      select={onCalendarDateSelect}
      eventClick={onCalendarEventClick}
      eventChange={onCalendarEventChange}
      eventAdd={onCalendarEventAdd}
      eventRemove={onCalendarEventRemove}
      height='auto'
      handleWindowResize
    />
  );
}

export default function FullCalendarContainer() {
  return (
    <div className='p-2 md:p-4'>
      <FullCalendarRoot />
    </div>
  );
}
