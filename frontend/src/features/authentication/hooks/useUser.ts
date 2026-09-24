import { useQuery } from "@tanstack/react-query";
import { getSession } from "../../../services/apiAuth";

function useUser() {
  const { data, isPending } = useQuery({
    queryKey: ["user"],
    queryFn: getSession,
  });

  const user = data?.user;
  const session = data?.session;

  const isAuthenticated = Boolean(user?.id);
  const isVerified = user?.emailVerified;

  return { user, session, isAuthenticated, isVerified, isPending };
}

export default useUser;
