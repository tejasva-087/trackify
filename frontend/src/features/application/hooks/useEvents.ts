import { useQuery } from "@tanstack/react-query";
import { getEvents } from "../../../services/apiCalendar";

function useEvents() {
  const { data: events, isPending: isLoadingEvents } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return { events, isLoadingEvents };
}

export default useEvents;
