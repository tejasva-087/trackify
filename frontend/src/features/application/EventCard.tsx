import Spinner from "../../ui/Spinner";
import Text from "../../ui/Text";
import useEvent from "./hooks/useEvent";
import { useCalendar, type CalendarEvent } from "./context/CalenderContext";
import {
  dateFmt,
  describeRecurrence,
  formatDuration,
  parseDbDate,
  parseOccurrence,
  timeFmt,
} from "../../utils/helper";
import Row from "../../ui/Row";
import useDeleteEvent from "./hooks/useDeleteEvent";

type EventCardProps = {
  id: string;
  occurrence?: { start: string; end: string | null };
};

function EventCard({ id, occurrence }: EventCardProps) {
  const { openUpdateid } = useCalendar();
  const { event, isLoadingEvent } = useEvent(id);
  const { deleteEvent, isDeletingEvent } = useDeleteEvent(id);

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

      <footer className="flex items-center gap-2">
        <button
          type="button"
          className="p-2 w-full rounded-sm cursor-pointer border border-white-tertiary"
          onClick={() => deleteEvent()}
          disabled={isDeletingEvent}
        >
          Delete event
        </button>
        <button
          className="p-2 w-full rounded-sm cursor-pointer"
          style={{ backgroundColor: `${event.color}`, color: "#fff" }}
          onClick={() => openUpdateid(e.id, event)}
        >
          Edit event
        </button>
      </footer>
    </div>
  );
}

export default EventCard;
