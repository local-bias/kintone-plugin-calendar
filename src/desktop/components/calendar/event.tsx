import { EventContentArg } from '@fullcalendar/core';

export default function CalendarEvent(props: EventContentArg) {
  return (
    <div className='flex items-center space-x-2'>
      <div
        className='w-2 h-2 rounded-full'
        style={{ backgroundColor: props.event.backgroundColor }}
      ></div>
      <div>{JSON.stringify(props, null, 2)}</div>
      <div>{props.event.title}</div>
    </div>
  );
}
