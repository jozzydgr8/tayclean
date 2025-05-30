import { User } from "firebase/auth";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type GuestRoutesProps = {
  user: User | null;
  children: ReactNode;
};

export const GuestRoutes = ({ user, children }: GuestRoutesProps) => {
  const adminUID = process.env.REACT_APP_Accepted_Admin;

  if (!user) {
    // Guest user (not logged in) — allow access
    return <>{children}</>;
  }

  if (user.uid === adminUID) {
    // Logged-in admin — redirect to admin dashboard
    return <Navigate to="/admin" replace />;
  }

  // Logged-in non-admin — still allow access to guest routes
  return <>{children}</>;
};
