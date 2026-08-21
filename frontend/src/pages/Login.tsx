import { Link } from "react-router-dom";
import LoginForm from "../features/authentication/LoginForm";
import Text from "../ui/Text";

function LogIn() {
  return (
    <>
      <header className="space-y-2 mb-6">
        <Text type="h2" className="text-center">
          Welcome back!
        </Text>
        <Text className="text-center">
          Sign in to continue where you left off.
        </Text>
      </header>

      <LoginForm />

      <div className="flex items-center justify-center w-full gap-2">
        <Text className="text-black-tertiary">Don't have an account?</Text>
        <Link className="text-primary underline" to="/sign-up">
          Sign up
        </Link>
      </div>
    </>
  );
}

export default LogIn;
