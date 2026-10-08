import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { PaperPlaneRightIcon } from "@phosphor-icons/react/dist/ssr";

import type { CalendarEvent } from "../application/context/CalenderContext";
import useChatbot from "./hook/useChatCalendar";
import ChatMessage from "../../ui/ChatMessage";

const MAX_MESSAGE_LENGTH = 2000;

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  events?: CalendarEvent[];
  isError?: boolean;
};

type FormValues = { message: string };

function formatEventTime(e: CalendarEvent) {
  const dateOpts: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
  };
  const timeOpts: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
  };

  let text: string;
  if (e.allDay) {
    const d = new Date(`${e.start.slice(0, 10)}T00:00:00`);
    text = `${d.toLocaleDateString(undefined, dateOpts)} · All day`;
  } else {
    const start = new Date(e.start);
    const end = new Date(e.end);
    text = `${start.toLocaleDateString(undefined, dateOpts)} · ${start.toLocaleTimeString(undefined, timeOpts)} – ${end.toLocaleTimeString(undefined, timeOpts)}`;
  }

  return e.daysOfWeek?.length ? `${text} · repeats weekly` : text;
}

function ChatPannel() {
  const { messages, sendMessage, isSending } = useChatbot({
    // onEvents: (events) => { /* save events with your create-event API */ },
  });

  const { register, handleSubmit, reset, watch } = useForm<FormValues>({
    defaultValues: { message: "" },
  });

  const bottomRef = useRef<HTMLDivElement>(null);
  const hasText = !!watch("message")?.trim();

  // Keep the latest message in view
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  function onSubmit({ message }: FormValues) {
    const text = message.trim();
    if (!text || isSending) return;
    sendMessage(text);
    reset();
  }

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && !isSending && (
          <p className="mt-6 text-center text-sm text-black-tertiary">
            Tell me your plans and I&apos;ll add them to your calendar.
            <br />
            e.g. &ldquo;Work tomorrow at 9, gym for 3 hrs, then movie night at 6
            PM&rdquo;
          </p>
        )}

        {messages.map((m) => (
          <ChatMessage
            key={m.id}
            type={m.role === "user" ? "sent" : "received"}
          >
            <p className={m.isError ? "text-red-600" : undefined}>{m.text}</p>

            {m.events && m.events.length > 0 && (
              <ul className="mt-2 space-y-1.5 border-t border-white-tertiary pt-2">
                {m.events.map((e) => (
                  <li key={e.id} className="text-xs">
                    <span className="font-semibold">{e.title}</span>
                    <br />
                    <span className="text-black-tertiary">
                      {formatEventTime(e)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </ChatMessage>
        ))}

        {isSending && (
          <ChatMessage type="received">
            <span className="animate-pulse">Thinking…</span>
          </ChatMessage>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex shrink-0 items-end gap-2 border-t border-white-tertiary bg-white-primary p-3"
      >
        <textarea
          rows={1}
          placeholder="Describe your plans…"
          className="max-h-32 min-h-10 flex-1 resize-none rounded-xl border border-white-tertiary px-3 py-2 text-sm outline-none focus:border-primary"
          {...register("message", {
            required: true,
            maxLength: MAX_MESSAGE_LENGTH,
          })}
          onKeyDown={(e) => {
            // Enter sends, Shift+Enter inserts a new line
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(onSubmit)();
            }
          }}
        />

        <button
          type="submit"
          disabled={!hasText || isSending}
          aria-label="Send message"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg text-white-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <PaperPlaneRightIcon />
        </button>
      </form>
    </div>
  );
}

export default ChatPannel;
