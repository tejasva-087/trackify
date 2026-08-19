import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logIn as logInApi } from "../../../services/apiAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function useLogIn() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: logIn, isPending: isLoggingIn } = useMutation({
    mutationFn: logInApi,
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data);
      navigate("/application");
      toast.success("log in successful!");
    },
    onError: (error) => {
      console.error(error.message);
      toast.error(error.message);
    },
  });

  return { logIn, isLoggingIn };
}

export default useLogIn;
