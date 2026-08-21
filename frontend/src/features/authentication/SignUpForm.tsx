import { useForm } from "react-hook-form";

import type { SignUpParams } from "../../services/apiAuth";
import useSignUp from "./hooks/useSignUp";

import Button from "../../ui/Button";
import Divider from "../../ui/Divider";
import Input from "../../ui/Input";
import Label from "../../ui/Label";
import SocialSignUp from "./SocialSignUp";
import Text from "../../ui/Text";

function SignUpForm() {
  const { register, handleSubmit, formState, reset } = useForm<SignUpParams>();
  const { errors } = formState;

  const { signUp, isSigningUp } = useSignUp();

  function onSubmit({ name, email, password }: SignUpParams) {
    signUp(
      { name, email, password },
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
          <Label id="name">Name</Label>
          <Input
            placeholder="eg: John Doe"
            id="name"
            {...register("name", { required: "Please enter your name." })}
            disabled={isSigningUp}
          />
          <Text className="text-xs text-danger!">
            {errors?.name?.message || ""}
          </Text>
        </div>
        <div>
          <Label id="email">Email</Label>
          <Input
            type="email"
            placeholder="eg: johndoe@email.com"
            id="email"
            {...register("email", {
              required: "Please enter your email address.",
            })}
            disabled={isSigningUp}
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
            disabled={isSigningUp}
          />
          <Text className="text-xs text-danger!">
            {errors?.password?.message || ""}
          </Text>
        </div>

        <Button type="primary" disabled={isSigningUp}>
          Sign up
        </Button>
      </form>
    </div>
  );
}

export default SignUpForm;
