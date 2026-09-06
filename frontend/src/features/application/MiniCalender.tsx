import FullCalendar, { type CalendarRef } from "@fullcalendar/react";
import type { DateSelectInfo } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import interactionPlugin from "@fullcalendar/react/interaction";
import themePlugin from "@fullcalendar/react/themes/monarch";

import "@fullcalendar/react/skeleton.css";
import "@fullcalendar/react/themes/monarch/theme.css";
import "@fullcalendar/react/themes/monarch/palettes/blue.css";
import "../styles/themeOverrideCalender.css";
import { useRef, useState } from "react";

function MiniCalender() {
  const calendarRef = useRef<CalendarRef>(null);
  const [selectedRange, setSelectedRange] = useState<DateSelectInfo | null>(
    null,
  );
  console.log(selectedRange);

  return (
    <FullCalendar
      ref={calendarRef}
      plugins={[interactionPlugin, dayGridPlugin, themePlugin]}
      initialView="dayGridMonth"
      borderless
      selectable
      select={(selectInfo) => setSelectedRange(selectInfo)}
      dayCellDidMount={(arg) => {
        arg.el.style.cursor = "pointer";
      }}
    />
  );
}

export default MiniCalender;
