import Button from "../../ui/Button";
import Divider from "../../ui/Divider";
import Input from "../../ui/Input";
import Label from "../../ui/Label";
import SocialSignUp from "./SocialSignUp";

function LoginForm() {
  return (
    <div className="space-y-3 w-full">
      <SocialSignUp />

      <Divider />

      <form className="space-y-2 mb-6">
        <div>
          <Label id="email">Email</Label>
          <Input placeholder="eg: johndoe@email.com" id="email" />
        </div>
        <div>
          <Label id="password">Password</Label>
          <Input placeholder="eg: johndoe@email.com" id="password" />
        </div>

        <Button className="bg-primary text-white-primary">Log in</Button>
      </form>
    </div>
  );
}

export default LoginForm;
