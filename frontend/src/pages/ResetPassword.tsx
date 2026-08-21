import ResetPasswordForm from "../features/authentication/ResetPasswordForm";
import Text from "../ui/Text";

function ResetPassword() {
  return (
    <>
      <header className="space-y-2 mb-6">
        <Text type="h2" className="text-center">
          Create new password!
        </Text>
        <Text className="text-center">Please enter a new password</Text>
      </header>

      <ResetPasswordForm />
    </>
  );
}

export default ResetPassword;
