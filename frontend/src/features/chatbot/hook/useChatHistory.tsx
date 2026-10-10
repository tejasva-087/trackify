import { useQuery } from "@tanstack/react-query";
import type { ChatMessage } from "../types";
import { getChats } from "../../../services/apiChatbot";

export function useChatHistory() {
  const {
    data: messages = [],
    isLoading,
    error,
    refetch,
  } = useQuery<ChatMessage[]>({
    queryKey: ["chats"],
    queryFn: getChats,
  });

  return { messages, isLoading, error, refetch };
}
