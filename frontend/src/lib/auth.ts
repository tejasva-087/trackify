import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
  baseURL: `${import.meta.env.VITE_API_URL}/auth`,
  fetchOptions: {
    credentials: "include",
  },
});

export default authClient;
