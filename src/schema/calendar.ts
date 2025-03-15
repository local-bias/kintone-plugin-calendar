import { z } from 'zod';

export const ViewTypeSchema = z.union([
  z.literal('dayGridMonth'),
  z.literal('timeGridWeek'),
  z.literal('timeGridDay'),
  z.literal('timeGridFiveDay'),
  z.literal('timeGridThreeDay'),
]);
