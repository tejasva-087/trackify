import { useEffect } from "react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import timegridPlugin from "@fullcalendar/react/timegrid";
import listPlugin from "@fullcalendar/react/list";
import multimonthPlugin from "@fullcalendar/react/multimonth";
import interactionPlugin from "@fullcalendar/react/interaction";
import themePlugin from "@fullcalendar/react/themes/monarch";

import type {
  DateSelectInfo,
  EventClickInfo,
  EventDropInfo,
  EventResizeDoneInfo,
} from "@fullcalendar/react";

import { useCalendar } from "./context/CalenderContext";

import "@fullcalendar/react/skeleton.css";
import "@fullcalendar/react/themes/monarch/theme.css";
import "@fullcalendar/react/themes/monarch/palettes/blue.css";
import "../../styles/themeOverrideCalender.css";
import { useWindowSize } from "../../hooks/getWindowSize";
import useEvents from "./hooks/useEvents";
import Spinner from "../../ui/Spinner";

function Calendar() {
  const { width } = useWindowSize();
  const isMobile = width < import.meta.env.VITE_MOBILE_BREAK_POINT;

  const {
    selectedDate,
    goToDate,
    openSelection,
    closeEvent,
    calendarRef,
    openEventId,
  } = useCalendar();
  const { events, isLoadingEvents } = useEvents();

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
  }, [isMobile, calendarRef]);

  useEffect(() => {
    if (!selectedDate) return;

    const calendarApi = calendarRef.current?.getApi();

    if (!calendarApi) return;

    calendarApi.gotoDate(selectedDate);
    calendarApi.changeView("timeGridDay", selectedDate);
  }, [selectedDate, calendarRef]);

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
    const target = eventInfo.jsEvent?.target;

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

    openEventId(eventInfo.event.id, position);
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

  if (isLoadingEvents)
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Spinner />
      </div>
    );

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
