type ColorOption = {
  name: string;
  value: string;
};

type ColorPickerProps = {
  colors: ColorOption[];
  value?: string;
  onChange: (color: string) => void;
  name?: string;
  className?: string;
};

function ColorPicker({
  colors,
  value,
  onChange,
  name = "color",
  className = "",
}: ColorPickerProps) {
  return (
    <div
      className={`flex flex-wrap gap-2 ${className}`}
      role="radiogroup"
      aria-label="Event color"
    >
      {colors.map((color) => {
        const isSelected = value === color.value;
        return (
          <label
            key={color.value}
            htmlFor={`${name}-${color.value}`}
            title={color.name}
            className="cursor-pointer"
          >
            <input
              type="radio"
              id={`${name}-${color.value}`}
              name={name}
              value={color.value}
              checked={isSelected}
              onChange={() => onChange(color.value)}
              className="sr-only peer"
            />
            <div
              style={{ backgroundColor: color.value }}
              className={`w-6 h-6 rounded-full flex items-center justify-center
                ring-offset-2 transition
                ${isSelected ? "ring-2 ring-black" : "ring-0"}
              `}
            >
              {isSelected && (
                <svg
                  viewBox="0 0 24 24"
                  className="w-3.5 h-3.5 stroke-white stroke-2 fill-none"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          </label>
        );
      })}
    </div>
  );
}

export default ColorPicker;
