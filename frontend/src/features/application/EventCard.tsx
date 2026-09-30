import Spinner from "../../ui/Spinner";
import Text from "../../ui/Text";
import useEvent from "./hooks/useEvent";

type EventCardProps = {
  id: string;
  occurrence?: { start: string; end: string | null };
};

type CalendarEvent = {
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

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const dateFmt = new Intl.DateTimeFormat(undefined, {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const shortDateFmt = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const timeFmt = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "2-digit",
});

// "2026-09-23 03:30:00+00" -> valid ISO string (Safari-safe)
function parseDbDate(value: string) {
  const iso = value.replace(" ", "T").replace(/([+-]\d{2})$/, "$1:00");
  return new Date(iso);
}

// "2026-09-15" (all-day) -> local midnight, otherwise normal parse
function parseOccurrence(value: string) {
  return value.length === 10 ? new Date(`${value}T00:00:00`) : new Date(value);
}

function formatDuration(start: Date, end: Date) {
  const mins = Math.round((end.getTime() - start.getTime()) / 60000);
  if (mins <= 0) return "";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return [h ? `${h} hr` : "", m ? `${m} min` : ""].filter(Boolean).join(" ");
}

function describeRecurrence(event: CalendarEvent) {
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

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-0.5">
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd className="text-sm break-words">{children}</dd>
    </div>
  );
}

function EventCard({ id, occurrence }: EventCardProps) {
  const { event, isLoadingEvent } = useEvent(id);

  if (isLoadingEvent)
    return (
      <div className="h-20 flex items-center justify-center">
        <Spinner />
      </div>
    );

  if (!event)
    return (
      <div className="w-full rounded-xl p-4">
        <Text>This event could not be found. It may have been deleted.</Text>
      </div>
    );

  const e = event as CalendarEvent;

  // Use the clicked occurrence's date when given (recurring events),
  // otherwise fall back to the stored start/end.
  const start = occurrence
    ? parseOccurrence(occurrence.start)
    : parseDbDate(e.start);
  const end = occurrence
    ? occurrence.end
      ? parseOccurrence(occurrence.end)
      : start
    : parseDbDate(e.end);

  const sameDay = start.toDateString() === end.toDateString();
  const duration = formatDuration(start, end);
  const recurrence = describeRecurrence(e);
  const dateLabel =
    !sameDay && !e.allDay
      ? `${dateFmt.format(start)} to ${dateFmt.format(end)}`
      : dateFmt.format(start);

  return (
    <div className="w-full rounded-xl p-4 space-y-4 h-full">
      <header
        className="border-l-4 pl-2 space-y-1"
        style={{ borderColor: `${e.color}` }}
      >
        <Text type="h3">{e.title}</Text>
        <Text>{dateLabel}</Text>
      </header>

      <dl className="space-y-3">
        <Row label="Time">
          {e.allDay ? (
            "All day"
          ) : (
            <>
              {timeFmt.format(start)} to {timeFmt.format(end)}
              {duration && <span className="text-gray-500"> ({duration})</span>}
            </>
          )}
        </Row>

        {recurrence && <Row label="Repeats">{recurrence}</Row>}

        {e.description && (
          <Row label="Description">
            <span className="whitespace-pre-wrap">{e.description}</span>
          </Row>
        )}

        {e.link && (
          <Row label="Link">
            <a
              href={e.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline underline-offset-2"
            >
              {e.link}
            </a>
          </Row>
        )}
      </dl>
    </div>
  );
}

export default EventCard;
