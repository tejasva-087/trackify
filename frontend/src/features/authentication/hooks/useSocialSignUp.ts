import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

function useSocialSignUp(socialSignUpFn: () => Promise<unknown>) {
  const {
    mutate: socialSignUp,
    isPending: isSigningUp,
    error,
  } = useMutation({
    mutationFn: socialSignUpFn,
    onError: (error: Error) => {
      console.error(error.message);
      toast.error(error.message ?? "Sign up failed. Please try again.");
    },
  });

  return { socialSignUp, isSigningUp, error };
}

export default useSocialSignUp;
