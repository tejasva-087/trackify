import { useCalendar } from "./context/CalenderContext";

import AutoPositionModal from "../../ui/AutoPositionModal";
import EventForm from "./EventForm";
import EventCard from "./EventCard";
import useCreateEvent from "./hooks/useCreateEvent";
import useUpdateEvent from "./hooks/useUpdateEvent";
import useDeleteEvent from "./hooks/useDeleteEvent";

function CalendarEvents() {
  const {
    eventToUpdate,
    eventId,
    selection,
    clickPosition,
    calendarRef,
    closeEvent,
  } = useCalendar();

  const { createEvent, isCreatingEvent } = useCreateEvent();
  const { updateEvent, isUpdatingEvent } = useUpdateEvent();
  const { deleteEvent, isDeletingEvent } = useDeleteEvent();

  function handleCloseSelection() {
    calendarRef.current?.getApi().unselect();
    closeEvent();
  }

  function handleCloseEvent() {
    closeEvent();
  }

  // UPDATE
  if (eventToUpdate && clickPosition) {
    return (
      <AutoPositionModal position={clickPosition} onClose={handleCloseEvent}>
        <EventForm
          key={`update-${eventToUpdate.id}`}
          label="Update Event"
          submitLabel="Update"
          defaultValues={eventToUpdate}
          onFormSubmit={(params, options) =>
            updateEvent({ ...params, id: eventToUpdate.id }, options)
          }
          onDelete={() =>
            deleteEvent(eventToUpdate.id, { onSuccess: () => closeEvent() })
          }
          inProgress={isUpdatingEvent || isDeletingEvent}
        />
      </AutoPositionModal>
    );
  }

  // VIEW
  if (eventId && clickPosition) {
    return (
      <AutoPositionModal position={clickPosition} onClose={handleCloseEvent}>
        <EventCard id={eventId} />
      </AutoPositionModal>
    );
  }

  // CREATE
  if (selection && clickPosition) {
    return (
      <AutoPositionModal
        position={clickPosition}
        onClose={handleCloseSelection}
      >
        <EventForm
          key={`new-${selection.start.getTime()}-${selection.end.getTime()}`}
          label="New Event"
          defaultValues={selection}
          onFormSubmit={createEvent}
          inProgress={isCreatingEvent}
        />
      </AutoPositionModal>
    );
  }

  return null;
}

export default CalendarEvents;
