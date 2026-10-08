import { ChatCircleDotsIcon } from "@phosphor-icons/react/dist/ssr";
import { useRef, useState } from "react";
import Button from "./Button";
import AutoPositionModal from "./AutoPositionModal";
import Logo from "./Logo";
import Text from "./Text";
import ChatPannel from "../features/chatbot/ChatPannel";

function Chatbot() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<DOMRect | null>(null);

  function toggle() {
    if (position) {
      setPosition(null);
      return;
    }
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (rect) setPosition(rect);
  }

  return (
    <div ref={wrapperRef} className="fixed bottom-5 right-5">
      <Button
        type="primary"
        className="rounded-full! p-3 text-2xl"
        onClick={toggle}
      >
        <ChatCircleDotsIcon />
      </Button>

      {position && (
        <AutoPositionModal
          position={position}
          onClose={() => setPosition(null)}
        >
          <div className="flex h-150 max-h-[80svh] flex-col">
            <header className="shrink-0 border-b border-white-tertiary bg-white-primary py-2 pl-4 pr-12">
              <div className="flex items-center gap-2">
                <Logo className="h-12" />
                <Text type="h3">Trackify AI</Text>
              </div>
            </header>

            <main className="min-h-0 flex-1">
              <ChatPannel />
            </main>
          </div>
        </AutoPositionModal>
      )}
    </div>
  );
}

export default Chatbot;
