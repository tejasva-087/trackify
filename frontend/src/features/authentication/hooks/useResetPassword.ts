import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { resetPassword as resetPasswordApi } from "../../../services/apiAuth";

function useResetPassword() {
  const { mutate: resetPassword, isPending: isResettingPassword } = useMutation(
    {
      mutationFn: resetPasswordApi,
      onSuccess: (data) => {
        console.log(data);
        toast.success("password changed successfully.");
      },
      onError: (error) => {
        console.error(error);
        toast.error(error.message);
      },
    },
  );

  return { resetPassword, isResettingPassword };
}

export default useResetPassword;
