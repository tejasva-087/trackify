import { Link } from "react-router-dom";
import Text from "../ui/Text";
import ForgotPasswordForm from "../features/authentication/ForgotPasswordForm";

function ForgotPassword() {
  return (
    <>
      <header className="space-y-2 mb-6">
        <Text type="h2" className="text-center">
          Reset your password
        </Text>
        <Text className="text-center">
          Enter the email address used to sign up.
        </Text>
      </header>

      <ForgotPasswordForm />

      <div className="flex items-center justify-center w-full gap-2">
        <Text className="text-black-tertiary">Don't have an account?</Text>
        <Link className="text-primary underline" to="/sign-up">
          Sign up
        </Link>
      </div>
    </>
  );
}

export default ForgotPassword;
