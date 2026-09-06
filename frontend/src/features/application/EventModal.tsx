import { useState, useEffect, useRef } from "react";
import { useCalendarContext } from "./context/CalenderContext";

function toLocalInputValue(date: Date) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

const MODAL_WIDTH = 320;
const MODAL_MARGIN = 8;

function EventModal() {
  const {
    isEventModalOpen,
    pendingSelection,
    modalPosition,
    closeEventModal,
    addEvent,
  } = useCalendarContext();

  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (pendingSelection) {
      setStart(toLocalInputValue(pendingSelection.start));
      setEnd(toLocalInputValue(pendingSelection.end));
      setTitle("");
    }
  }, [pendingSelection]);

  // Clamp position after the modal has a real size to measure
  useEffect(() => {
    if (!isEventModalOpen || !modalPosition || !modalRef.current) return;

    const { offsetWidth, offsetHeight } = modalRef.current;
    let x = modalPosition.x;
    let y = modalPosition.y;

    if (x + offsetWidth + MODAL_MARGIN > window.innerWidth) {
      x = window.innerWidth - offsetWidth - MODAL_MARGIN;
    }
    if (y + offsetHeight + MODAL_MARGIN > window.innerHeight) {
      y = window.innerHeight - offsetHeight - MODAL_MARGIN;
    }
    x = Math.max(MODAL_MARGIN, x);
    y = Math.max(MODAL_MARGIN, y);

    setStyle({ top: y, left: x });
  }, [isEventModalOpen, modalPosition]);

  if (!isEventModalOpen || !pendingSelection) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    addEvent({
      id: crypto.randomUUID(),
      title: title.trim(),
      start,
      end,
      allDay: pendingSelection.allDay,
    });

    closeEventModal();
  }

  return (
    <>
      {/* transparent overlay to catch outside clicks — no dark backdrop, unlike a centered modal */}
      <div className="fixed inset-0 z-40" onClick={closeEventModal} />
      <div
        ref={modalRef}
        style={{ position: "fixed", width: MODAL_WIDTH, ...style }}
        className="z-50 rounded-lg border bg-white p-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-3 text-sm font-semibold">New Event</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            autoFocus
            className="rounded border px-2 py-1 text-sm"
            placeholder="Add title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label className="flex flex-col text-xs">
            Start
            <input
              type="datetime-local"
              className="rounded border px-2 py-1 text-sm"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </label>
          <label className="flex flex-col text-xs">
            End
            <input
              type="datetime-local"
              className="rounded border px-2 py-1 text-sm"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </label>
          <div className="mt-1 flex justify-end gap-2">
            <button
              type="button"
              onClick={closeEventModal}
              className="rounded px-3 py-1 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-blue-600 px-3 py-1 text-sm text-white"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default EventModal;
