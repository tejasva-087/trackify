import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <div className="w-screen h-screen grid grid-rows-[auto_1fr]">
      <header className="bg-red-50">HEADER</header>
      <main className="min-h-0 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
