import { forwardRef } from "react";

type ToggleProps = React.InputHTMLAttributes<HTMLInputElement>;

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ id, className = "", ...rest }, ref) => {
    return (
      <label
        htmlFor={id}
        className="relative inline-flex items-center cursor-pointer"
      >
        <input
          type="checkbox"
          id={id}
          ref={ref}
          className={`sr-only peer ${className}`}
          {...rest}
        />
        <div
          className="w-11 h-6 bg-gray-200 rounded-full peer
                     peer-checked:bg-primary transition-colors
                     peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50
                     after:content-[''] after:absolute after:top-0.5 after:left-0.5
                     after:bg-white after:rounded-full after:h-5 after:w-5
                     after:shadow-sm after:transition-all peer-checked:after:translate-x-5"
        />
      </label>
    );
  },
);

Toggle.displayName = "Toggle";

export default Toggle;
