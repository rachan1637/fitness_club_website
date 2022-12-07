import { useEffect, useState } from "react";
import useAxios from "../utils/useAxios";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
function ProtectedPage() {
  const [res, setRes] = useState("");
  const [userProfile, setUserProfile] = useState({
    "first_name": "",
    "last_name": "",
    "email": "",
    "avatar": "",
    "phone_number": ""
    })
  const api = useAxios();

  let { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("http://127.0.0.1:8000/accounts/view_profile");
        // setRes("Success")
        console.log(response)
        setUserProfile(response.data);
      } catch {
        console.log("Something went wrong");
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (user) {
    console.log("Something went wrong:::", userProfile);
    return (
      <div>
        <h1>Projected Page</h1>
        <p>First Name: {userProfile.first_name}</p>
        <p>Last Name: {userProfile.last_name}</p>
        <p>Email:  {userProfile.email}</p>
        {/* <Link to={userProfile.avatar}></Link>  */}
        {/* <p>Avatar: </p> */}
        {/* <img src= {{uri:'${userProfile.avatar}'}} /> */}
        {/* <Link to={`${userProfile.avatar}`}> Avatar {userProfile.avatar}</Link> */}
        <a href={`${userProfile.avatar}`}> Profile Avatar </a>
        <p>Phone number:  {userProfile.phone_number}</p>
      </div>
    );
  } else {
    return <div>Not allowed</div>
  }
}

export default ProtectedPage;