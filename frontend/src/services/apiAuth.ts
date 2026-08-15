import authClient from "../lib/auth";

export interface SignUpParams {
  name: string;
  email: string;
  password: string;
  image?: string;
}
export async function signUp({ name, email, password, image }: SignUpParams) {
  const { data, error } = await authClient.signUp.email({
    name,
    email,
    password,
    image,
    callbackURL: "http://localhost:5173",
  });

  if (error) {
    console.error(error);
    throw new Error(error.message ?? "Sign up failed");
  }

  return data;
}
