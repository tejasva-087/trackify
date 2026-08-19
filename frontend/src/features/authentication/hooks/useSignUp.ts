// hooks/auth/useSignUp.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signUp as signUpApi } from "../../../services/apiAuth";
import { useNavigate } from "react-router-dom";
import { startResendCooldown } from "../../../utils/resendCooldown";
import toast from "react-hot-toast";

function useSignUp() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    mutate: signUp,
    isPending: isSigningUp,
    error,
  } = useMutation({
    mutationFn: signUpApi,
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data);
      startResendCooldown();
      navigate("/application");
      toast.success("Sign up successful!");
    },
    onError: (error) => {
      console.error(error.message);
      toast.error(error.message);
    },
  });

  return { signUp, isSigningUp, error };
}

export default useSignUp;
