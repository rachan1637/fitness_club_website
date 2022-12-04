import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Reference: https://blog.devgenius.io/django-rest-framework-react-authentication-workflow-2022-part-2-d299b7fef875

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );

  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwt_decode(localStorage.getItem("authTokens"))
      : null
  );

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const loginUser = async (username, password) => {

    const response = await axios.post(
        "http://localhost:8000/accounts/login/", 
        JSON.stringify({
            "username": username,
            "password": password
        }),
        {headers: {"Content-Type": "application/json"}}
    ).then(
        response => {
            if (response.status === 200) {
                console.log(response)
                setAuthTokens(response.data);
                //   console.log(jwt_decode(data.access))
                setUser(jwt_decode(response.data.access));
                localStorage.setItem("authTokens", JSON.stringify(response.data));
                navigate("/user-home");
            }
            // else if (response.status == 401) {
            //     console.log("The username doesn't exist or the password is incorrect")
            // }
        }
    ).catch(
        error => {
            // if (error.response.status == 401) {
            //     console.log("The username doesn't exist or the password is incorrect")
            // }
            console.log(error.response.data)
            setErrors(error.response.data)
        }
    )
  };
  
  const registerUser = async (username, password, password2, email, first_name, last_name) => {
    // const response = await fetch("http://127.0.0.1:8000/accounts/register/", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json; charset-utf-8"
    //   },
    //   body: JSON.stringify({
    //     username,
    //     password,
    //     password2,
    //     email,
    //     first_name,
    //     last_name,
    //   })
    // });
    const response = await axios.post(
        "http://localhost:8000/accounts/register/", 
        JSON.stringify(
            {
                "username": username,
                "password": password,
                "password2": password2,
                "email": email,
                "first_name": first_name,
                "last_name": last_name,
            }
        ),
        {headers: {"Content-Type": "application/json"}}
    ).then(
        response => {
            if (response.status === 201) {
                navigate("/login");
            }
        }
    ).catch(
        error => {
            // console.log(error.response.data)
            setErrors(error.response.data)
        }
    )
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    // localStorage.removeItem("position")
    // setUserProfile(null)
    navigate("/");
  };

  const contextData = {
    user,
    setUser,
    authTokens,
    setAuthTokens,
    registerUser,
    loginUser,
    logoutUser,
    errors,
    // userProfile,
  };

  useEffect(() => {
    if (authTokens) {
      setUser(jwt_decode(authTokens.access));
    }
    setLoading(false);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};