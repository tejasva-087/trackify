import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import timegridPlugin from "@fullcalendar/react/timegrid";
import listPlugin from "@fullcalendar/react/list";
import multimonthPlugin from "@fullcalendar/react/multimonth";
import interactionPlugin from "@fullcalendar/react/interaction";
import themePlugin from "@fullcalendar/react/themes/monarch";

// stylesheets
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
  return (
    <div className="h-full w-full min-h-0">
      <FullCalendar
        height="100%"
        plugins={[
          interactionPlugin,
          dayGridPlugin,
          timegridPlugin,
          listPlugin,
          multimonthPlugin,
          themePlugin,
        ]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
      />
    </div>
  );
}

export default CalenderView;
