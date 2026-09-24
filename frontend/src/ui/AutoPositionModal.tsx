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

type AutoPositionModal = {
  children: ReactNode;
  position: Position;
  onClose?: () => void;
};

const MAX_MODAL_WIDTH = 448;
const GAP = 6;

function AutoPositionModal({ children, position, onClose }: AutoPositionModal) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { width, height } = useWindowSize();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [modalHeight, setModalHeight] = useState(0);
  const isMobile = width < import.meta.env.VITE_MOBILE_BREAK_POINT;

  function closeModal() {
    setIsModalOpen(true);
    onClose?.();
  }

  useLayoutEffect(() => {
    if (modalRef.current) {
      setModalHeight(modalRef.current.offsetHeight);
    }
  }, [children]);

  if (isMobile)
    return createPortal(
      <div
        className="overflow-hidden absolute bottom-0 left-0 w-screen h-fit z-50 bg-white-primary border border-white-tertiary rounded-xl"
        ref={modalRef}
        role="dialog"
        data-calendar-popover
      >
        <button onClick={closeModal} className="absolute top-5 right-5">
          <XIcon
            className="cursor-pointer text-black-tertiary w-5 h-5"
            weight="bold"
          />
        </button>
        <div
          className="overflow-y-scroll h-full"
          style={{ maxHeight: "100svh" }}
        >
          {children}
        </div>
      </div>,
      document.body,
    );

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
      className="overflow-hidden absolute z-50 h-fit bg-white-primary border border-white-tertiary rounded-xl shadow-xl"
      ref={modalRef}
      role="dialog"
      data-calendar-popover
      style={{
        maxWidth: MAX_MODAL_WIDTH,
        top,
        left,
        display: isModalOpen ? "block" : "none",
      }}
    >
      <button onClick={closeModal} className="absolute top-5 right-5">
        <XIcon
          className="cursor-pointer text-black-tertiary w-5 h-5"
          weight="bold"
        />
      </button>
      <div className="overflow-y-scroll h-full">{children}</div>
    </div>,
    document.body,
  );
}

export default AutoPositionModal;
