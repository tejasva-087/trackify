export type CalendarColor = {
  name: string;
  value: string;
};

export const CALENDAR_COLORS: CalendarColor[] = [
  { name: "Blue", value: "#0842a0" },
  { name: "rose", value: "#c2577a" },
  { name: "pink", value: "#d17b93" },
  { name: "salmon", value: "#e0917e" },
  { name: "coral", value: "#d9603f" },
  { name: "orange", value: "#d98a3f" },
  { name: "amber", value: "#d9a13f" },
  { name: "yellow", value: "#d9c05a" },
  { name: "yellowGreen", value: "#c9cf6a" },
  { name: "lime", value: "#b9cf6a" },
  { name: "green", value: "#8fc46a" },
  { name: "emerald", value: "#6bbf7a" },
  { name: "tealGreen", value: "#5fb894" },
  { name: "teal", value: "#4fae94" },
  { name: "blue", value: "#5b9bd5" },
  { name: "cornflower", value: "#6b8fd5" },
  { name: "periwinkle", value: "#7b87d5" },
  { name: "blueViolet", value: "#8f87d5" },
  { name: "lavender", value: "#b09fe0" },
  { name: "purple", value: "#a880d0" },
  { name: "magenta", value: "#a855c9" },
  { name: "mauve", value: "#9d7a6a" },
  { name: "gray", value: "#8f8f8f" },
  { name: "khaki", value: "#b3ab8f" },
];

export const DEFAULT_EVENT_COLOR = CALENDAR_COLORS[0].value;
