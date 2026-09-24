import { useQuery } from "@tanstack/react-query";
import { getEvents } from "../../../services/apiCalendar";

function useEvent() {
  const { data: events, isPending: isLoadingEvents } = useQuery({
    queryKey: ["event"],
    queryFn: getEvents,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return { events, isLoadingEvents };
}

export default useEvent;
