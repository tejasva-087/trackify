type DayOption = {
  label: string;
  fullName: string;
  value: number;
};

const DAYS: DayOption[] = [
  { label: "S", fullName: "Sunday", value: 0 },
  { label: "M", fullName: "Monday", value: 1 },
  { label: "T", fullName: "Tuesday", value: 2 },
  { label: "W", fullName: "Wednesday", value: 3 },
  { label: "T", fullName: "Thursday", value: 4 },
  { label: "F", fullName: "Friday", value: 5 },
  { label: "S", fullName: "Saturday", value: 6 },
];

type DayOfWeekPickerProps = {
  value?: number[];
  onChange: (days: number[]) => void;
  name?: string;
  className?: string;
};

function DayOfWeekPicker({
  value = [],
  onChange,
  name = "daysOfWeek",
  className = "",
}: DayOfWeekPickerProps) {
  function toggleDay(day: number) {
    if (value.includes(day)) {
      onChange(value.filter((d) => d !== day));
    } else {
      onChange([...value, day].sort((a, b) => a - b));
    }
  }

  return (
    <div
      className={`flex flex-wrap gap-2 ${className}`}
      role="group"
      aria-label="Days of week"
    >
      {DAYS.map((day) => {
        const isSelected = value.includes(day.value);
        return (
          <label
            key={day.value}
            htmlFor={`${name}-${day.value}`}
            title={day.fullName}
            className="cursor-pointer"
          >
            <input
              type="checkbox"
              id={`${name}-${day.value}`}
              name={name}
              checked={isSelected}
              onChange={() => toggleDay(day.value)}
              className="sr-only peer"
            />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center
                text-xs font-medium transition select-none
                ${
                  isSelected
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {day.label}
            </div>
          </label>
        );
      })}
    </div>
  );
}

export default DayOfWeekPicker;
