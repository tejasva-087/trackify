import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import useUser from "./hooks/useUser";
import Spinner from "../../ui/Spinner";

function GuestGuard() {
  const { isAuthenticated, isPending } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isPending) return;

    if (isAuthenticated) {
      navigate("/application", { replace: true });
    }
  }, [isAuthenticated, isPending, navigate]);

  if (isPending) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return !isAuthenticated ? <Outlet /> : null;
}

export default GuestGuard;
