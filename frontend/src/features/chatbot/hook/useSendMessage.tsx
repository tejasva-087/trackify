import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  sendMessage as apiSendMessage,
  type SendMessageParams,
} from "../../../services/apiChatbot";
import type { ChatMessage } from "../types";

export function useSendMessage() {
  const queryClient = useQueryClient();

  const {
    mutateAsync: sendMessage,
    isPending: loading,
    error,
  } = useMutation({
    mutationFn: (params: SendMessageParams) => apiSendMessage(params),
    onSuccess: (newChat: ChatMessage) => {
      queryClient.setQueryData<ChatMessage[]>(["chats"], (old = []) => [
        ...old,
        newChat,
      ]);
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  return { sendMessage, loading, error };
}
