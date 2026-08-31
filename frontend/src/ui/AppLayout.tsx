import { Outlet } from "react-router-dom";
import AppNavigation from "./AppNavigation";

function AppLayout() {
  return (
    <div className="w-screen h-screen grid grid-cols-[auto_1fr]">
      <AppNavigation />
      <main className="min-h-0 overflow-hidden">
        <Outlet />
      </main>
      {/* <ChatMenu /> */}
    </div>
  );
}

export default AppLayout;
