const API_URL = import.meta.env.VITE_API_URL;

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
  daysOfWeek?: number[];
  startRecur?: string;
  endRecur?: string;

  editable?: boolean;
}

export async function getEvents() {
  try {
    const res = await fetch(`${API_URL}/event`, {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch events: ${res.status} ${res.statusText}`,
      );
    }

    return await res.json();
  } catch (error) {
    console.error(
      "Error fetching events:",
      error instanceof Error ? error.message : error,
    );
    throw error;
  }
}

export async function createEvent(event: CreateEventParams) {
  try {
    const res = await fetch(`${API_URL}/event`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });

    if (!res.ok) {
      throw new Error(
        `Failed to create event: ${res.status} ${res.statusText}`,
      );
    }

    return await res.json();
  } catch (error) {
    console.error(
      "Error creating event:",
      error instanceof Error ? error.message : error,
    );
    throw error;
  }
}

export async function getEvent(id: string) {
  try {
    const res = await fetch(`${API_URL}/event/${id}`, {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch events: ${res.status} ${res.statusText}`,
      );
    }

    return await res.json();
  } catch (error) {
    console.error(
      "Error fetching events:",
      error instanceof Error ? error.message : error,
    );
    throw error;
  }
}
