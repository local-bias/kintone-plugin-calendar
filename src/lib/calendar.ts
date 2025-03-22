import { createDuration } from '@fullcalendar/core/internal';

export const WEEK_DAYS = [
  { label: '日曜日', value: 0 },
  { label: '月曜日', value: 1 },
  { label: '火曜日', value: 2 },
  { label: '水曜日', value: 3 },
  { label: '木曜日', value: 4 },
  { label: '金曜日', value: 5 },
  { label: '土曜日', value: 6 },
] as const;

export function getSlotTime(time: string) {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return createDuration({ hours, minutes, seconds });
}
