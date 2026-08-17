import { Navigate, useLocation } from "react-router-dom";
import { APP_ROUTES } from "../../../lib/constants";
import { useAuthStore } from "../store/authStore";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={APP_ROUTES.LOGIN}
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  return <>{children}</>;
}