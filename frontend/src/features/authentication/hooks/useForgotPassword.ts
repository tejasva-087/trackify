import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { forgotPassword as forgotPasswordApi } from "../../../services/apiAuth";

function useForgotPassword() {
  const { mutate: resetPassword, isPending: isSendingResetLink } = useMutation({
    mutationFn: forgotPasswordApi,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return { resetPassword, isSendingResetLink };
}

export default useForgotPassword;
