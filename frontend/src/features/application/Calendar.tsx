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
  EventClickInfo,
  EventDropInfo,
  EventResizeDoneInfo,
} from "@fullcalendar/react";

import { useCalendar } from "./context/CalenderContext";
import { useIsMobile } from "../../hooks/useIsMobile";

import "@fullcalendar/react/skeleton.css";
import "@fullcalendar/react/themes/monarch/theme.css";
import "@fullcalendar/react/themes/monarch/palettes/blue.css";
import "../../styles/themeOverrideCalender.css";

const events = [
  {
    id: "21",
    title: "Yoga Class",
    daysOfWeek: [1, 3, 5],
    startTime: "07:00:00",
    endTime: "08:00:00",
    startRecur: "2026-09-01",
    endRecur: "2026-12-31",
    editable: false,
    overlap: false,
  },
];

function Calendar() {
  const calendarRef = useRef<CalendarRef>(null);

  const isMobile = useIsMobile();

  const { selectedDate, goToDate, openSelection, closeEvent } = useCalendar();

  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();

    if (!calendarApi) return;

    const currentType = calendarApi.view.type;

    if (isMobile && currentType === "timeGridWeek") {
      calendarApi.changeView("timeGridThreeDay");
    }

    if (!isMobile && currentType === "timeGridThreeDay") {
      calendarApi.changeView("timeGridWeek");
    }
  }, [isMobile]);

  useEffect(() => {
    if (!selectedDate) return;

    const calendarApi = calendarRef.current?.getApi();

    if (!calendarApi) return;

    calendarApi.gotoDate(selectedDate);
    calendarApi.changeView("timeGridDay", selectedDate);
  }, [selectedDate]);

  function handleSelect(selectInfo: DateSelectInfo) {
    const target = selectInfo.jsEvent?.target;

    if (!(target instanceof HTMLElement)) return;

    const cellEl = target.closest('[role="button"]');

    if (!cellEl) return;

    const rect = cellEl.getBoundingClientRect();

    const position = {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
    };

    openSelection(
      {
        start: selectInfo.start,
        end: selectInfo.end,
        allDay: selectInfo.allDay,
      },
      position,
    );
  }

  function handleEventClick(eventInfo: EventClickInfo) {
    console.log("Event clicked:", eventInfo.event);
  }

  function handleEventDrop(dropInfo: EventDropInfo) {
    console.log("Event dropped:", dropInfo.event);
    console.log("Old event:", dropInfo.oldEvent);
    console.log("Delta:", dropInfo.delta);
  }

  function handleEventResize(resizeInfo: EventResizeDoneInfo) {
    console.log("Event resized:", resizeInfo.event);
    console.log("Old event:", resizeInfo.oldEvent);
    console.log("End delta:", resizeInfo.endDelta);
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
        initialView={isMobile ? "timeGridThreeDay" : "timeGridWeek"}
        buttons={{
          timeGridThreeDay: {
            text: "3 days",
          },
        }}
        views={{
          timeGridThreeDay: {
            type: "timeGrid",
            duration: {
              days: 3,
            },
          },
        }}
        nowIndicator
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: isMobile
            ? "timeGridThreeDay,timeGridDay"
            : "timeGridWeek,timeGridDay,dayGridMonth",
        }}
        headerToolbarClass="border-b"
        /*
         * Navigation
         */
        dayCellDidMount={(arg) => {
          arg.el.style.cursor = "pointer";
        }}
        dateClick={(arg) => {
          if (arg.view.type === "dayGridMonth") {
            goToDate(arg.date);
          }
        }}
        /*
         * Selecting a time range
         */
        selectable
        selectMirror
        select={handleSelect}
        unselect={closeEvent}
        unselectCancel="[data-calendar-popover]"
        /*
         * Events
         */
        editable
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        dayMaxEvents
        events={events}
      />
    </div>
  );
}

export default Calendar;
