import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";

const Logout = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setToken(null);
    localStorage.removeItem("query");
    navigate("/", { replace: true });
  }, [navigate, setToken]);

  return <></>
};

export default Logout;
