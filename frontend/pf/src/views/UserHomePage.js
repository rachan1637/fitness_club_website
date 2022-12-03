import { useContext } from "react";
import UserInfo from "../components/UserInfo";
import AuthContext from "../context/AuthContext";

const UserHomePage = () => {
  const { user } = useContext(AuthContext);
    return (
      <section>
        {user && <UserInfo user={user} />}
        <h1>You are on user home page!</h1>
      </section>
    );
};
  
export default UserHomePage;