import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createEvent as createEventApi } from "../../../services/apiCalendar";

function useCreateEvent() {
  const queryClient = useQueryClient();

  const {
    mutate: createEvent,
    isPending: isCreatingEvent,
    error,
  } = useMutation({
    mutationFn: createEventApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event"] });
      toast.success("Created event successful!");
    },
    onError: (error) => {
      console.error(error.message);
      toast.error(error.message);
    },
  });

  return { createEvent, isCreatingEvent, error };
}

export default useCreateEvent;
