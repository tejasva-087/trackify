import { useForm } from "react-hook-form";

import type { ForgotPasswordParams } from "../../services/apiAuth";
import Label from "../../ui/Label";
import Input from "../../ui/Input";
import Text from "../../ui/Text";
import Button from "../../ui/Button";
import useForgotPassword from "./hooks/useForgotPassword";

function ForgotPasswordForm() {
  const { register, handleSubmit, formState, reset } =
    useForm<ForgotPasswordParams>();
  const { errors } = formState;

  const { sendVerification, isSendingVerification } = useForgotPassword();

  function onSubmit(email: string) {
    sendVerification(email);
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
            disabled={isSendingVerification}
          />
          <Text className="text-xs text-danger!">
            {errors?.email?.message || ""}
          </Text>
        </div>

        <Button type="primary">Reset password</Button>
      </form>
    </div>
  );
}

export default ForgotPasswordForm;
