import type { CalendarEvent } from "../features/application/context/CalenderContext";

export const formatTime = (ms: number) => {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export function toDateInputValue(value?: string | Date) {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function toTimeInputValue(value?: string | Date) {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function combineDateTime(date: string, time: string, allDay: boolean) {
  if (allDay) return new Date(`${date}T00:00:00`).toISOString();
  return new Date(`${date}T${time || "00:00"}`).toISOString();
}

export const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const dateFmt = new Intl.DateTimeFormat(undefined, {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export const shortDateFmt = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export const timeFmt = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "2-digit",
});

// "2026-09-23 03:30:00+00" -> valid ISO string (Safari-safe)
export function parseDbDate(value: string) {
  const iso = value.replace(" ", "T").replace(/([+-]\d{2})$/, "$1:00");
  return new Date(iso);
}

// "2026-09-15" (all-day) -> local midnight, otherwise normal parse
export function parseOccurrence(value: string) {
  return value.length === 10 ? new Date(`${value}T00:00:00`) : new Date(value);
}

export function formatDuration(start: Date, end: Date) {
  const mins = Math.round((end.getTime() - start.getTime()) / 60000);
  if (mins <= 0) return "";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return [h ? `${h} hr` : "", m ? `${m} min` : ""].filter(Boolean).join(" ");
}

export function describeRecurrence(event: CalendarEvent) {
  const days = event.daysOfWeek ?? [];
  if (!event.startRecur || days.length === 0) return null;

  const dayText =
    days.length === 7
      ? "Every day"
      : "Every " + days.map((d) => DAY_NAMES[d]).join(", ");

  const from = shortDateFmt.format(new Date(event.startRecur));
  const until = event.endRecur
    ? `until ${shortDateFmt.format(new Date(event.endRecur))}`
    : "with no end date";

  return `${dayText}, from ${from} ${until}`;
}
