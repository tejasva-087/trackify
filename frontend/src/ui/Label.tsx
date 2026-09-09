import type { ReactNode } from "react";

type labelProp = {
  id: string;
  className?: string;
  children: ReactNode;
};

function Label({ id, children, className = "" }: labelProp) {
  return (
    <label
      htmlFor={id}
      className={`text-sm cursor-pointer font-medium text-black-tertiary
    ${className}`}
    >
      {children}
    </label>
  );
}

export default Label;
