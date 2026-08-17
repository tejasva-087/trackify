import { useMutation } from "@tanstack/react-query";
import { resendVerification } from "../../services/apiAuth";

function useVerifyEmail() {
  const { mutate: sendVerification, isPending: sendingVerification } =
    useMutation({
      mutationFn: resendVerification,
      onSuccess: (data) => {
        if (data.status === true) {
          console.log("VERIFICATION SENT");
        } else {
          console.log("ERROR SENDING VERIFICATION CODE");
        }
      },
    });

  return { sendVerification, sendingVerification };
}

export default useVerifyEmail;
