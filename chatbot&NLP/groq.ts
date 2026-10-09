import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: "",
});

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

const promptSchema = {
  message: "Friendly summary message of scheduled items",
  events: [
    {
      title: "Event Title",
      description: "Details or notes",
      start: "ISO 8601 string (e.g. 2026-10-12T09:00:00)",
      end: "ISO 8601 string (e.g. 2026-10-12T10:00:00)",
      allDay: false,
      color:
        "Select hex color strictly from provided CALENDAR_COLORS list based on event type",
      daysOfWeek: [1, 3, 5],
    },
  ],
};
// qwen/qwen3.8-27b
// openai/gpt-oss-20b
async function parseSchedule(userInput: string) {
  const response = await groq.chat.completions.create({
    model: "qwen/qwen3.8-27b",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are an AI calendar event parser. Extract events from user text into valid JSON matching this schema structure:
${JSON.stringify(promptSchema, null, 2)}

Allowed color palette: ${JSON.stringify(CALENDAR_COLORS)}
Assume the current reference year is ${new Date().getFullYear()}. Output ONLY valid JSON.`,
      },
      {
        role: "user",
        content: userInput,
      },
    ],
  });

  const content = response.choices[0].message.content;
  if (content) {
    return JSON.parse(content);
  }
}

async function main() {
  const text =
    "This week I have gym three times, probably Monday Wednesday Friday mornings, and I also need to finish reading two chapters for my literature class sometime before the weekend. Oh and don't forget my dentist appointment on Thursday at 4.";
  const result = await parseSchedule(text);
  console.log(JSON.stringify(result, null, 2));
}

main();
