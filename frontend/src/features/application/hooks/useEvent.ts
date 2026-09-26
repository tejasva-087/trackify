import { useQuery } from "@tanstack/react-query";
import { getEvent } from "../../../services/apiCalendar";

function useEvent(id: string) {
  const { data: event, isPending: isLoadingEvent } = useQuery({
    queryKey: ["event"],
    queryFn: () => getEvent(id),
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return { event, isLoadingEvent };
}

export default useEvent;
