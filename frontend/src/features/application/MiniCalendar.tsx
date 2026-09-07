import { useRef } from "react";
import FullCalendar, { type CalendarRef } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import interactionPlugin from "@fullcalendar/react/interaction";
import themePlugin from "@fullcalendar/react/themes/monarch";

import { useCalendar } from "./context/CalenderContext";

import "@fullcalendar/react/skeleton.css";
import "@fullcalendar/react/themes/monarch/theme.css";
import "@fullcalendar/react/themes/monarch/palettes/blue.css";
import "../../styles/themeOverrideCalender.css";

function MiniCalendar() {
  const calendarRef = useRef<CalendarRef>(null);
  const { goToDate } = useCalendar();

  return (
    <FullCalendar
      ref={calendarRef}
      plugins={[interactionPlugin, dayGridPlugin, themePlugin]}
      initialView="dayGridMonth"
      borderless
      selectable
      select={(selectInfo) => goToDate(selectInfo.start)}
      dayCellDidMount={(arg) => {
        arg.el.style.cursor = "pointer";
      }}
    />
  );
}

export default MiniCalendar;
