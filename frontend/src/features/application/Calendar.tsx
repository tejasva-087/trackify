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

type Position = {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
};

const MOBILE_BREAK_POINT =
  Number(import.meta.env.VITE_MOBILE_BREAK_POINT) || 768;

const DEFAULT_EVENT_COLOR = "#2563eb";

// "HH:mm" in local time, used if a recurring event has no startTime/endTime
function toHHmm(dateStr: string) {
  const d = new Date(dateStr);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

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

  if (e.allDay) {
    return {
      ...base,
      allDay: true,
      start: e.start.slice(0, 10),
      end: e.end.slice(0, 10),
    };
  }

  return {
    ...base,
    allDay: false,
    start: new Date(e.start).toISOString(),
    end: new Date(e.end).toISOString(),
  };
}

function rectToPosition(rect: DOMRect): Position {
  return {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    left: rect.left,
  };
}

// Never returns null: on touch devices the event target can be unexpected,
// and the mobile bottom sheet doesn't need an anchor anyway.
function getAnchorPosition(
  target: EventTarget | null | undefined,
  fallbackEl?: HTMLElement | null,
): Position {
  const el =
    fallbackEl ??
    (target instanceof HTMLElement
      ? ((target.closest('[role="button"]') as HTMLElement | null) ?? target)
      : null);

  if (el) return rectToPosition(el.getBoundingClientRect());

  return rectToPosition(new DOMRect(0, 0, 0, 0));
}

function Calendar() {
  const { width } = useWindowSize();
  const isMobile = width < MOBILE_BREAK_POINT;

  const {
    selectedDate,
    goToDate,
    openSelection,
    closeEvent,
    calendarRef,
    openEventId,
  } = useCalendar();
  const { events, isLoadingEvents } = useEvents();

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

  // Desktop: click/drag on the grid
  function handleSelect(selectInfo: DateSelectInfo) {
    openSelection(
      {
        start: selectInfo.start,
        end: selectInfo.end,
        allDay: selectInfo.allDay,
      },
      getAnchorPosition(selectInfo.jsEvent?.target),
    );
  }

  function handleEventClick(eventInfo: EventClickInfo) {
    eventInfo.jsEvent?.preventDefault();

    openEventId(
      eventInfo.event.id,
      getAnchorPosition(eventInfo.jsEvent?.target),
    );
  }

  if (isLoadingEvents)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <div className="h-full min-h-0 w-full">
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
        dayCellDidMount={(arg) => {
          arg.el.style.cursor = "pointer";
        }}
        /*
         * Tap handling. A quick tap fires dateClick on touch devices,
         * but NOT select (select needs a long-press on touch).
         */
        dateClick={(arg) => {
          if (arg.view.type === "dayGridMonth") {
            goToDate(arg.date);
            closeEvent();
            return;
          }

          // Desktop uses `select`; only handle taps on mobile to avoid
          // opening the modal twice.
          if (!isMobile) return;

          const start = arg.date;
          const end = arg.allDay
            ? new Date(start.getTime() + 24 * 60 * 60 * 1000)
            : new Date(start.getTime() + 60 * 60 * 1000);

          openSelection(
            { start, end, allDay: arg.allDay },
            getAnchorPosition(arg.jsEvent?.target, arg.dayEl),
          );
        }}
        /*
         * Selecting a time range (mouse drag, or long-press on touch)
         */
        selectable
        selectMirror
        selectLongPressDelay={300}
        select={handleSelect}
        unselect={closeEvent}
        unselectCancel="[data-calendar-popover]"
        /*
         * Events
         */
        editable
        eventLongPressDelay={300}
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
