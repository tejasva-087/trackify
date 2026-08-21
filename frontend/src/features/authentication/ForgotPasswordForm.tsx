import { useForm } from "react-hook-form";

import useForgotPassword from "./hooks/useForgotPassword";
import type { ForgotPasswordParams } from "../../services/apiAuth";

import Label from "../../ui/Label";
import Input from "../../ui/Input";
import Text from "../../ui/Text";
import Button from "../../ui/Button";

function ForgotPasswordForm() {
  const { register, handleSubmit, formState, reset } =
    useForm<ForgotPasswordParams>();
  const { errors } = formState;

  const { resetPassword, isSendingResetLink } = useForgotPassword();

  function onSubmit({ email }: ForgotPasswordParams) {
    resetPassword(
      { email },
      {
        onSettled: () => reset(),
      },
    );
  }

  return (
    <div className="w-full">
      <form className="space-y-2 mb-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label id="email">Email</Label>
          <Input
            type="email"
            placeholder="eg: johndoe@email.com"
            id="email"
            {...register("email", {
              required: "Please enter your email address.",
            })}
            disabled={isSendingResetLink}
          />
          <Text className="text-xs text-danger!">
            {errors?.email?.message || ""}
          </Text>
        </div>

        <Button type="primary" disabled={isSendingResetLink}>
          Reset password
        </Button>
      </form>
    </div>
  );
}

export default ForgotPasswordForm;
