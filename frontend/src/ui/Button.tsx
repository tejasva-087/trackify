import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type ButtonProp = {
  className?: string;
  children: ReactNode;
  to?: string;
  disabled?: boolean;
};

function Button({
  children,
  to,
  className = "",
  disabled = false,
}: ButtonProp) {
  if (to)
    return (
      <Link
        to={to}
        className={`border border-white-tertiary p-3 flex gap-2 items-center justify-center w-full rounded-md ${className}`}
      >
        {children}
      </Link>
    );
  return (
    <button
      className={`border border-white-tertiary p-3 flex gap-2 items-center justify-center w-full rounded-md cursor-pointer ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
