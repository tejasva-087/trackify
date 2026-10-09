import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
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

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents:
      "This week I have gym three times, probably Monday Wednesday Friday mornings, and I also need to finish reading two chapters for my literature class sometime before the weekend. Oh and don't forget my dentist appointment on Thursday at 4.",
    config: {
      temperature: 1,
      topP: 0.95,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          message: {
            type: Type.STRING,
            description:
              "A summary or introductory message about the schedule.",
          },
          events: {
            type: Type.ARRAY,
            description: "An array of FullCalendar.js event objects.",
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                start: {
                  type: Type.STRING,
                  description: "ISO 8601 start date/time string",
                },
                end: {
                  type: Type.STRING,
                  description: "ISO 8601 end date/time string",
                },
                allDay: { type: Type.BOOLEAN },
                link: { type: Type.STRING },
                color: {
                  type: Type.STRING,
                  enum: CALENDAR_COLORS,
                  description:
                    "Appropriate hex color selected from CALENDAR_COLORS based on event context",
                },
                daysOfWeek: {
                  type: Type.ARRAY,
                  items: { type: Type.INTEGER },
                  description:
                    "Days of week for recurring events (0 = Sunday, 1 = Monday, etc.)",
                },
                startRecur: { type: Type.STRING },
                endRecur: { type: Type.STRING },
                startTime: { type: Type.STRING },
                endTime: { type: Type.STRING },
              },
              required: ["id", "title", "start", "end", "allDay"],
            },
          },
        },
        required: ["message", "events"],
      },
    },
  });

  if (response.text) {
    const jsonOutput = JSON.parse(response.text);
    console.log(jsonOutput);
  }
}

main();
