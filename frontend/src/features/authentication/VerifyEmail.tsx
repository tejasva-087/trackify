import { useLocalStorageState } from "../../hooks/useLocalStorageState";
import { useCountdown } from "../../hooks/useCooldown";
import { formatTime } from "../../utils/helper";
import {
  RESEND_COOL_DOWN,
  RESEND_STORAGE_KEY,
  startResendCooldown,
} from "../../utils/resendCooldown";

import useVerifyEmail from "./hooks/useVerifyEmail";
import useUser from "./hooks/useUser";

import Text from "../../ui/Text";

function VerifyEmail() {
  const { sendVerification, isSendingVerification } = useVerifyEmail();
  const { user, isPending: loadingUser } = useUser();

  const [resendUntil, setResendUntil] = useLocalStorageState<number | null>(
    null,
    RESEND_STORAGE_KEY,
  );
  const { remaining, isRunning } = useCountdown(resendUntil);

  function handleResend() {
    if (!user?.email) return;

    sendVerification(user.email, {
      onSuccess: () => {
        startResendCooldown();
        setResendUntil(Date.now() + RESEND_COOL_DOWN);
      },
    });
  }

  const isDisabled = isRunning || isSendingVerification || loadingUser || !user;

  return (
    <Text>
      <>
        Didn't get the verification link?{" "}
        <button
          onClick={handleResend}
          disabled={isDisabled}
          className={
            isDisabled
              ? "text-gray-400 underline cursor-not-allowed"
              : "text-primary underline"
          }
        >
          {isSendingVerification ? "Sending..." : "Resend it"}
        </button>
        {isRunning && (
          <span className="text-gray-400"> ({formatTime(remaining)})</span>
        )}
      </>
    </Text>
  );
}

export default VerifyEmail;
