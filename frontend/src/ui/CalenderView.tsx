import { useRef } from "react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import timegridPlugin from "@fullcalendar/react/timegrid";
import listPlugin from "@fullcalendar/react/list";
import multimonthPlugin from "@fullcalendar/react/multimonth";
import interactionPlugin from "@fullcalendar/react/interaction";
import themePlugin from "@fullcalendar/react/themes/monarch";
import type {
  CalendarRef,
  DateSelectInfo,
  EventClickInfo,
  EventDropInfo,
  EventResizeDoneInfo,
} from "@fullcalendar/react";
import "@fullcalendar/react/skeleton.css";
import "@fullcalendar/react/themes/monarch/theme.css";
import "@fullcalendar/react/themes/monarch/palettes/blue.css";
import "../styles/themeOverrideCalender.css";

// monarch: blue, green, purple, red, yellow
// breezy: emerald, amber, indigo, rose
// forma: blue, green, purple, red
// pulse: blue, green, purple, red
// classic

// type CalenderViewTypes =
//   | "dayGridYear"
//   | "dayGridMonth"
//   | "dayGridWeek"
//   | "dayGridDay"
//   | "dayGrid";
// timeGridWeek, timeGridDay, timeGrid
// listYear, listMonth, listWeek, listDay, list
// multiMonthYear, multiMonth

function CalenderView() {
  const calendarRef = useRef<CalendarRef>(null);

  function handleSelect(selectInfo: DateSelectInfo) {
    console.log(selectInfo);

    console.log(selectInfo.start);
    console.log(selectInfo.end);
    console.log(selectInfo.allDay);
  }

  function handleEventClick(clickInfo: EventClickInfo) {
    console.log(clickInfo);

    console.log(clickInfo.event);
    console.log(clickInfo.event.id);
    console.log(clickInfo.event.title);
  }

  function handleEventDrop(dropInfo: EventDropInfo) {
    console.log(dropInfo);

    console.log(dropInfo.event);
    console.log(dropInfo.oldEvent);
    console.log(dropInfo.delta);
  }

  function handleEventResize(resizeInfo: EventResizeDoneInfo) {
    console.log(resizeInfo);

    console.log(resizeInfo.event);
    console.log(resizeInfo.oldEvent);
    console.log(resizeInfo.endDelta);
  }

  return (
    <div className="h-full w-full min-h-0">
      <FullCalendar
        ref={calendarRef}
        borderless
        height="100%"
        plugins={[
          interactionPlugin,
          dayGridPlugin,
          timegridPlugin,
          listPlugin,
          multimonthPlugin,
          themePlugin,
        ]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridWeek,timeGridDay,dayGridMonth",
        }}
        headerToolbarClass="border-b"
        // INTERACTION PART
        selectable // Enables users to click-and-drag across empty calendar cells
        selectMirror
        select={handleSelect}
        // enables both dragging events to a new time (eventStartEditable) and resizing their duration (eventDurationEditable)
        editable
        // Fires when the user clicks on an existing event
        eventClick={handleEventClick}
        // Fires after a user drags an existing event to a different date/time and drops it.
        eventDrop={handleEventDrop}
        // Same idea as eventDrop, but fires when a user drags the edge of an event to change its duration instead of moving it
        eventResize={handleEventResize}
        // Caps how many events show stacked in a single day cell (mainly relevant in dayGridMonth view) before collapsing the rest into a "+N more" link.
        dayMaxEvents
      />
    </div>
  );
}

export default CalenderView;
