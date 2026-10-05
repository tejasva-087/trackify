import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteEvent as deleteEventApi } from "../../../services/apiCalendar";
import { useCalendar } from "../context/CalenderContext";

function useDeleteEvent(boundId?: string) {
  const queryClient = useQueryClient();
  const { closeEvent, calendarRef } = useCalendar();

  const { mutate, isPending: isDeletingEvent } = useMutation({
    mutationFn: (id?: string) => {
      const target = id ?? boundId;
      if (!target) throw new Error("No event id provided");
      return deleteEventApi(target);
    },
    onSuccess: (_data, id) => {
      const target = id ?? boundId;
      toast.success("Event deleted");

      // Close the dialog first, so nothing re-renders into "event not found"
      calendarRef.current?.getApi().unselect();
      closeEvent();

      queryClient.invalidateQueries({ queryKey: ["events"] });
      if (target) queryClient.removeQueries({ queryKey: ["event", target] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return { deleteEvent: mutate, isDeletingEvent };
}

export default useDeleteEvent;
