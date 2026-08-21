import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import type { LogInParams } from "../../services/apiAuth";

import Button from "../../ui/Button";
import Divider from "../../ui/Divider";
import Input from "../../ui/Input";
import Label from "../../ui/Label";
import SocialSignUp from "./SocialSignUp";
import useLogIn from "./hooks/useLogIn";
import Text from "../../ui/Text";

function LoginForm() {
  const { register, handleSubmit, formState, reset } = useForm<LogInParams>();
  const { errors } = formState;

  const { logIn, isLoggingIn } = useLogIn();

  function onSubmit({ email, password }: LogInParams) {
    logIn(
      { email, password },
      {
        onSettled: () => reset(),
      },
    );
  }

  return (
    <div className="w-full">
      <SocialSignUp />

      <Divider />

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
            disabled={isLoggingIn}
          />
          <Text className="text-xs text-danger!">
            {errors?.email?.message || ""}
          </Text>
        </div>
        <div>
          <Label id="password">Password</Label>
          <Input
            type="password"
            id="password"
            {...register("password", {
              required: "Please enter your password.",
            })}
            disabled={isLoggingIn}
          />
          <Text className="text-xs text-danger!">
            {errors?.password?.message || ""}
          </Text>
          <Link
            to="/forgot-password"
            className="text-primary underline text-sm"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="primary">Log in</Button>
      </form>
    </div>
  );
}

export default LoginForm;
