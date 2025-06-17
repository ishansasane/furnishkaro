import React, { useEffect } from "react";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const token = localStorage.getItem("auth_token");

  useEffect(() => {
    if (!token) {
      // Redirect to external PHP login page
      window.location.href = "https://sheeladecor.free.nf/";
    }
  }, [token]);

  if (!token) {
    // While redirecting, return nothing
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
