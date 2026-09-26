import useEvent from "./hooks/useEvent";

type EventCardProps = {
  id: string;
};

function EventCard({ id }: EventCardProps) {
  const { event, isLoadingEvent } = useEvent(id);
  console.log(event);

  return <div className="w-full h-300 bg-red-500">EventCard</div>;
}

export default EventCard;
