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

const GAP = 12;
const MODAL_WIDTH = 360;
const VIEWPORT_PADDING = 12;

function Modal({ position, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    placement: "right" | "left";
  } | null>(null);

  useLayoutEffect(() => {
    const modalEl = modalRef.current;
    if (!modalEl) return;

    const modalHeight = modalEl.offsetHeight;
    const modalWidth = modalEl.offsetWidth || MODAL_WIDTH;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = position.right + GAP;
    let placement: "right" | "left" = "right";

    if (left + modalWidth + VIEWPORT_PADDING > viewportWidth) {
      left = position.left - modalWidth - GAP;
      placement = "left";

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
    if (top < VIEWPORT_PADDING) {
      top = VIEWPORT_PADDING;
    }

    setCoords({ top, left, placement });
  }, [position]);

  // Close on click outside the popover.
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    // Defer so the click that opened the modal doesn't immediately close it.
    const id = requestAnimationFrame(() => {
      document.addEventListener("mousedown", handleClick);
    });
    return () => {
      cancelAnimationFrame(id);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [onClose]);

  // Close on Escape, and on scroll (GCal does this too, since the anchor moves).
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    function handleScroll() {
      onClose();
    }
    document.addEventListener("keydown", handleKey);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("keydown", handleKey);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [onClose]);

  return createPortal(
    <div
      ref={modalRef}
      role="dialog"
      className="fixed z-50 rounded-lg bg-white shadow-2xl ring-1 ring-black/10"
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
