import * as chrono from "chrono-node";
import nlp from "compromise";

export type CalendarEvent = {
  id: string;
  title: string;
  description?: string | null;
  start: string;
  end: string;
  allDay: boolean;
  link?: string | null;
  color?: string | null;
  daysOfWeek?: number[] | null;
  startRecur?: string | null;
  endRecur?: string | null;
  startTime?: string | null;
  endTime?: string | null;
};

const CALENDAR_COLORS = [
  "#0842a0",
  "#c2577a",
  "#d17b93",
  "#e0917e",
  "#d9603f",
  "#d98a3f",
  "#d9a13f",
  "#d9c05a",
  "#c9cf6a",
  "#b9cf6a",
  "#8fc46a",
  "#6bbf7a",
  "#5fb894",
  "#4fae94",
  "#5b9bd5",
  "#6b8fd5",
  "#7b87d5",
  "#8f87d5",
  "#b09fe0",
  "#a880d0",
  "#a855c9",
  "#9d7a6a",
  "#8f8f8f",
  "#b3ab8f",
];

function extractEvents(input: string): {
  message: string;
  events: CalendarEvent[];
} {
  // 1. Split compound text into logical clauses using compromise.js
  const doc = nlp(input);
  const clauses = doc.clauses().out("array") as string[];

  const events: CalendarEvent[] = [];

  clauses.forEach((clause, index) => {
    // 2. Parse date/time entities using chrono-node
    const parsedResults = chrono.parse(clause, new Date(), {
      forwardDate: true,
    });

    if (parsedResults.length > 0) {
      parsedResults.forEach((parsed, subIndex) => {
        const startDate = parsed.start.date();
        // Default duration: 1 hour if end time isn't explicitly mentioned
        const endDate = parsed.end
          ? parsed.end.date()
          : new Date(startDate.getTime() + 60 * 60 * 1000);

        // Extract title by stripping out the matched date text from the clause
        let title = clause.replace(parsed.text, "").trim();
        title = title
          .replace(/^(and|oh|also|i need to|don't forget|probably|my)\s+/i, "")
          .trim();
        if (!title) title = "Scheduled Task";

        // Assign color deterministically based on title length or category
        const colorIndex = Math.abs(title.length) % CALENDAR_COLORS.length;

        events.push({
          id: `evt-${Date.now()}-${index}-${subIndex}`,
          title: title.charAt(0).toUpperCase() + title.slice(1),
          description: `Extracted from text: "${clause.trim()}"`,
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          allDay: !parsed.start.isCertain("hour"),
          color: CALENDAR_COLORS[colorIndex],
          link: null,
          daysOfWeek: null,
          startRecur: null,
          endRecur: null,
          startTime: parsed.start.isCertain("hour")
            ? startDate.toTimeString().slice(0, 5)
            : null,
          endTime:
            parsed.end && parsed.end.isCertain("hour")
              ? endDate.toTimeString().slice(0, 5)
              : null,
        });
      });
    }
  });

  return {
    message: `Successfully extracted ${events.length} event(s) from input.`,
    events,
  };
}

// Test
const input =
  "This week I have gym three times, probably Monday Wednesday Friday mornings, and I also need to finish reading two chapters for my literature class sometime before the weekend. Oh and don't forget my dentist appointment on Thursday at 4.";

const result = extractEvents(input);
console.log(JSON.stringify(result, null, 2));
