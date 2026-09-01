[
  // 1. BASIC TIMED EVENT (has a specific start & end time)
  {
    id: "1",
    title: "Project Launch",
    start: "2026-09-02T01:30:00.000Z",
    end: "2026-09-02T03:00:00.000Z",
  },

  // 2. ALL-DAY EVENT (no time component, spans the whole day)
  {
    id: "2",
    title: "Company Holiday",
    start: "2026-09-05",
    allDay: true,
  },

  // 3. MULTI-DAY EVENT (spans several days, rendered as a bar across days)
  {
    id: "3",
    title: "Annual Conference",
    start: "2026-09-10",
    end: "2026-09-13", // FullCalendar's `end` is exclusive
    allDay: true,
  },

  // 4. EVENT WITH NO END (FullCalendar treats it as a point-in-time / open-ended)
  {
    id: "4",
    title: "Server Deploy Kickoff",
    start: "2026-09-02T09:00:00.000Z",
    // no `end` -> duration comes from defaultTimedEventDuration or defaultAllDayEventDuration
  },

  // 5. EVENT USING `duration` INSTEAD OF `end`
  {
    id: "5",
    title: "Daily Standup",
    start: "2026-09-02T09:00:00.000Z",
    duration: "00:15", // 15 minutes
  },

  // 6. BACKGROUND EVENT (highlights a time range behind other events, e.g. "busy" block)
  {
    id: "6",
    title: "Office Closed",
    start: "2026-09-07",
    end: "2026-09-08",
    display: "background",
    color: "#ff9f89",
  },

  // 8. NON-EDITABLE EVENT (can't be dragged/resized, overrides global `editable`)
  {
    id: "8",
    title: "Locked Meeting",
    start: "2026-09-02T14:00:00.000Z",
    end: "2026-09-02T15:00:00.000Z",
    editable: false,
  },

  // 9. PARTIALLY EDITABLE EVENT (can move but not resize, or vice versa)
  {
    id: "9",
    title: "Flexible Start, Fixed Duration",
    start: "2026-09-02T16:00:00.000Z",
    end: "2026-09-02T17:00:00.000Z",
    startEditable: true,
    durationEditable: false,
  },

  // 10. CUSTOM COLORS (per-event override)
  {
    id: "10",
    title: "High Priority Task",
    start: "2026-09-03T10:00:00.000Z",
    end: "2026-09-03T11:00:00.000Z",
    color: "#e63946",
    contrastColor: "#ffffff",
  },

  // 12. EVENT WITH A URL (clicking navigates instead of opening default click handler)
  {
    id: "12",
    title: "Read the release notes",
    start: "2026-09-04",
    url: "https://example.com/release-notes",
  },

  // 13. EVENT WITH extendedProps (custom app-specific data, not touched by FullCalendar)
  {
    id: "13",
    title: "Client Call",
    start: "2026-09-04T18:00:00.000Z",
    end: "2026-09-04T18:30:00.000Z",
    extendedProps: {
      clientId: "cus_9182",
      notes: "Discuss renewal terms",
      priority: "high",
    },
  },

  // 14. GROUPED EVENTS (dragging one moves/affects all with the same groupId)
  {
    id: "14a",
    title: "Team A Shift",
    start: "2026-09-05T09:00:00.000Z",
    end: "2026-09-05T17:00:00.000Z",
    groupId: "teamA",
  },
  {
    id: "14b",
    title: "Team A Overtime",
    start: "2026-09-05T17:00:00.000Z",
    end: "2026-09-05T19:00:00.000Z",
    groupId: "teamA",
  },

  // 15. EVENT WITH overlap: false (nothing else can overlap it, and it can't overlap others)
  {
    id: "15",
    title: "Do Not Disturb Block",
    start: "2026-09-06T09:00:00.000Z",
    end: "2026-09-06T10:00:00.000Z",
    overlap: false,
  },

  // 16. EVENT WITH A constraint (restricts dragging/resizing to a range or another event's group)
  {
    id: "16",
    title: "Onboarding Session",
    start: "2026-09-08T10:00:00.000Z",
    end: "2026-09-08T11:00:00.000Z",
    constraint: "businessHours", // or constraint: { start: '09:00', end: '17:00' }, or another event's id/groupId
  },

  // 17. DISPLAY VARIANTS: 'list-item' (small dot + title, used in month view)
  {
    id: "17",
    title: "Reminder: Pay Invoice",
    start: "2026-09-09",
    display: "list-item",
  },

  // 18. DISPLAY VARIANTS: 'none' (occupies time/logic but is invisible — e.g. for custom rendering)
  {
    id: "18",
    title: "Hidden Placeholder",
    start: "2026-09-09T12:00:00.000Z",
    end: "2026-09-09T13:00:00.000Z",
    display: "none",
  },

  // 19. RESOURCE-LINKED EVENT (needs @fullcalendar/resource-timeline or resource-timegrid)
  {
    id: "19",
    title: "Room A Booking",
    start: "2026-09-10T08:00:00.000Z",
    end: "2026-09-10T09:00:00.000Z",
    resourceId: "room-a",
  },

  // 20. EVENT ASSIGNED TO MULTIPLE RESOURCES
  {
    id: "20",
    title: "Cross-team Sync",
    start: "2026-09-10T10:00:00.000Z",
    end: "2026-09-10T11:00:00.000Z",
    resourceIds: ["room-a", "room-b"],
  },

  // ---------------------------------------------------------------------
  // RECURRING EVENTS (built-in recurrence — no extra plugin needed)
  // ---------------------------------------------------------------------

  // 21. WEEKLY RECURRING EVENT (every Mon/Wed/Fri, with time-of-day + date range)
  {
    id: "21",
    title: "Yoga Class",
    daysOfWeek: ["1", "3", "5"], // Mon, Wed, Fri (0=Sun ... 6=Sat)
    startTime: "07:00:00",
    endTime: "08:00:00",
    startRecur: "2026-09-01", // recurrence begins
    endRecur: "2026-12-31", // recurrence ends (exclusive)
  },

  // 22. RECURRING ALL-DAY EVENT (no startTime/endTime = all-day occurrences)
  {
    id: "22",
    title: "Weekly Report Due",
    daysOfWeek: ["5"], // every Friday
    startRecur: "2026-09-01",
  },

  // 23. RECURRING EVENT WITHOUT AN END DATE (recurs indefinitely)
  {
    id: "23",
    title: "Daily Standup (recurring)",
    daysOfWeek: ["1", "2", "3", "4", "5"],
    startTime: "09:00:00",
    endTime: "09:15:00",
    startRecur: "2026-09-01",
  },

  // 24. GROUP-EDITABLE RECURRING EVENT (all generated instances share editability rules)
  {
    id: "24",
    title: "Monthly All-Hands",
    daysOfWeek: ["1"],
    startTime: "10:00:00",
    endTime: "11:00:00",
    startRecur: "2026-09-01",
    endRecur: "2027-09-01",
    editable: false,
  },

  // ---------------------------------------------------------------------
  // RRULE-BASED RECURRENCE (requires @fullcalendar/rrule plugin)
  // import rrulePlugin from '@fullcalendar/rrule'
  // plugins={[rrulePlugin, ...]}
  // ---------------------------------------------------------------------

  // 25. RRULE STRING (e.g. "every 2 weeks on Tuesday, 10 times")
  {
    id: "25",
    title: "Bi-Weekly Retro (rrule string)",
    rrule:
      "DTSTART:20260901T100000Z\nRRULE:FREQ=WEEKLY;INTERVAL=2;BYDAY=TU;COUNT=10",
    duration: "01:00",
  },

  // 26. RRULE OBJECT FORM (more readable than a raw string)
  {
    id: "26",
    title: "Monthly Invoice Reminder (rrule object)",
    rrule: {
      freq: "monthly",
      interval: 1,
      byweekday: "mo",
      bysetpos: 1, // first Monday of the month
      dtstart: "2026-09-07T09:00:00",
      until: "2027-06-01",
    },
    duration: "00:30",
  },

  // 27. RRULE WITH EXCLUDED DATES (skip specific occurrences)
  {
    id: "27",
    title: "Weekly Sprint Planning",
    rrule: {
      freq: "weekly",
      byweekday: "mo",
      dtstart: "2026-09-07T09:00:00",
      count: 12,
    },
    exdate: ["2026-09-28T09:00:00.000Z"], // skip this one occurrence
    duration: "01:00",
  },

  // ---------------------------------------------------------------------
  // EVENT SOURCE-LEVEL CASES (not single events, but how you can supply them)
  // ---------------------------------------------------------------------

  // 28. EVENT AS PART OF A NAMED EVENT SOURCE (useful for toggling visibility per-source)
  // Passed via `eventSources` prop instead of the flat `events` array:
  /*
  eventSources: [
    {
      id: "holidays",
      events: [
        { title: "Diwali", start: "2026-11-08", allDay: true },
      ],
      color: "green",
      textColor: "white",
    },
  ]
  */

  // 29. EVENT FETCHED FROM A URL/FUNCTION SOURCE (async loading)
  // eventSources: [
  //   {
  //     url: "/api/events",
  //     method: "GET",
  //     extraParams: { userId: 42 },
  //   },
  // ]
];
