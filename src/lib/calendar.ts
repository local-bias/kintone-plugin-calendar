import { DateInput } from '@fullcalendar/core';

export const getPrevDay = (date: DateInput): DateInput => {
  if (date instanceof Date) {
    return new Date(date.getTime() - 1000 * 60 * 60 * 24);
  }
  if (typeof date === 'string') {
    return new Date(new Date(date).getTime() - 1000 * 60 * 60 * 24);
  }
  return date;
};

export const getNextDay = (date: DateInput): DateInput => {
  if (date instanceof Date) {
    return new Date(date.getTime() + 1000 * 60 * 60 * 24);
  }
  if (typeof date === 'string') {
    return new Date(new Date(date).getTime() + 1000 * 60 * 60 * 24);
  }
  return date;
};
