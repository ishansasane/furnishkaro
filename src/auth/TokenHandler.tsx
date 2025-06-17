// auth/TokenHandler.tsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TokenHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  useEffect(() => {
    const token = searchParams.get("token");
    const name = searchParams.get("name");
    const email = searchParams.get("email");

    if (token && name && email) {
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_name", name);
      localStorage.setItem("auth_email", email);

      // Clean URL
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  return null;
};

export default TokenHandler;
