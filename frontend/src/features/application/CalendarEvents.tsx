import { useCalendar } from "./context/CalenderContext";

import AutoPositionModal from "../../ui/AutoPositionModal";
import EventForm from "./EventForm";
import useCreateEvent from "./hooks/useCreateEvent";

function CalendarEvents() {
  const { selection, clickPosition, calendarRef } = useCalendar();
  const { createEvent, isCreatingEvent } = useCreateEvent();

  function handleCloseModal() {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.unselect();
  }

  if (selection && clickPosition)
    return (
      <AutoPositionModal position={clickPosition} onClose={handleCloseModal}>
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
