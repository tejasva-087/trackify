import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import useResetPassword from "./hooks/useResetPassword";

import Label from "../../ui/Label";
import Input from "../../ui/Input";
import Text from "../../ui/Text";
import Button from "../../ui/Button";

type ResetPasswordFormValues = {
  newPassword: string;
  confirmPassword: string;
};

function ForgotPasswordForm() {
  const { register, handleSubmit, formState, reset } =
    useForm<ResetPasswordFormValues>();
  const { errors } = formState;

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const navigate = useNavigate();
  const { resetPassword, isResettingPassword } = useResetPassword();

  function onSubmit({ newPassword }: ResetPasswordFormValues) {
    if (!token) {
      return navigate("/log-in");
    }

    console.log(token);

    resetPassword(
      { newPassword, token },
      {
        onSettled: () => reset(),
      },
    );
  }

  return (
    <div className="w-full">
      <form className="space-y-2 mb-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label id="newPassword">New password</Label>
          <Input
            type="password"
            id="newPassword"
            {...register("newPassword", {
              required: "Please enter your email address.",
            })}
            disabled={isResettingPassword}
          />
          <Text className="text-xs text-danger!">
            {errors?.newPassword?.message || ""}
          </Text>
        </div>

        <div>
          <Label id="confirmPassword">Confirm password</Label>
          <Input
            type="password"
            id="confirmPassword"
            {...register("confirmPassword", {
              required: "Please enter your email address.",
            })}
            disabled={isResettingPassword}
          />
          <Text className="text-xs text-danger!">
            {errors?.confirmPassword?.message || ""}
          </Text>
        </div>

        <Button type="primary" disabled={isResettingPassword}>
          Confirm
        </Button>
      </form>
    </div>
  );
}

export default ForgotPasswordForm;
