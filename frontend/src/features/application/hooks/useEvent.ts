import { useQuery } from "@tanstack/react-query";
import { getEvents } from "../../../services/apiCalendar";

function useEvent() {
  const { data: events, isPending } = useQuery({
    queryKey: ["event"],
    queryFn: getEvents,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return { events, isPending };
}

export default useEvent;
