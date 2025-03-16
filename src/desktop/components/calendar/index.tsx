import { useCalendar } from '@/desktop/hooks/use-calendar';
import allLocales from '@fullcalendar/core/locales-all';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useAtomValue, useSetAtom } from 'jotai';
import { FC } from 'react';
import {
  filteredCalendarEventsAtom,
  handleCalendarDateSelectAtom,
  handleCalendarEventAddAtom,
} from '../../states/calendar';
import { pluginConditionAtom } from '../../states/kintone';

const Component: FC = () => {
  const calendarEvents = useAtomValue(filteredCalendarEventsAtom);
  const pluginCondition = useAtomValue(pluginConditionAtom);
  const onCalendarDateSelect = useSetAtom(handleCalendarDateSelectAtom);
  const onCalendarEventAdd = useSetAtom(handleCalendarEventAddAtom);
  const { onCalendarEventClick, onCalendarEventChange, onCalendarEventRemove } = useCalendar();

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
        center: 'title',
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
