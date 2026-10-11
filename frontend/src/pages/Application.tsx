import AppNavigation from "../features/application/AppNavigation";
import Calendar from "../features/application/Calendar";
import CalendarEvents from "../features/application/CalendarEvents";
import Chatbot from "../features/chatbot/ChatBot";

function Application() {
  return (
    <div className="grid h-dvh w-full grid-cols-[auto_1fr] grid-rows-[minmax(0,1fr)] overflow-hidden">
      <AppNavigation />
      <main className="min-h-0 min-w-0 overflow-hidden">
        <Calendar />
        <CalendarEvents />
        <Chatbot />
      </main>
    </div>
  );
}

export default Application;
