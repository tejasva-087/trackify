import { useEffect, useMemo } from "react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import timegridPlugin from "@fullcalendar/react/timegrid";
import listPlugin from "@fullcalendar/react/list";
import multimonthPlugin from "@fullcalendar/react/multimonth";
import interactionPlugin from "@fullcalendar/react/interaction";
import themePlugin from "@fullcalendar/react/themes/monarch";

import type { DateSelectInfo, EventClickInfo } from "@fullcalendar/react";

import { useCalendar } from "./context/CalenderContext";

import "@fullcalendar/react/skeleton.css";
import "@fullcalendar/react/themes/monarch/theme.css";
import "@fullcalendar/react/themes/monarch/palettes/blue.css";
import "../../styles/themeOverrideCalender.css";
import { useWindowSize } from "../../hooks/getWindowSize";
import useEvents from "./hooks/useEvents";
import Spinner from "../../ui/Spinner";

// Shape of the rows coming from GET /event
type DbEvent = {
  id: string;
  title: string;
  description?: string | null;
  start: string;
  end: string;
  allDay?: boolean | null;
  link?: string | null;
  color?: string | null;
  daysOfWeek?: number[] | null;
  startRecur?: string | null;
  endRecur?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  editable?: boolean | null;
  [key: string]: unknown;
};

// Events without a color (like the ones the chatbot creates) would be
// invisible in week/day view, so give them a default one. Change as you like.
const DEFAULT_EVENT_COLOR = "#2563eb";

// "HH:mm" in local time, used if a recurring event has no startTime/endTime
function toHHmm(dateStr: string) {
  const d = new Date(dateStr);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

// Cleans a DB row so FullCalendar can place it in EVERY view (week/day/month):
// - Postgres dates ("2026-10-09 04:00:00+00") -> proper ISO strings
// - null values -> undefined (null recurrence fields confuse FullCalendar)
function toFullCalendarEvent(e: DbEvent) {
  const base = {
    id: e.id,
    title: e.title,
    color: e.color ?? DEFAULT_EVENT_COLOR,
    textColor: "#ffffff",
    editable: e.editable ?? undefined,
    extendedProps: {
      description: e.description ?? undefined,
      link: e.link ?? undefined,
    },
  };

  // Recurring event: recurrence fields only (no start/end)
  if (e.daysOfWeek && e.daysOfWeek.length > 0) {
    return {
      ...base,
      daysOfWeek: e.daysOfWeek,
      startTime: e.startTime ?? toHHmm(e.start),
      endTime: e.endTime ?? toHHmm(e.end),
      startRecur: e.startRecur ?? undefined,
      endRecur: e.endRecur ?? undefined,
    };
  }

  // All-day event: date only
  if (e.allDay) {
    return {
      ...base,
      allDay: true,
      start: e.start.slice(0, 10),
      end: e.end.slice(0, 10),
    };
  }

  // Normal timed event
  return {
    ...base,
    allDay: false,
    start: new Date(e.start).toISOString(),
    end: new Date(e.end).toISOString(),
  };
}

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

  // Must be above the early return below (hooks can't be called conditionally)
  const calendarEvents = useMemo(
    () => ((events ?? []) as DbEvent[]).map(toFullCalendarEvent),
    [events],
  );

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
    console.log("click");
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
    eventInfo.jsEvent?.preventDefault();
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
            closeEvent();
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
        eventDrop={closeEvent}
        dayMaxEvents
        events={calendarEvents}
        datesSet={() => closeEvent()}
      />
    </div>
  );
}

export default Calendar;
