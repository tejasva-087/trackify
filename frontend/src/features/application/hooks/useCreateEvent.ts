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
      queryClient.invalidateQueries({ queryKey: ["events"] });
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

// const data = {
//   json: {
//     userId: "vGLn0kWg6OC2Ncx1GI0IK8xRWRPLONxN",
//     id: "76189c73-6d1c-4470-919b-778e60d726ed",
//     title: "Hello world",
//     description: "Recurring event :)",
//     start: "2026-09-17 02:00:00+00",
//     end: "2026-09-17 08:30:00+00",
//     allDay: false,
//     url: "",
//     color: "#9d7a6a",
//     contrastColor: null,
//     daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
//     startRecur: "2026-09-17",
//     endRecur: "2026-09-30",
//     startTime: null,
//     endTime: null,
//     editable: null,
//     createdAt: "2026-09-17T00:04:28.976Z",
//     updatedAt: "2026-09-17T00:04:28.976Z",
//   },
// };
