import { Outlet } from "react-router-dom";
import AppNavigation from "../features/application/AppNavigation";
import CalendarProvider from "../features/application/context/CalenderContext";

function AppLayout() {
  return (
    <CalendarProvider>
      <div className="w-screen h-screen grid grid-cols-[auto_1fr]">
        <AppNavigation />
        <main className="min-h-0 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </CalendarProvider>
  );
}

export default AppLayout;
