import { forwardRef, type InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ type = "text", placeholder = "", className = "", ...rest }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={`block border w-full p-2 rounded-md border-white-tertiary disabled:bg-white-tertiary disabled:cursor-none ${className}`}
        {...rest}
      />
    );
  },
);

Input.displayName = "Input";

export default Input;
