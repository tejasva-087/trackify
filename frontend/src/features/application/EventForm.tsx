import { useForm, Controller } from "react-hook-form";

import {
  // createEvent,
  type CreateEventParams,
} from "../../services/apiCalendar";

import Input from "../../ui/Input";
import Label from "../../ui/Label";
import Text from "../../ui/Text";
import ColorPicker from "../../ui/ColorPicker";
import { CALENDAR_COLORS, DEFAULT_EVENT_COLOR } from "../../styles/colors";

type EventFormProps = {
  label: string;
  onSubmit: (params: CreateEventParams) => void;
};

function EventForm({ label }: EventFormProps) {
  const { register, handleSubmit, control, formState } =
    useForm<CreateEventParams>({
      defaultValues: {
        color: DEFAULT_EVENT_COLOR,
      },
    });
  const { errors } = formState;

  function onSubmit(values: CreateEventParams) {
    console.log(values);
    // createEvent(values, {
    //   onSettled: () => reset(),
    // });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-2 sm:p-8 space-y-2">
      <Text type="h3" className="text-base">
        {label}
      </Text>

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
          {...register("description", {
            required: "Please provide the description to create the event.",
          })}
          className=""
        />
        <Text className="text-xs text-danger!">
          {errors?.description?.message || ""}
        </Text>
      </div>

      {/* URL */}
      <div>
        <Label id="url">Link</Label>
        <Input
          type="text"
          placeholder="eg: http://example.com"
          id="url"
          {...register("url")}
        />
        <Text className="text-xs text-danger!">
          {errors?.title?.message || ""}
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

      {/* All day */}
    </form>
  );
}

export default EventForm;
