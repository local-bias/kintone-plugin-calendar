import DateCalendar from '@/lib/components/date-calendar';
import { DateTime } from 'luxon';
import { useState } from 'react';

export default function SidebarDatePicker() {
  const [date, setDate] = useState<DateTime>(DateTime.now());

  return (
    <div>
      <DateCalendar
        className='!w-full aspect-square [&_div[role="row"]>button]:h-7'
        value={date}
        onChange={(date) => {
          if (date) setDate(date);
        }}
      />
    </div>
  );
}
