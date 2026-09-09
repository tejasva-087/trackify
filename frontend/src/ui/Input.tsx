import {
  forwardRef,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  type?: string;
};

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ type = "text", placeholder = "", className = "", ...rest }, ref) => {
    const sharedClassName = `block border w-full p-2 rounded-md border-white-tertiary disabled:bg-white-tertiary disabled:cursor-none ${className}`;

    if (type === "textarea") {
      return (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          placeholder={placeholder}
          className={`${sharedClassName} overflow-scroll`}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      );
    }

    return (
      <input
        ref={ref as React.Ref<HTMLInputElement>}
        type={type}
        placeholder={placeholder}
        className={sharedClassName}
        {...rest}
      />
    );
  },
);

Input.displayName = "Input";

export default Input;
