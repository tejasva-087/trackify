import { Outlet } from "react-router-dom";

import AppMenu from "../features/application/AppMenu";
import AppHeader from "../features/application/AppHeader";

function AppLayout() {
  return (
    <div className="w-screen h-screen grid grid-cols-[auto_1fr_auto]">
      <AppHeader />
      <main className="min-h-0 overflow-hidden">
        <Outlet />
      </main>
      <AppMenu />
    </div>
  );
}

export default AppLayout;
