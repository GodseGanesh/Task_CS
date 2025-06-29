import {useEffect} from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/");
  }, [navigate]);

  return <div>Logging Out ..</div>;
}

export default Logout;
