import { Link } from "react-router-dom";
import SignUpForm from "../features/authentication/SignUpForm";
import Text from "../ui/Text";

function SignUp() {
  return (
    <>
      <header className="space-y-2 mb-6">
        <Text type="h2" className="text-center">
          Get started!
        </Text>
        <Text className="text-center">Get your free account now.</Text>
      </header>

      <SignUpForm />

      <div className="flex items-center justify-center w-full gap-2">
        <Text className="text-black-tertiary">Already have an account?</Text>
        <Link className="text-primary underline" to="/log-in">
          Log in
        </Link>
      </div>
    </>
  );
}

export default SignUp;
