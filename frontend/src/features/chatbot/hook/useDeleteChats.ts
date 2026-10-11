import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteChats as deleteChatsApi } from "../../../services/apiChatbot";

function useDeleteChats() {
  const queryClient = useQueryClient();

  const { mutate: deleteChats, isPending: isDeletingChat } = useMutation({
    mutationFn: () => {
      return deleteChatsApi();
    },
    onSuccess: () => {
      toast.success("Chats deleted");

      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return { deleteChats, isDeletingChat };
}

export default useDeleteChats;
