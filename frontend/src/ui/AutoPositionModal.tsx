import { XIcon } from "@phosphor-icons/react";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

type Position = {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
};

type ModalProps = {
  position: Position;
  onClose: () => void;
  children: ReactNode;
};

const GAP = 12; // space between the cell and the popover
const MODAL_WIDTH = 480;
const VIEWPORT_PADDING = 12;
const MOBILE_BREAKPOINT = 640; // keep in sync with Calendar.tsx

function useIsMobile(breakpoint = MOBILE_BREAKPOINT) {
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth < breakpoint,
  );

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [breakpoint]);

  return isMobile;
}

function Modal({ position, onClose, children }: ModalProps) {
  const isMobile = useIsMobile();
  const modalRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
  } | null>(null);

  // Desktop: anchored popover positioning (right of cell, flip left, clamp)
  useLayoutEffect(() => {
    if (isMobile) return; // bottom sheet doesn't need this
    const modalEl = modalRef.current;
    if (!modalEl) return;

    const modalHeight = modalEl.offsetHeight;
    const modalWidth = modalEl.offsetWidth || MODAL_WIDTH;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = position.right + GAP;
    if (left + modalWidth + VIEWPORT_PADDING > viewportWidth) {
      left = position.left - modalWidth - GAP;
      if (left < VIEWPORT_PADDING) {
        left = Math.max(
          VIEWPORT_PADDING,
          viewportWidth - modalWidth - VIEWPORT_PADDING,
        );
      }
    }

    let top = position.top;
    if (top + modalHeight + VIEWPORT_PADDING > viewportHeight) {
      top = viewportHeight - modalHeight - VIEWPORT_PADDING;
    }
    if (top < VIEWPORT_PADDING) top = VIEWPORT_PADDING;

    setCoords({ top, left });
  }, [position, isMobile]);

  // Close on click outside the modal (ignored by FullCalendar via
  // unselectCancel="[data-calendar-popover]" on the calendar itself)
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    // Defer so the click that opened the modal doesn't immediately close it
    const id = requestAnimationFrame(() => {
      document.addEventListener("mousedown", handleClick);
    });
    return () => {
      cancelAnimationFrame(id);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Close on scroll — desktop only, since the anchor position goes stale.
  // A bottom sheet is expected to persist while its own content scrolls.
  useEffect(() => {
    if (isMobile) return;
    function handleScroll() {
      onClose();
    }
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [onClose, isMobile]);

  if (isMobile) {
    return createPortal(
      <div className="fixed inset-0 z-50 flex items-end">
        <div
          className="absolute inset-0 bg-black-tertiary/30"
          onClick={onClose}
          aria-hidden="true"
        />
        <div
          ref={modalRef}
          role="dialog"
          data-calendar-popover
          className="relative z-10 w-full rounded-t-2xl bg-white-primary shadow-2xl max-h-[85vh] overflow-y-auto"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-6 top-6 z-10 flex items-center justify-center rounded-full text-black-secondary text-xl cursor-pointer"
          >
            <XIcon />
          </button>

          <div className="p-4">{children}</div>
        </div>
      </div>,
      document.body,
    );
  }

  return createPortal(
    <div
      ref={modalRef}
      role="dialog"
      data-calendar-popover
      className="fixed z-50 rounded-xl bg-white shadow-2xl ring-1 ring-black-tertiary/10"
      style={{
        top: coords?.top ?? position.top,
        left: coords?.left ?? position.right + GAP,
        width: MODAL_WIDTH,
        visibility: coords ? "visible" : "hidden",
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-8 top-8 z-10 flex items-center justify-center rounded-full text-black-secondary text-xl cursor-pointer"
      >
        <XIcon weight="bold" />
      </button>
      {children}
    </div>,
    document.body,
  );
}

export default Modal;
