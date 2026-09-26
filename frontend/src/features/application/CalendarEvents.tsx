import { useCalendar } from "./context/CalenderContext";

import AutoPositionModal from "../../ui/AutoPositionModal";
import EventForm from "./EventForm";
import useCreateEvent from "./hooks/useCreateEvent";
import EventCard from "./EventCard";

function CalendarEvents() {
  const { eventId, selection, clickPosition, calendarRef, closeEvent } =
    useCalendar();
  const { createEvent, isCreatingEvent } = useCreateEvent();

  function handleCloseSelection() {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.unselect();
  }

  function handleCloseEvent() {
    closeEvent();
  }

  if (eventId && clickPosition)
    return (
      <AutoPositionModal position={clickPosition} onClose={handleCloseEvent}>
        <EventCard id={eventId} />
      </AutoPositionModal>
    );

  if (selection && clickPosition)
    return (
      <AutoPositionModal
        position={clickPosition}
        onClose={handleCloseSelection}
      >
        <EventForm
          label="New Event"
          defaultValues={selection}
          onFormSubmit={createEvent}
          inProgress={isCreatingEvent}
        />
      </AutoPositionModal>
    );

  return null;
}

export default CalendarEvents;
