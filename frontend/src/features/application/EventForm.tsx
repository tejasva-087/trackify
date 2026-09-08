// type EventFormProps = {
//   label: string;
// };

import { useForm } from "react-hook-form";
import Input from "../../ui/Input";
import Label from "../../ui/Label";
import Text from "../../ui/Text";
import {
  // createEvent,
  type CreateEventParams,
} from "../../services/apiCalendar";

function EventForm() {
  // reset
  const { register, handleSubmit, formState } = useForm<CreateEventParams>();
  const { errors } = formState;

  function onSubmit() {
    // createEvent(properties, {
    //   onSettled: () => reset(),
    // });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-2">
      {/* TITLE */}
      <div>
        <Label id="title">Title</Label>
        <Input
          type="title"
          placeholder="eg: Board meeting"
          id="title"
          {...register("title", {
            required: "Please provide the title to create the event.",
          })}
          // disabled={isLoggingIn}
        />
        <Text className="text-xs text-danger!">
          {errors?.title?.message || ""}
        </Text>
      </div>

      {/* Start */}
      <div className="flex items-center gap-2">
        <div>
          <Label id="start">Start date</Label>
          <Input
            type="date"
            id="start"
            {...register("title", {
              required: "Please provide the start date.",
            })}
            // disabled={isLoggingIn}
          />
          <Text className="text-xs text-danger!">
            {errors?.start?.message || ""}
          </Text>
        </div>
        <div className="w-full">
          <Label id="startTime">Start time</Label>
          <Input
            type="time"
            id="startTime"
            {...register("title", {
              required: "Please provide the star time.",
            })}
            // disabled={isLoggingIn}
          />
          <Text className="text-xs text-danger!">
            {errors?.startTime?.message || ""}
          </Text>
        </div>
      </div>

      {/* End */}
      <div className="flex items-center gap-2">
        <div>
          <Label id="end">End date</Label>
          <Input
            type="date"
            id="end"
            {...register("title", {
              required: "Please provide the end date.",
            })}
            // disabled={isLoggingIn}
          />
          <Text className="text-xs text-danger!">
            {errors?.end?.message || ""}
          </Text>
        </div>
        <div className="w-full">
          <Label id="end">End time</Label>
          <Input
            type="time"
            id="end"
            {...register("title", {
              required: "Please provide the end time.",
            })}
            // disabled={isLoggingIn}
          />
          <Text className="text-xs text-danger!">
            {errors?.end?.message || ""}
          </Text>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="flex items-start flex-col">
        <Label id="description">Description</Label>
        <textarea
          placeholder="eg: Board meeting"
          id="description"
          {...register("description", {
            required: "Please provide the description to create the event.",
          })}
          // disabled={isLoggingIn}
        />
        <Text className="text-xs text-danger!">
          {errors?.description?.message || ""}
        </Text>
      </div>
    </form>
  );
}

export default EventForm;
