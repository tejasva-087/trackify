export type CalendarEvent = {
  id: string;
  title: string;
  description?: string | null;
  start: string;
  end: string;
  allDay: boolean;
  link?: string | null;
  color?: string | null;
  daysOfWeek?: number[] | null;
  startRecur?: string | null;
  endRecur?: string | null;
  startTime?: string | null;
  endTime?: string | null;
};
