import {
  forwardRef,
  type InputHTMLAttributes,
  type Ref,
  type TextareaHTMLAttributes,
} from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    type?: string;
  };

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ type = "text", placeholder = "", className = "", ...rest }, ref) => {
    const sharedClassName = `block border w-full p-2 rounded-md border-white-tertiary disabled:bg-white-tertiary disabled:cursor-not-allowed ${className}`;

    if (type === "textarea") {
      return (
        <textarea
          ref={ref as Ref<HTMLTextAreaElement>}
          placeholder={placeholder}
          className={sharedClassName}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      );
    }

    return (
      <input
        ref={ref as Ref<HTMLInputElement>}
        type={type}
        placeholder={placeholder}
        className={sharedClassName}
        {...(rest as InputHTMLAttributes<HTMLInputElement>)}
      />
    );
  },
);

Input.displayName = "Input";

export default Input;
