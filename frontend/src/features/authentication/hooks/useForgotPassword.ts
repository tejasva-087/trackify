import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { forgotPassword as forgotPasswordApi } from "../../../services/apiAuth";

function useForgotPassword() {
  const { mutate: resetPassword, isPending: isSendingResetLink } = useMutation({
    mutationFn: forgotPasswordApi,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      console.error(error);
      toast.error("There was an error sending the reset link.");
    },
  });

  return { resetPassword, isSendingResetLink };
}

export default useForgotPassword;
