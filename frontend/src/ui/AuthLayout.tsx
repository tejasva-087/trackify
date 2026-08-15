import { Outlet } from "react-router-dom";
import Logo from "./Logo";

function AuthLayout() {
  return (
    <main className="w-screen h-screen max-w-100 m-auto flex flex-col justify-center items-center">
      <Logo className="w-24 mb-4" />
      <Outlet />
    </main>
  );
}

export default AuthLayout;
