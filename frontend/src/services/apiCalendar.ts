// export type EventParams = {
//   id: string;
//   title: string;
//   description: string;
//   start: Date | string;
//   end: Date | string;
//   allDay: boolean;
//   url: string;
//   color: string;
//   contrastColor: string;
//   daysOfWeek: string;
//   startRecur: string;
//   endRecur: string;
//   startTime: string;
//   endTime: string;
//   editable: string;
//   priority: string;
// };

const API_URL = import.meta.env.VITE_API_URL;

console.log(API_URL);

export interface CreateEventParams {
  title: string; //
  description?: string; //
  start: Date | string; //
  duration?: string; //
  end?: Date | string; //
  startTime?: string; //
  endTime?: string; //
  allDay?: boolean;
  url?: string; //
  color?: string; //
  contrastColor?: string; //
  daysOfWeek?: string;
  startRecur?: string;
  endRecur?: string;

  editable?: boolean;
}
export async function createEvent(event: CreateEventParams) {
  const data = await fetch(`${API_URL}/event`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  });

  console.log(data);
}
