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

  selection: SelectionInfo | null;
  openSelection: (selection: SelectionInfo, position: ClickPosition) => void;

  eventId: string | null;
  openEventId: (eventId: string, position: ClickPosition) => void;

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
  const [clickPosition, setClickPosition] = useState<ClickPosition | null>(
    null,
  );

  const goToDate = useCallback((date: Date | string) => {
    setSelectedDate(new Date(date));
  }, []);

  const openEventId = (eventId: string, position: ClickPosition) => {
    setEventId(eventId);
    setClickPosition(position);
  };

  const openSelection = (selection: SelectionInfo, position: ClickPosition) => {
    setEventId(null);
    setSelection(selection);
    setClickPosition(position);
  };

  const closeEvent = () => {
    setSelection(null);
    setClickPosition(null);
    setEventId(null);
  };

  return (
    <CalendarContext.Provider
      value={{
        calendarRef,
        selectedDate,
        goToDate,
        selection,
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
