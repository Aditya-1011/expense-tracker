// client/src/components/ProtectedRoute.tsx
import React, { type PropsWithChildren } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute accepts children and either renders them (if signed in)
 * or redirects to /auth. Use it like:
 *   <Route path="/" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
 */

const ProtectedRoute = ({ children }: PropsWithChildren<{}>) => {
  const { isLoaded, isSignedIn } = useUser();

  // Wait until Clerk has finished loading the auth state
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // If not signed in, redirect to auth page
  if (!isSignedIn) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
