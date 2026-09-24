import { GithubLogoIcon, GoogleLogoIcon } from "@phosphor-icons/react";
import Button from "../../ui/Button";
import { signInWithGithub, signInWithGoogle } from "../../services/apiAuth";
import useSocialSignUp from "./hooks/useSocialSignUp";

function SocialSignUp() {
  const { socialSignUp: googleSignUp, isSigningUp: isGoogleSigningUp } =
    useSocialSignUp(signInWithGoogle);
  const { socialSignUp: githubSignUp, isSigningUp: isGithubSigningUp } =
    useSocialSignUp(signInWithGithub);

  const isSigningUp = isGoogleSigningUp || isGithubSigningUp;

  return (
    <div className="w-full space-y-2">
      <Button onClick={() => googleSignUp()} disabled={isSigningUp}>
        <GoogleLogoIcon
          className="text-2xl text-black-tertiary"
          weight="light"
        />
        <span>
          {isGoogleSigningUp ? "Redirecting..." : "Continue with google"}
        </span>
      </Button>
      <Button onClick={() => githubSignUp()} disabled={isSigningUp}>
        <GithubLogoIcon
          className="text-2xl text-black-tertiary"
          weight="light"
        />
        <span>
          {isGithubSigningUp ? "Redirecting..." : "Continue with github"}
        </span>
      </Button>
    </div>
  );
}

export default SocialSignUp;
