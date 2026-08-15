import { GithubLogoIcon, GoogleLogoIcon } from "@phosphor-icons/react";
import Button from "../../ui/Button";

function SocialSignUp() {
  return (
    <div className="w-full space-y-2">
      <Button>
        <GoogleLogoIcon
          className="text-2xl text-black-tertiary"
          weight="light"
        />
        <span>Continue with google</span>
      </Button>
      <Button>
        <GithubLogoIcon
          className="text-2xl text-black-tertiary"
          weight="light"
        />
        <span>Continue with github</span>
      </Button>
    </div>
  );
}

export default SocialSignUp;
