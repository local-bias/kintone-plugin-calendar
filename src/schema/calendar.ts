import { z } from 'zod';

/**
 * カレンダーの表示形式
 *
 * - dayGridMonth: 月表示
 * - timeGridWeek: 週表示
 * - timeGridDay: 日表示
 * - timeGridFiveDay: 5日表示
 * - timeGridThreeDay: 3日表示
 */
export const VIEW_TYPES = [
  'dayGridMonth',
  'timeGridWeek',
  'timeGridDay',
  'timeGridFiveDay',
  'timeGridThreeDay',
] as const;

// 配列から型を作成
export type ViewType = (typeof VIEW_TYPES)[number];

export const ViewTypeSchema = z.enum(VIEW_TYPES);
