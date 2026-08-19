import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { resendVerification } from "../../../services/apiAuth";

function useVerifyEmail() {
  const { mutate: sendVerification, isPending: isSendingVerification } =
    useMutation({
      mutationFn: resendVerification,
      onSuccess: (data) => {
        console.log(data);
      },
      onError: (error) => {
        console.error(error);
      },
    });

  return { sendVerification, isSendingVerification };
}

export default useVerifyEmail;
