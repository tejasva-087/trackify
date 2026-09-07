import { Outlet } from "react-router-dom";
import AppNavigation from "../features/application/AppNavigation";
import CalendarProvider from "../features/application/context/CalenderContext";

function AppLayout() {
  return (
    <CalendarProvider>
      <div className="w-screen h-screen grid grid-cols-[auto_1fr]">
        <AppNavigation />
        <main className="min-h-0 overflow-hidden">
          <Outlet />
        </main>
        {/* <ChatMenu /> */}
      </div>
    </CalendarProvider>
  );
}

export default AppLayout;

// {
//     "start": "2026-09-02T18:30:00.000Z",
//     "end": "2026-09-03T18:30:00.000Z",
//     "startStr": "2026-09-03",
//     "endStr": "2026-09-04",
//     "allDay": true,
//     "jsEvent": {
//         "isTrusted": true
//     },
//     "view": {
//         "type": "dayGridMonth",
//         "dateEnv": {
//             "timeZone": "local",
//             "calendarSystem": {},
//             "locale": {
//                 "codeArg": "en",
//                 "codes": [
//                     "en"
//                 ],
//                 "week": {
//                     "dow": 0,
//                     "doy": 4
//                 },
//                 "simpleNumberFormat": {},
//                 "options": {
//                     "direction": "ltr",
//                     "todayText": "Today",
//                     "prevText": "Prev",
//                     "nextText": "Next",
//                     "prevYearText": "Prev year",
//                     "nextYearText": "Next year",
//                     "yearText": "Year",
//                     "monthText": "Month",
//                     "weekTextLong": "Week",
//                     "dayText": "Day",
//                     "listText": "List",
//                     "closeHint": "Close",
//                     "eventsHint": "Events",
//                     "allDayText": "All-day",
//                     "timedText": "Timed",
//                     "moreLinkText": "more",
//                     "noEventsText": "No events to display",
//                     "weekTextShort": "W",
//                     "prevHint": "Previous $0",
//                     "nextHint": "Next $0",
//                     "viewHint": "$0 view",
//                     "viewChangeHint": "Change view",
//                     "navLinkHint": "Go to $0"
//                 }
//             },
//             "weekDow": 0,
//             "weekDoy": 4,
//             "weekTextLong": "Week",
//             "weekTextShort": "W",
//             "cmdFormatter": null
//         }
//     }
// }
