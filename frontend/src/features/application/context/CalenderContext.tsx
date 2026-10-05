import type { CalendarRef } from "@fullcalendar/react";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
  type RefObject,
  useRef,
} from "react";

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

export interface SelectionInfo {
  start: Date;
  end: Date;
  allDay: boolean;
}

export interface ClickPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface CalendarContextValue {
  selectedDate: Date | null;
  goToDate: (date: Date | string) => void;
  clickPosition: ClickPosition | null;

  // NEW EVENT (cell selection) only
  selection: SelectionInfo | null;
  openSelection: (selection: SelectionInfo, position: ClickPosition) => void;

  // VIEW EVENT (card)
  eventId: string | null;
  openEventId: (eventId: string, position: ClickPosition) => void;

  // UPDATE EVENT (edit form) only
  eventToUpdate: CalendarEvent | null;
  openUpdateid: (eventId: string, eventData: CalendarEvent) => void;

  closeEvent: () => void;

  calendarRef: RefObject<CalendarRef | null>;
}

const CalendarContext = createContext<CalendarContextValue | undefined>(
  undefined,
);

function CalendarProvider({ children }: { children: ReactNode }) {
  const calendarRef = useRef<CalendarRef>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selection, setSelection] = useState<SelectionInfo | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);
  const [eventToUpdate, setEventToUpdate] = useState<CalendarEvent | null>(
    null,
  );
  const [clickPosition, setClickPosition] = useState<ClickPosition | null>(
    null,
  );

  const goToDate = useCallback((date: Date | string) => {
    setSelectedDate(new Date(date));
  }, []);

  // View an event card: clears create + update modes
  const openEventId = (eventId: string, position: ClickPosition) => {
    setSelection(null);
    setEventToUpdate(null);
    setEventId(eventId);
    setClickPosition(position);
  };

  // Edit an event: clears create + view modes
  // (keeps clickPosition so the modal stays where the card was)
  const openUpdateid = (_eventId: string, eventData: CalendarEvent) => {
    setSelection(null);
    setEventId(null);
    setEventToUpdate(eventData);
  };

  // New event from cell selection: clears view + update modes
  const openSelection = (selection: SelectionInfo, position: ClickPosition) => {
    setEventId(null);
    setEventToUpdate(null);
    setSelection(selection);
    setClickPosition(position);
  };

  const closeEvent = () => {
    setSelection(null);
    setClickPosition(null);
    setEventId(null);
    setEventToUpdate(null);
  };

  return (
    <CalendarContext.Provider
      value={{
        calendarRef,
        selectedDate,
        goToDate,
        selection,
        eventToUpdate,
        openUpdateid,
        eventId,
        clickPosition,
        openEventId,
        openSelection,
        closeEvent,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCalendar() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error(
      "useCalendarContext must be used within a CalendarProvider",
    );
  }
  return context;
}

export default CalendarProvider;
