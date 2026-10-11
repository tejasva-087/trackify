import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useWindowSize } from "../hooks/getWindowSize";
import { XIcon } from "@phosphor-icons/react";
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

type AutoPositionModalProps = {
  children: ReactNode;
  position: Position;
  onClose?: () => void;
};

const MAX_MODAL_WIDTH = 448;
const GAP = 6;
const MOBILE_BREAK_POINT =
  Number(import.meta.env.VITE_MOBILE_BREAK_POINT) || 768;

// Extra room at the bottom of the scroll area so the last element (Save button,
// chat input) can be scrolled above iOS Safari's floating toolbar.
const MOBILE_BOTTOM_CLEARANCE = "5rem";

function CloseButton({ onClose }: { onClose?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close"
      className="absolute right-2 top-2 z-50 p-3 touch-manipulation"
    >
      <XIcon
        className="h-5 w-5 cursor-pointer text-black-tertiary"
        weight="bold"
      />
    </button>
  );
}

// Visibility is owned by the parent: it renders this component only while a
// selection exists, and `onClose` must clear that selection.
function AutoPositionModal({
  children,
  position,
  onClose,
}: AutoPositionModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { width, height } = useWindowSize();
  const [contentHeight, setContentHeight] = useState(0);
  const isMobile = width < MOBILE_BREAK_POINT;

  // Track the content's real size directly.
  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setContentHeight(entry.target.scrollHeight);
    });
    observer.observe(el);
    setContentHeight(el.scrollHeight);

    return () => observer.disconnect();
  }, [isMobile]);

  if (isMobile)
    return createPortal(
      <>
        {/* Backdrop: tap outside to close */}
        <div
          className="fixed inset-x-0 top-0 bottom-0 z-40 bg-black/30"
          onClick={onClose}
          aria-hidden="true"
        />
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          data-calendar-popover
          // 80dvh keeps the sheet clear of the status bar / Dynamic Island.
          className="fixed inset-x-0 bottom-0 z-50 flex max-h-[80dvh] flex-col overflow-hidden rounded-t-xl border border-white-tertiary bg-white-primary shadow-xl"
        >
          <CloseButton onClose={onClose} />
          <div
            ref={contentRef}
            className="min-h-0 overflow-y-auto overscroll-contain"
            style={{
              WebkitOverflowScrolling: "touch",
              paddingBottom: `calc(${MOBILE_BOTTOM_CLEARANCE} + env(safe-area-inset-bottom, 0px))`,
            }}
          >
            {children}
          </div>
        </div>
      </>,
      document.body,
    );

  // Desktop: cap to the available viewport height so the popover scrolls
  // internally instead of running off-screen.
  const maxAvailableHeight = Math.max(height - GAP * 2, 100);
  const modalHeight = Math.min(contentHeight, maxAvailableHeight);

  const top =
    position.top + modalHeight + position.height > height
      ? Math.max(GAP, position.bottom - modalHeight)
      : position.top;

  const left =
    position.left + MAX_MODAL_WIDTH + position.width > width
      ? Math.max(GAP, position.left - MAX_MODAL_WIDTH - GAP)
      : position.right + GAP;

  return createPortal(
    <div
      ref={modalRef}
      role="dialog"
      data-calendar-popover
      // `fixed`, because getBoundingClientRect() values are viewport-relative
      className="fixed z-50 h-fit overflow-hidden rounded-xl border border-white-tertiary bg-white-primary shadow-xl"
      style={{ width: MAX_MODAL_WIDTH, top, left }}
    >
      <CloseButton onClose={onClose} />
      <div
        ref={contentRef}
        className="overflow-y-auto"
        style={{ maxHeight: maxAvailableHeight }}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

export default AutoPositionModal;
