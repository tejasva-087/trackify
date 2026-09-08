import { useCalendar } from "./context/CalenderContext";

import AutoPositionModal from "../../ui/AutoPositionModal";
import EventForm from "./EventForm";

function CalendarEvents() {
  const { selection, clickPosition, calendarRef } = useCalendar();

  // Calendar.tsx
  function handleCloseModal() {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.unselect();
  }

  if (selection && clickPosition)
    return (
      <AutoPositionModal position={clickPosition} onClose={handleCloseModal}>
        <EventForm label="Create a new event" />
      </AutoPositionModal>
    );

  return null;
}

export default CalendarEvents;
