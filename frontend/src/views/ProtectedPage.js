import { useEffect, useState } from "react";
import useAxios from "../utils/useAxios";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

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
        const response = await api.get("/api/accounts/view_profile");
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
    return (
      <div>
        <h1>Projected Page</h1>
        <p>First Name: {userProfile.first_name}</p>
        <p>Avatar: {userProfile.avatar}</p>
        {/* <img src= {userProfile.avatar}/> */}
      </div>
    );
  } else {
    return <div>Not allowed</div>
  }
}

export default ProtectedPage;