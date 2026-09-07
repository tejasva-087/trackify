import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { useIsMobile } from "../hooks/useIsMobile";

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

const GAP = 12;
const MODAL_WIDTH = 360;
const VIEWPORT_PADDING = 12;

function Modal({ position, onClose, children }: ModalProps) {
  const isMobile = useIsMobile();
  const modalRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
  } | null>(null);

  useLayoutEffect(() => {
    if (isMobile) return;
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

  // Outside click, escape, scroll — same for both modes
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    const id = requestAnimationFrame(() => {
      document.addEventListener("mousedown", handleClick);
    });
    return () => {
      cancelAnimationFrame(id);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [onClose]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    if (isMobile) return; // don't close-on-scroll for a bottom sheet
    function handleScroll() {
      onClose();
    }
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [onClose, isMobile]);

  if (isMobile) {
    return createPortal(
      <div className="fixed inset-0 z-100 flex items-end">
        <div
          className="absolute inset-0 bg-black/30"
          onClick={onClose}
          aria-hidden="true"
        />
        <div
          ref={modalRef}
          role="dialog"
          data-calendar-popover
          className="relative z-10 w-full rounded-t-2xl bg-white shadow-2xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200"
        >
          <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-gray-300" />
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
      className="fixed z-100 rounded-lg bg-white shadow-2xl ring-1 ring-black/10"
      style={{
        top: coords?.top ?? position.top,
        left: coords?.left ?? position.right + GAP,
        width: MODAL_WIDTH,
        visibility: coords ? "visible" : "hidden",
      }}
    >
      {children}
    </div>,
    document.body,
  );
}

export default Modal;
