import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  updateEvent as updateEventApi,
  type UpdateEventParams,
} from "../../../services/apiCalendar";

function useUpdateEvent() {
  const queryClient = useQueryClient();

  const { mutate: updateEvent, isPending: isUpdatingEvent } = useMutation({
    mutationFn: (params: UpdateEventParams) => updateEventApi(params),
    onSuccess: (_data, variables) => {
      toast.success("Event updated");
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event", variables.id] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return { updateEvent, isUpdatingEvent };
}

export default useUpdateEvent;
