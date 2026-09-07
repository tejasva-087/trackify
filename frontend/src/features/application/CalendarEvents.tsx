import Modal from "../../ui/Modal";
import { useCalendar } from "./context/CalenderContext";

function CalendarEvents() {
  const { selection, clickPosition, closeEvent } = useCalendar();

  if (selection && clickPosition)
    return (
      <Modal position={clickPosition} onClose={closeEvent}>
        Hello bitches
      </Modal>
    );

  return <div>CalendarEvents</div>;
}

export default CalendarEvents;

// {
//     "x": 624.9453125,
//     "y": 172,
//     "width": 123.3515625,
//     "height": 1776,
//     "top": 172,
//     "right": 748.296875,
//     "bottom": 1948,
//     "left": 624.9453125
// }
