import { useUser } from "@/hooks/useUser";
import { Navigate, Outlet } from "react-router";

const GuestRoute = () => {
  const { user } = useUser();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
