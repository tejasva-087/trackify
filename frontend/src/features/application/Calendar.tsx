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

import "@fullcalendar/react/skeleton.css";
import "@fullcalendar/react/themes/monarch/theme.css";
import "@fullcalendar/react/themes/monarch/palettes/blue.css";
import "../../styles/themeOverrideCalender.css";
import { useCalendar } from "./context/CalenderContext";

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
  const { selectedDate, goToDate, openEventId, openSelection, closeEvent } =
    useCalendar();

  useEffect(() => {
    if (!selectedDate) return;
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.gotoDate(selectedDate);
    calendarApi?.changeView("timeGridDay", selectedDate);
  }, [selectedDate]);

  function handleSelect(selectInfo: DateSelectInfo) {
    const targetEl = selectInfo.jsEvent?.target as HTMLElement;
    const cellEl = targetEl.closest('[role="button"]')!;
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
    const position = {
      x: eventInfo.jsEvent?.clientX as number,
      y: eventInfo.jsEvent?.clientY as number,
    };

    openEventId(eventInfo.event.id, position);
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
          select={handleSelect}
          unselect={() => closeEvent()}
          editable
          eventClick={handleEventClick}
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
