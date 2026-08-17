import { useQuery } from "@tanstack/react-query";
import { getSession } from "../../services/apiAuth";

function useUser() {
  const { data, isPending } = useQuery({
    queryFn: getSession,
    queryKey: ["user"],
  });

  const user = data?.user;
  const session = data?.session;

  const isAuthenticated = Boolean(user?.id);
  const isVerified = user?.emailVerified;

  return { user, session, isAuthenticated, isVerified, isPending };
}

export default useUser;

// {
//     "session": {
//         "expiresAt": "2026-08-24T00:58:59.663Z",
//         "token": "WJ6kbrVFMsrIibycwS0ytcXtJlM54Nii",
//         "createdAt": "2026-08-17T00:58:59.663Z",
//         "updatedAt": "2026-08-17T00:58:59.663Z",
//         "ipAddress": "127.0.0.1",
//         "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36",
//         "userId": "fcQqH91cV1vGauL0DicjLbujwHGI3laP",
//         "id": "11jEP4ldx0xcuLejGzM8UXKLEABgK4HN"
//     },
//     "user": {
//         "name": "Tejuss",
//         "email": "khandelwaltejasva@gmail.com",
//         "emailVerified": false,
//         "image": null,
//         "createdAt": "2026-08-17T00:58:59.390Z",
//         "updatedAt": "2026-08-17T00:58:59.390Z",
//         "id": "fcQqH91cV1vGauL0DicjLbujwHGI3laP"
//     }
// }
