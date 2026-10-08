const API_URL = import.meta.env.VITE_API_URL;

export interface CreateEventParams {
  title: string;
  description?: string;
  start: Date | string;
  duration?: string;
  end?: Date | string;
  startTime?: string;
  endTime?: string;
  allDay?: boolean;
  link?: string;
  color?: string;
  contrastColor?: string;
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

export type UpdateEventParams = Partial<CreateEventParams> & { id: string };

export async function updateEvent({ id, ...event }: UpdateEventParams) {
  try {
    const res = await fetch(`${API_URL}/event/${id}`, {
      method: "PATCH", // use "PUT" if your backend expects full replacement
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });

    if (!res.ok) {
      throw new Error(
        `Failed to update event: ${res.status} ${res.statusText}`,
      );
    }

    return await res.json();
  } catch (error) {
    console.error(
      "Error updating event:",
      error instanceof Error ? error.message : error,
    );
    throw error;
  }
}

export async function deleteEvent(id: string) {
  try {
    const res = await fetch(`${API_URL}/event/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(
        `Failed to delete event: ${res.status} ${res.statusText}`,
      );
    }

    // Many DELETE endpoints return 204 No Content, so don't blindly parse JSON
    if (res.status === 204) return null;
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error(
      "Error deleting event:",
      error instanceof Error ? error.message : error,
    );
    throw error;
  }
}
