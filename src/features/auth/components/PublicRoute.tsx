import { Navigate } from "react-router-dom";
import { APP_ROUTES } from "../../../lib/constants";
import { useAuthStore } from "../store/authStore";

type PublicRouteProps = {
  children: React.ReactNode;
};

export function PublicRoute({ children }: PublicRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={APP_ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
}