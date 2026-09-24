// const authClient = createAuthClient({
//   baseURL: import.meta.env.VITE_API_URL,
//   basePath: "/api/v1/auth",
//   fetchOptions: {
//     // send cookies cross-origin
//     credentials: "include",
//   },
// });

import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
  baseURL: `${import.meta.env.VITE_API_URL}/auth`,
  fetchOptions: {
    credentials: "include",
  },
});

export default authClient;
