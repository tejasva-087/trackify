import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signUp as signUpApi } from "../../services/apiAuth";

function useSignUp() {
  const queryClient = useQueryClient();

  const { mutate: signUp, isPending: isSigningUp } = useMutation({
    mutationKey: ["user"],
    mutationFn: signUpApi,
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data);
    },
  });

  return { signUp, isSigningUp };
}

export default useSignUp;
