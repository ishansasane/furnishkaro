import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const normalizePath = (path: string) => {
  // Remove trailing slash except root
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
};

const cleanRoute = (route: string) => {
  // Removes backslashes and trailing slashes
  try {
    const decoded = route.replace(/\\/g, "");
    return normalizePath(decoded);
  } catch {
    return route;
  }
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const token = localStorage.getItem("auth_token");
  const location = useLocation();
  const currentPath = normalizePath(location.pathname);

  let allowedRoutes: string[] = [];

  try {
    const raw = localStorage.getItem("allowed_routes");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        allowedRoutes = parsed.map(cleanRoute);
      }
    }
  } catch (err) {
    console.error("❌ Failed to parse routes:", err);
  }

  const isAllowed = token && allowedRoutes.includes(currentPath);

  useEffect(() => {
    if (!token) {
      // In development mode, navigate to login instead of external redirect
      if (import.meta.env.DEV) {
        console.warn("No auth token found - redirecting to /login");
        window.location.href = "/login";
      } else {
        window.location.href = "https://sheeladecor.free.nf/";
      }
    } else if (!isAllowed) {
      alert("🚫 You do not have permission to access this page.");
      window.location.href = "/";
    }
  }, [token, isAllowed]);

  if (!isAllowed) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
