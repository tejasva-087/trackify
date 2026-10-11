import { Outlet } from "react-router-dom";
import CalendarProvider from "../features/application/context/CalenderContext";

function AppLayout() {
  return (
    <CalendarProvider>
      <Outlet />
    </CalendarProvider>
  );
}

export default AppLayout;
