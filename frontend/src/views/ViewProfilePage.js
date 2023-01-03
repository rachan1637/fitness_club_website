import { useEffect, useState } from "react";
import useAxios from "../utils/useAxios";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";


function ViewProfilePage() {
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
      const response = await api.get(
        "/api/accounts/view_profile"
      ).then(() => {
        setUserProfile(response.data);
      }).catch((error) => {
        console.log(error.responses);
      });
      ;
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(userProfile.avatar)

  if (user) {
    console.log("Something went wrong:::", userProfile);
    return (
      <div>
        <h1>Your Profile</h1>
        <img src = {`${userProfile.avatar}`}/>
        <p>First Name: {userProfile.first_name}</p>
        <p>Last Name: {userProfile.last_name}</p>
        <p>Email:  {userProfile.email}</p>
        {/* <Link to={userProfile.avatar}></Link>  */}
        {/* <p>Avatar: </p> */}
        {/* <img src= {{uri:'${userProfile.avatar}'}} /> */}
        {/* <Link to={`${userProfile.avatar}`}> Avatar {userProfile.avatar}</Link> */}
        {/* <a href={`${userProfile.avatar}`}> Profile Avatar </a> */}
        
        <p>Phone number:  {userProfile.phone_number}</p>
        <a href={"http://localhost:3000/update-profile"}> Update Profile </a>
      </div>

    );
  } else {
    return <div>Not allowed</div>
  }
}

export default ViewProfilePage;