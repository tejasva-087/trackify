export type CalendarColor = {
  name: string;
  value: string;
};

export const CALENDAR_COLORS: CalendarColor[] = [
  { name: "Blue", value: "#0842a0" },
  { name: "Teal", value: "#0f9d9d" },
  { name: "Green", value: "#0b8043" },
  { name: "Lime", value: "#7cb342" },
  { name: "Yellow", value: "#f4b400" },
  { name: "Orange", value: "#e8710a" },
  { name: "Red", value: "#d50000" },
  { name: "Pink", value: "#e91e63" },
  { name: "Magenta", value: "#ad1457" },
  { name: "Purple", value: "#8e24aa" },
  { name: "Indigo", value: "#5c6bc0" },
  { name: "Brown", value: "#795548" },
  { name: "Graphite", value: "#616161" },
];

export const DEFAULT_EVENT_COLOR = CALENDAR_COLORS[0].value;
