import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type ButtonProp = {
  className?: string;
  children: ReactNode;
  to?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "outline" | "primary";
};

function Button({
  children,
  to,
  className = "",
  disabled = false,
  onClick,
  type = "outline",
}: ButtonProp) {
  if (to)
    return (
      <Link
        to={to}
        className={`border border-white-tertiary p-3 flex gap-2 items-center justify-center w-full rounded-md ${type === "primary" ? "bg-primary text-white-primary" : ""} ${className}`}
      >
        {children}
      </Link>
    );
  return (
    <button
      className={`border border-white-tertiary p-3 flex gap-2 items-center justify-center w-full rounded-md cursor-pointer disabled:cursor-not-allowed disabled:text-black-tertiary! disabled:bg-white-tertiary! ${type === "primary" ? "bg-primary text-white-primary" : ""} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
