import { useForm, Controller } from "react-hook-form";

import { type CreateEventParams } from "../../services/apiCalendar";

import Input from "../../ui/Input";
import Label from "../../ui/Label";
import Text from "../../ui/Text";
import ColorPicker from "../../ui/ColorPicker";
import { CALENDAR_COLORS, DEFAULT_EVENT_COLOR } from "../../styles/colors";
import {
  combineDateTime,
  toDateInputValue,
  toTimeInputValue,
} from "../../utils/helper";
import DayOfWeekPicker from "../../ui/DayPicker";
import Toggle from "../../ui/Toggle";
import Button from "../../ui/Button";
import {
  useCalendar,
  type CalendarEvent,
  type SelectionInfo,
} from "./context/CalenderContext";

type EventFormValues = {
  start: string;
  end: string;
  startTime: string;
  endTime: string;
  title: string;
  description?: string;
  link?: string;
  color: string;
  allDay: boolean;
  isRecurring: boolean;
  daysOfWeek: number[];
  startRecur: string;
  endRecur: string;
};

export type EventFormSource = SelectionInfo | CalendarEvent;
export type EventSubmitParams = CreateEventParams & { id?: string };

type EventFormProps = {
  label: string;
  submitLabel?: string;
  defaultValues?: EventFormSource;
  onFormSubmit: (
    params: EventSubmitParams,
    options?: { onSettled?: () => void },
  ) => void;
  onDelete?: () => void;
  inProgress: boolean;
};

function isCalendarEvent(source: EventFormSource): source is CalendarEvent {
  return "id" in source;
}

function buildFormValues(source?: EventFormSource): EventFormValues {
  const base: EventFormValues = {
    title: "",
    description: "",
    link: "",
    color: DEFAULT_EVENT_COLOR,
    allDay: false,
    isRecurring: false,
    daysOfWeek: [],
    startRecur: "",
    endRecur: "",
    start: "",
    end: "",
    startTime: "",
    endTime: "",
  };

  if (!source) return base;

  const common: EventFormValues = {
    ...base,
    allDay: source.allDay ?? false,
    start: toDateInputValue(source.start),
    end: toDateInputValue(source.end),
    startTime: toTimeInputValue(source.start),
    endTime: toTimeInputValue(source.end),
  };

  // New selection: only dates/times
  if (!isCalendarEvent(source)) return common;

  // Existing event: normalize nulls
  const isRecurring = !!source.daysOfWeek?.length;

  return {
    ...common,
    title: source.title,
    description: source.description ?? "",
    link: source.link ?? "",
    color: source.color ?? DEFAULT_EVENT_COLOR,
    isRecurring,
    daysOfWeek: source.daysOfWeek ?? [],
    startRecur: source.startRecur ? toDateInputValue(source.startRecur) : "",
    endRecur: source.endRecur ? toDateInputValue(source.endRecur) : "",
    // recurring events keep their time in startTime/endTime
    startTime: source.startTime ?? common.startTime,
    endTime: source.endTime ?? common.endTime,
  };
}

function EventForm({
  onFormSubmit,
  onDelete,
  label,
  submitLabel = "Save",
  defaultValues,
  inProgress,
}: EventFormProps) {
  const { calendarRef, closeEvent } = useCalendar();

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    getValues,
    formState,
  } = useForm<EventFormValues>({
    defaultValues: buildFormValues(defaultValues),
  });

  const { errors } = formState;
  const isAllDay = watch("allDay");
  const isRecurring = watch("isRecurring");

  function onSubmit(values: EventFormValues) {
    const params: EventSubmitParams = {
      ...(defaultValues &&
        isCalendarEvent(defaultValues) && { id: defaultValues.id }),
      title: values.title,
      description: values.description,
      link: values.link,
      color: values.color,
      allDay: values.allDay,
      start: combineDateTime(values.start, values.startTime, values.allDay),
      end: combineDateTime(values.end, values.endTime, values.allDay),
      ...(values.isRecurring && {
        daysOfWeek: values.daysOfWeek,
        startRecur: values.startRecur,
        // Empty endRecur => recurrence has no end date (repeats forever)
        endRecur: values.endRecur || undefined,
        startTime: values.allDay ? undefined : values.startTime,
        endTime: values.allDay ? undefined : values.endTime,
      }),
    };

    onFormSubmit(params, {
      onSettled: () => {
        reset();
        calendarRef.current?.getApi().unselect();
        // unselect() does nothing when editing (no active FC selection)
        closeEvent();
      },
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 sm:p-8 space-y-2 h-full"
    >
      <Text type="h3" className="text-base mb-4">
        {label}
      </Text>

      {/* TOGGLE */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1">
          <Toggle id="allDay" {...register("allDay")} />
          <Label id="allDay">All day</Label>
        </div>

        <div className="flex items-center gap-1">
          <Toggle id="isRecurring" {...register("isRecurring")} />
          <Label id="isRecurring">Repeats</Label>
        </div>
      </div>

      {isRecurring && (
        <div className="space-y-2 pl-1">
          <div className="flex flex-col gap-1.5">
            <Label id="daysOfWeek">Repeat on*</Label>
            <Controller
              name="daysOfWeek"
              control={control}
              rules={{
                validate: (v) =>
                  !isRecurring || v.length > 0 || "Pick at least one day",
              }}
              render={({ field }) => (
                <DayOfWeekPicker
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Text className="text-xs text-danger!">
              {errors?.daysOfWeek?.message || ""}
            </Text>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-full">
              <Label id="startRecur">Repeat from*</Label>
              <Input
                type="date"
                id="startRecur"
                {...register("startRecur", {
                  validate: (v) =>
                    !isRecurring ||
                    !!v ||
                    "Pick a start date for the recurrence",
                })}
              />
              <Text className="text-xs text-danger!">
                {errors?.startRecur?.message || ""}
              </Text>
            </div>
            <div className="w-full">
              <Label id="endRecur">Repeat until (optional)</Label>
              <Input
                type="date"
                id="endRecur"
                {...register("endRecur", {
                  validate: (v) => {
                    if (!isRecurring || !v) return true; // blank = repeats forever
                    const startRecur = getValues("startRecur");
                    if (startRecur && v < startRecur) {
                      return "Repeat until date can't be before the repeat from date";
                    }
                    return true;
                  },
                })}
              />
              <Text className="text-xs text-gray-400">
                Leave blank to repeat forever
              </Text>
              <Text className="text-xs text-danger!">
                {errors?.endRecur?.message || ""}
              </Text>
            </div>
          </div>
        </div>
      )}

      {/* DATE */}
      <div className="flex items-center gap-2">
        <div className="w-full">
          <Label id="start">Start date*</Label>
          <Input
            type="date"
            id="start"
            {...register("start", {
              required: "Please provide the starting date",
            })}
          />
          <Text className="text-xs text-danger!">
            {errors?.start?.message || ""}
          </Text>
        </div>
        <div className="w-full">
          <Label id="end">End date*</Label>
          <Input
            type="date"
            id="end"
            {...register("end", {
              required: "Please provide the ending date",
              validate: (value) => {
                const start = getValues("start");
                if (start && value < start) {
                  return "End date can't be before the start date";
                }
                return true;
              },
            })}
          />
          <Text className="text-xs text-danger!">
            {errors?.end?.message || ""}
          </Text>
        </div>
      </div>

      {/* TIME */}
      {!isAllDay && (
        <div className="flex items-center gap-2">
          <div className="w-full">
            <Label id="startTime">Start Time*</Label>
            <Input
              type="time"
              id="startTime"
              {...register("startTime", {
                required: "Please provide the starting time",
              })}
            />
            <Text className="text-xs text-danger!">
              {errors?.startTime?.message || ""}
            </Text>
          </div>
          <div className="w-full">
            <Label id="endTime">End Time*</Label>
            <Input
              type="time"
              id="endTime"
              {...register("endTime", {
                required: "Please provide the ending time.",
                validate: (value) => {
                  const start = getValues("start");
                  const end = getValues("end");
                  const startTime = getValues("startTime");
                  // Only enforce time ordering when it's the same calendar day
                  if (
                    start &&
                    end &&
                    start === end &&
                    startTime &&
                    value <= startTime
                  ) {
                    return "End time must be after the start time";
                  }
                  return true;
                },
              })}
            />
            <Text className="text-xs text-danger!">
              {errors?.endTime?.message || ""}
            </Text>
          </div>
        </div>
      )}

      {/* TITLE */}
      <div>
        <Label id="title">Title*</Label>
        <Input
          type="text"
          placeholder="eg: Board meeting"
          id="title"
          {...register("title", {
            required: "Please provide the title to create the event.",
          })}
        />
        <Text className="text-xs text-danger!">
          {errors?.title?.message || ""}
        </Text>
      </div>

      {/* DESCRIPTION */}
      <div className="flex items-start flex-col">
        <Label id="description">Description</Label>
        <Input
          type="textarea"
          placeholder="eg: Board meeting"
          id="description"
          {...register("description")}
        />
        <Text className="text-xs text-danger!">
          {errors?.description?.message || ""}
        </Text>
      </div>

      {/* URL */}
      <div>
        <Label id="link">Link</Label>
        <Input
          type="text"
          placeholder="eg: http://example.com"
          id="link"
          {...register("link")}
        />
        <Text className="text-xs text-danger!">
          {errors?.link?.message || ""}
        </Text>
      </div>

      {/* COLOR */}
      <div className="flex flex-col gap-1.5">
        <Label id="color">Color</Label>
        <Controller
          name="color"
          control={control}
          render={({ field }) => (
            <ColorPicker
              colors={CALENDAR_COLORS}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Text className="text-xs text-danger!">
          {errors?.color?.message || ""}
        </Text>
      </div>

      {/* SUBMIT */}
      <div className="flex items-center justify-between pt-2">
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="text-danger text-sm"
          >
            Delete
          </button>
        )}
        <Button type="primary" disabled={inProgress}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

export default EventForm;
