import { useEffect, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useUser from "./useUser";
import Spinner from "../../ui/Spinner";

type AuthGuardProps = {
  children: ReactNode;
};

function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isVerified, isPending } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isPending) return;

    if (!isAuthenticated) {
      navigate("/log-in", { replace: true });
      return;
    }

    if (!isVerified) {
      navigate("/email-verification", { replace: true });
      return;
    }

    if (location.pathname === "/email-verification") {
      navigate("/application", { replace: true });
    }
  }, [isAuthenticated, isVerified, isPending, location.pathname, navigate]);

  if (isPending)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );

  return children;
}

export default AuthGuard;
