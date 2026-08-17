import VerifyEmail from "../features/authentication/VerifyEmail";
import Text from "../ui/Text";

function EmailVerification() {
  return (
    <div className="w-full h-full flex items-center justify-center flex-col">
      <header className="space-y-2 mb-6">
        <Text type="h2" className="text-center">
          Please verify your email!
        </Text>
        <Text className="text-center">
          Please click on the verification link sent to your email.
        </Text>
      </header>

      <VerifyEmail />
    </div>
  );
}

export default EmailVerification;
