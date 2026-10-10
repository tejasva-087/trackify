import { ChatTeardropDotsIcon } from "@phosphor-icons/react";
import { useState, useRef } from "react";
import AutoPositionModal from "./AutoPositionModal";
import Text from "./Text";
import ChatPannel from "../features/chatbot/ChatPannel";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<DOMRect | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggle = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition(rect);
    }
    setIsOpen((state) => !state);
  };

  return (
    <>
      <button
        ref={buttonRef}
        id="chatbot-button"
        onClick={toggle}
        className="fixed bottom-5 right-5 p-3 rounded-full bg-primary text-white-primary"
      >
        <ChatTeardropDotsIcon className="text-2xl" />
      </button>

      {isOpen && position && (
        <AutoPositionModal position={position} onClose={() => setIsOpen(false)}>
          <div className="">
            <header className="p-4 border-b border-white-tertiary">
              <Text type="h3">Trackify AI</Text>
            </header>
            <ChatPannel />
          </div>
        </AutoPositionModal>
      )}
    </>
  );
}

export default Chatbot;
