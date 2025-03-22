import { fullcalendarApiAtom } from '@/desktop/states/calendar';
import DateCalendar from '@/lib/components/date-calendar';
import { useAtomValue } from 'jotai';
import { DateTime } from 'luxon';
import { useState } from 'react';

export default function SidebarDatePicker() {
  const [date, setDate] = useState<DateTime>(DateTime.now());
  const fullcalendarApi = useAtomValue(fullcalendarApiAtom);

  const onChange = (date: DateTime) => {
    if (!date) {
      return;
    }
    setDate(date);
    if (fullcalendarApi) {
      fullcalendarApi.gotoDate(date.toJSDate());
    }
  };

  return (
    <div className='!-mb-12'>
      <DateCalendar
        className='!w-full aspect-square [&_div[role="row"]>button]:h-7'
        value={date}
        onChange={onChange}
      />
    </div>
  );
}
