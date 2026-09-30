import { useQuery } from "@tanstack/react-query";
import { getEvent } from "../../../services/apiCalendar";

function useEvent(id: string) {
  const { data: event, isPending: isLoadingEvent } = useQuery({
    queryKey: ["event", id],
    queryFn: () => getEvent(id),
  });

  return { event, isLoadingEvent };
}

export default useEvent;
