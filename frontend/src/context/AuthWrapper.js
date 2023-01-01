import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export const AuthWrapper = () => {
  // try {

  // } catch {
  //   alert("Please login again.")
  // }
  const { authTokens } = useContext(AuthContext);

  try {
    const user = jwt_decode(authTokens.access);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    if (isExpired) {
      // alert("You need to login again.")
      return <Navigate to="/login"/>;
    } else {
      return <Outlet />
    }
  } catch {
    alert("Please login again.")
    return <Navigate to="/login"/>;
  }
  
} 