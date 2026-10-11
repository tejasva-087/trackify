import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { PaperPlaneTiltIcon } from "@phosphor-icons/react";
import ChatMessage from "../../ui/ChatMessage";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import type { ParserType } from "./types";
import { useChatHistory } from "./hook/useChatHistory";
import { useSendMessage } from "./hook/useSendMessage";
import { getFriendlyErrorMessage } from "../../utils/ChatBotErrors";
import useDeleteChats from "./hook/useDeleteChats";

type FormData = {
  message: string;
  parser: ParserType;
};

interface ChatPannelProps {
  className?: string;
}

function ChatPannel({ className = "" }: ChatPannelProps) {
  const { register, handleSubmit, watch, reset } = useForm<FormData>({
    defaultValues: {
      message: "",
      parser: "openai",
    },
  });

  const parser = watch("parser");

  const {
    messages,
    isLoading: historyLoading,
    error: historyError,
  } = useChatHistory();
  const { sendMessage, loading: sending, error: sendError } = useSendMessage();
  const { deleteChats, isDeletingChat } = useDeleteChats();

  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const text = data.message.trim();
    if (!text || sending) return;

    setPendingMessage(text);
    reset({ message: "", parser: data.parser });

    try {
      await sendMessage({
        message: text,
        parser: data.parser,
      });
    } catch (err) {
      // The error is shown in the panel via sendError
      console.error("Error sending message:", err);
    } finally {
      setPendingMessage(null);
    }
  };

  return (
    // dvh follows iOS Safari's collapsing toolbar; fixed h-160 on desktop only.
    <div
      className={`h-[65dvh] lg:140 md:h-120 w-full flex flex-col ${className}`}
    >
      <main className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-3">
        <ChatMessage type="received">
          Hi! Tell me your plans in your own words, and I’ll add them to your
          calendar.
        </ChatMessage>

        {/* Loading state for chat history */}
        {historyLoading && (
          <p className="text-xs text-center text-gray-400">
            Loading chat history...
          </p>
        )}

        {/* Error alert if fetching history fails */}
        {historyError && (
          <div
            role="alert"
            className="p-2.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg text-center"
          >
            Failed to load chat history. Please check your connection and
            refresh.
          </div>
        )}

        {/* Render cached chat history */}
        {messages.map((chat) => (
          <div key={chat.id} className="space-y-3">
            <ChatMessage type="sent">{chat.message}</ChatMessage>
            <ChatMessage type="received">{chat.response}</ChatMessage>
          </div>
        ))}

        {/* Optimistic UI indicator while waiting for server/AI response */}
        {pendingMessage && (
          <div className="space-y-3 animate-pulse">
            <ChatMessage type="sent">{pendingMessage}</ChatMessage>
            <ChatMessage type="received">Thinking...</ChatMessage>
          </div>
        )}

        {/* Friendly error alert if sending a message fails */}
        {sendError && (
          <div
            role="alert"
            className="p-2.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg text-center"
          >
            {getFriendlyErrorMessage(sendError)}
          </div>
        )}
      </main>

      <div
        className="shrink-0 p-3 border-t border-white-tertiary"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 px-2 text-xs text-gray-500">
              <span>Parser / Model:</span>
              {/* text-base on mobile (16px) stops iOS zooming in on focus */}
              <select
                {...register("parser")}
                disabled={sending}
                className="bg-transparent border border-white-tertiary rounded px-2 py-1 outline-none text-base md:text-xs cursor-pointer disabled:opacity-50"
              >
                <option value="openai">OpenAI</option>
                <option value="gemini">Gemini</option>
                <option value="qwen">Qwen</option>
                <option value="nlp">NLP Libraries</option>
              </select>
            </div>
            <Button
              type="outline"
              className="text-sm text-black-tertiary px-1! py-0.5! w-fit!"
              onClick={deleteChats}
              disabled={isDeletingChat}
            >
              Reset chats
            </Button>
          </div>
          <div className="p-1 border border-white-tertiary bg-white flex items-center rounded-full">
            <Input
              type="text"
              placeholder={
                sending ? "Thinking..." : `Type a message using ${parser}...`
              }
              className="w-full min-w-0 rounded-full! border-none outline-0"
              disabled={sending}
              {...register("message")}
            />
            <Button
              type="primary"
              className="w-fit! shrink-0 rounded-full!"
              disabled={sending}
            >
              <PaperPlaneTiltIcon className={sending ? "animate-pulse" : ""} />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatPannel;
