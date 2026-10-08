import type { ReactNode } from "react";

type ChatMessageProps = {
  type: "sent" | "received";
  children: ReactNode;
  time?: string;
};

function ChatMessage({ type, children, time }: ChatMessageProps) {
  const isSent = type === "sent";

  return (
    <div className={`flex w-full ${isSent ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex max-w-[80%] flex-col gap-1 ${
          isSent ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`wrap-break-word whitespace-pre-wrap px-3 py-2 text-sm ${
            isSent
              ? "rounded-2xl rounded-br-sm bg-primary text-white-primary"
              : "rounded-2xl rounded-bl-sm border border-white-tertiary bg-white-primary text-black-primary"
          }`}
        >
          {children}
        </div>

        {time && <span className="text-xs text-black-tertiary">{time}</span>}
      </div>
    </div>
  );
}

export default ChatMessage;
