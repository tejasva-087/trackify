import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { resendVerification } from "../../../services/apiAuth";

function useVerifyEmail() {
  const { mutate: sendVerification, isPending: isSendingVerification } =
    useMutation({
      mutationFn: resendVerification,
      onSuccess: () => {
        toast.success(
          "A verification mail has bees sent to your email account.",
        );
      },
      onError: (error) => {
        console.error(error);
        toast.error("There was an error sending verification mail.");
      },
    });

  return { sendVerification, isSendingVerification };
}

export default useVerifyEmail;
