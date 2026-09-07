import { useCalendar } from "./context/CalenderContext";

import AutoPositionModal from "../../ui/AutoPositionModal";
import Input from "../../ui/Input";

function CalendarEvents() {
  const { selection, clickPosition, closeEvent } = useCalendar();

  if (selection && clickPosition)
    return (
      <AutoPositionModal position={clickPosition} onClose={closeEvent}>
        <div className="h-100">
          <Input />
        </div>
      </AutoPositionModal>
    );

  return null;
}

export default CalendarEvents;
