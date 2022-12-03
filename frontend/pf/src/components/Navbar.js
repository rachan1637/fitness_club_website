import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";

const Navbar = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  let login = false;
  try {
    const user = jwt_decode(authTokens.access);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
    if (isExpired) {
      login = false;
    } else {
      login = true;
    }
  } catch {
    login = false;
  }
  
  return (
    <nav>
      <div>
        {/* <h1>App Name</h1> */}
        <div className="flex items-center gap-2 bg-gray-300 px-3 py-2">
          {login ? (
            <>
              <Link className="hover:bg-gray-400 hover:underline px-2 py-1" to="/protected">Protected Page</Link>
              <Link className="hover:bg-gray-400 hover:underline px-2 py-1" to="/course-management">Course Management</Link>
              <Link className="hover:bg-gray-400 hover:underline px-2 py-1" to="/studios-list">Studios Overview</Link>
              <Link className="ml-auto hover:bg-gray-400 hover:underline px-2 py-1" to="/user-home">User Home</Link>
              <button className="px-2 py-1 border-gray-800 border-2 rounded-md hover:shadow-lg hover:bg-gray-400" onClick={logoutUser}>Logout</button>
            </>
          ) : (
            <>
              <Link className="hover:bg-gray-400 hover:underline px-2 py-1" to="/">Home</Link>
              <Link className="ml-auto hover:bg-gray-400 hover:underline px-2 py-1" to="/login">Login</Link>
              {/* <Link className="hover:bg-gray-400 hover:underline px-2 py-1" to="/register">Register</Link> */}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;