import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export interface SelectionInfo {
  start: Date;
  end: Date;
  allDay: boolean;
}

export interface ModalPosition {
  x: number;
  y: number;
}

interface CalendarContextValue {
  selectedDate: Date | null;
  goToDate: (date: Date | string) => void;

  pendingSelection: SelectionInfo | null;
  modalPosition: ModalPosition | null;
  isEventModalOpen: boolean;
  openEventModal: (selection: SelectionInfo, position: ModalPosition) => void;
  closeEventModal: () => void;

  // for edit flow later: which event id (if any) is being edited
  editingEventId: string | null;
  setEditingEventId: (id: string | null) => void;
}

const CalendarContext = createContext<CalendarContextValue | undefined>(
  undefined,
);

function CalendarProvider({ children }: { children: ReactNode }) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [pendingSelection, setPendingSelection] =
    useState<SelectionInfo | null>(null);
  const [modalPosition, setModalPosition] = useState<ModalPosition | null>(
    null,
  );
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  const goToDate = useCallback((date: Date | string) => {
    setSelectedDate(new Date(date));
  }, []);

  const openEventModal = useCallback(
    (selection: SelectionInfo, position: ModalPosition) => {
      setPendingSelection(selection);
      setModalPosition(position);
      setIsEventModalOpen(true);
    },
    [],
  );

  const closeEventModal = useCallback(() => {
    setIsEventModalOpen(false);
    setPendingSelection(null);
    setModalPosition(null);
    setEditingEventId(null);
  }, []);

  return (
    <CalendarContext.Provider
      value={{
        selectedDate,
        goToDate,
        pendingSelection,
        modalPosition,
        isEventModalOpen,
        openEventModal,
        closeEventModal,
        editingEventId,
        setEditingEventId,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCalendarContext() {
  const ctx = useContext(CalendarContext);
  if (!ctx) {
    throw new Error(
      "useCalendarContext must be used within a CalendarProvider",
    );
  }
  return ctx;
}

export default CalendarProvider;
