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

// TODO: remove the link and replace with forntend url
export async function resendVerification(email: string) {
  const { data, error } = await authClient.sendVerificationEmail({
    email,
    callbackURL: "http://localhost:5173/application",
  });

  if (error) {
    console.error(error);
    throw new Error(error.message ?? "Could not send email verification link.");
  }

  return data;
}

// TODO: remove the link and replace with forntend url
export type ForgotPasswordParams = {
  email: string;
};
export async function forgotPassword({ email }: ForgotPasswordParams) {
  const { data, error } = await authClient.requestPasswordReset({
    email,
    redirectTo: "http://localhost:5173/reset-password",
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
