import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { CalendarEvent } from "../../application/context/CalenderContext";
import { chatCalendar } from "../../../services/apiChatbot";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  events?: CalendarEvent[];
  isError?: boolean;
};

type Options = {
  onEvents?: (events: CalendarEvent[]) => void;
};

function useChatbot({ onEvents }: Options = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const queryClient = useQueryClient();
  const addMessage = (msg: Omit<ChatMessage, "id">) =>
    setMessages((prev) => [...prev, { ...msg, id: crypto.randomUUID() }]);

  const {
    mutate: sendMessage,
    isPending: isSending,
    error,
  } = useMutation({
    mutationFn: (message: string) => chatCalendar(message),
    onMutate: (message) => addMessage({ role: "user", text: message }),
    onSuccess: (data) => {
      if (data.events.length > 0) {
        queryClient.invalidateQueries({ queryKey: ["events"] });
        onEvents?.(data.events);
      }
      addMessage({
        role: "assistant",
        text: data.message,
        events: data.events,
      });
    },
    onError: (err) =>
      addMessage({ role: "assistant", text: err.message, isError: true }),
  });

  return { messages, sendMessage, isSending, error };
}

export default useChatbot;
