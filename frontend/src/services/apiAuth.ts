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
    callbackURL: "http://localhost:5173/application",
  });

  if (error) {
    console.error(error);
    throw new Error(error.message ?? "Sign up failed");
  }

  return data;
}

export interface LogInParams {
  email: string;
  password: string;
}
export async function logIn({ email, password }: LogInParams) {
  const { data, error } = await authClient.signIn.email({
    email,
    password,
  });

  if (error) {
    console.error(error);
    throw new Error(error.message ?? "Log in failed");
  }

  return data;
}

export async function resendVerification(email: string) {
  const { data, error } = await authClient.sendVerificationEmail({
    email,
    callbackURL: `${import.meta.env.FRONTEND_URL}/application`,
  });

  if (error) {
    console.error(error);
    throw new Error(error.message ?? "Could not send email verification link.");
  }

  return data;
}

export type ForgotPasswordParams = {
  email: string;
};
export async function forgotPassword({ email }: ForgotPasswordParams) {
  const { data, error } = await authClient.requestPasswordReset({
    email,
    redirectTo: `${import.meta.env.FRONTEND_URL}/reset-password`,
  });

  if (error) {
    console.error(error);
    throw new Error(error.message ?? "Could not send password reset link.");
  }

  return data;
}

export type ResetPasswordParams = {
  newPassword: string;
  token: string;
};
export async function resetPassword({
  newPassword,
  token,
}: ResetPasswordParams) {
  const { data, error } = await authClient.resetPassword({
    newPassword,
    token,
  });

  if (error) {
    console.error(error);
    throw new Error(error.message ?? "Could not reset password.");
  }

  return data;
}

export async function getSession() {
  const { data, error } = await authClient.getSession();

  if (error) {
    throw new Error(error.message ?? "Failed to fetch session");
  }

  return data;
}

export async function signInWithGoogle() {
  const { data, error } = await authClient.signIn.social({
    provider: "google",
    callbackURL: "http://localhost:5173/application",
  });

  if (error) {
    console.error(error);
    throw new Error(error.message ?? "Google sign in failed");
  }

  return data;
}

export async function signInWithGithub() {
  const { data, error } = await authClient.signIn.social({
    provider: "github",
    callbackURL: "http://localhost:5173/application",
  });

  if (error) {
    console.error(error);
    throw new Error(error.message ?? "GitHub sign in failed");
  }

  return data;
}
