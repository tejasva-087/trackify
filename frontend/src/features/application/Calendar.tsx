import { useEffect, useRef } from "react";

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
  EventDropInfo,
  EventResizeDoneInfo,
} from "@fullcalendar/react";

import "@fullcalendar/react/skeleton.css";
import "@fullcalendar/react/themes/monarch/theme.css";
import "@fullcalendar/react/themes/monarch/palettes/blue.css";
import "../../styles/themeOverrideCalender.css";
import { useCalendarContext } from "./context/CalenderContext";

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

const events = [
  {
    id: "21",
    title: "Yoga Class",
    daysOfWeek: [1, 3, 5], // Mon, Wed, Fri (0=Sun ... 6=Sat)
    startTime: "07:00:00",
    endTime: "08:00:00",
    startRecur: "2026-09-01", // recurrence begins
    endRecur: "2026-12-31", // recurrence ends (exclusive)
    editable: false,
    overlap: false,
  },
];

function Calendar() {
  const calendarRef = useRef<CalendarRef>(null);
  const { selectedDate, goToDate, openEventModal } = useCalendarContext();

  useEffect(() => {
    if (!selectedDate) return;
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.gotoDate(selectedDate);
    calendarApi?.changeView("timeGridDay", selectedDate);
  }, [selectedDate]);

  function handleSelectedDate(selectInfo: DateSelectInfo) {
    const target = selectInfo.jsEvent?.target as HTMLElement | undefined;
    const rect = target
      ?.closest(".fc-timegrid-slot, .fc-daygrid-day")
      ?.getBoundingClientRect();

    const position = rect
      ? { x: rect.left, y: rect.top }
      : {
          x: selectInfo.jsEvent?.clientX ?? window.innerWidth / 2,
          y: selectInfo.jsEvent?.clientY ?? window.innerHeight / 2,
        };

    openEventModal(
      {
        start: selectInfo.start,
        end: selectInfo.end,
        allDay: selectInfo.allDay,
      },
      position,
    );

    selectInfo.view.calendar.unselect();
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
    <>
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
          nowIndicator
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "timeGridWeek,timeGridDay,dayGridMonth",
          }}
          headerToolbarClass="border-b"
          // Navigation in calender
          dayCellDidMount={(arg) => {
            arg.el.style.cursor = "pointer";
          }}
          dateClick={(arg) => {
            if (arg.view.type === "dayGridMonth") {
              goToDate(arg.date);
            }
          }}
          // Adding new event
          selectable
          selectMirror
          select={handleSelectedDate}
          // unselect={() => setSelectedRange(null)}
          editable
          // eventClick={(eventInfo) => setSelectedEvent(eventInfo)}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          dayMaxEvents
          events={events}
        />
      </div>
    </>
  );
}

export default Calendar;
