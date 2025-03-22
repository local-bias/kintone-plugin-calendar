import { DayHeaderContentArg } from '@fullcalendar/core';
import { DateTime } from 'luxon';

export default function DayHeader(props: DayHeaderContentArg) {
  const date = DateTime.fromJSDate(props.date).setLocale('ja');
  const type = props.view.type;

  return (
    <>
      <span className='hidden md:block'>
        {type !== 'dayGridMonth' && date.toFormat('M/d')}
        <span className='text-xs text-foreground/50'>{date.toFormat('(EEE)')}</span>
      </span>
      <span className='block md:hidden text-xs'>
        {type !== 'dayGridMonth' && date.toFormat('d')}
        <span className='text-[10px] text-foreground/50'>{date.toFormat('(EEE)')}</span>
      </span>
    </>
  );
}
