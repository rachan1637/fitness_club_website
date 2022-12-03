import axios from "axios";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const useAxios = () => {
  const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);

  const axiosInstance = axios.create({
    // baseURL,
    headers: { Authorization: `Bearer ${authTokens?.access}` }
  });

  axiosInstance.interceptors.request.use(async req => {
    const user = jwt_decode(authTokens.access);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    console.log(req.data)
    console.log(req)

    if (!isExpired) return req;
    
    const response = await axios.post(
      `http://localhost:8000/accounts/login/refresh/`, 
      JSON.stringify({
        "refresh": authTokens.refresh
      }),
      {headers: {"Content-Type": "application/json"}}
    ).catch(
      error => {
      }
    );
    
    console.log(response.data)
    localStorage.setItem("authTokens", JSON.stringify(response.data));
    setAuthTokens(response.data);
    setUser(jwt_decode(response.data.access));

    req.headers.Authorization = `Bearer ${response.data.access}`;
    return req;
  });

  return axiosInstance;
};

export default useAxios;