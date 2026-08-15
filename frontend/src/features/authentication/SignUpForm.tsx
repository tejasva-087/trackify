import { useForm } from "react-hook-form";
import Button from "../../ui/Button";
import Divider from "../../ui/Divider";
import Input from "../../ui/Input";
import Label from "../../ui/Label";
import SocialSignUp from "./SocialSignUp";
import type { SignUpParams } from "../../services/apiAuth";
import useSignUp from "./useSignUp";

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
    <div className="space-y-3 w-full">
      <SocialSignUp />

      <Divider />

      <form className="space-y-2 mb-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label id="name">Name</Label>
          <Input
            placeholder="eg: John Doe"
            id="name"
            {...register("name", { required: "This field is required" })}
            disabled={isSigningUp}
          />
          <p className="text-sm text-danger">{errors?.name?.message}</p>
        </div>
        <div>
          <Label id="email">Email</Label>
          <Input
            placeholder="eg: johndoe@email.com"
            id="email"
            {...register("email", { required: "This field is required" })}
            disabled={isSigningUp}
          />
          <p className="text-sm text-danger">{errors?.email?.message}</p>
        </div>
        <div>
          <Label id="password">Password</Label>
          <Input
            placeholder="eg: johndoe@email.com"
            id="password"
            {...register("password", { required: "This field is required" })}
            disabled={isSigningUp}
          />
          <p className="text-sm text-danger">{errors?.password?.message}</p>
        </div>

        <Button
          className="bg-primary text-white-primary"
          disabled={isSigningUp}
        >
          Sign up
        </Button>
      </form>
    </div>
  );
}

export default SignUpForm;
