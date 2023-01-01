import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const LoginPage = () => {
  console.log(AuthContext)
  const { loginUser, errors } = useContext(AuthContext);
  const handleSubmit = e => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    username.length > 0 && loginUser(username, password);
  };

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <h1 className="text-4xl mb-2">Login </h1>
        <hr className="mb-6" />
        <label className="block" htmlFor="username">Username</label>
        <input className="block mb-5 w-full border-b-2 border-gray-800 outline-none p-2" type="text" id="username" placeholder="Enter Username" required/>

        <label className="block" htmlFor="password">Password</label>
        <input className="block w-full border-b-2 border-gray-800 outline-none p-2" type="password" id="password" placeholder="Enter Password" required/>

        {errors.detail && <p className="block text-red-400 rounded-md px-2 pt-5">The username doesn't exist or the password is incorrect</p>}

        <button className="mt-5 border-2 border-gray-700 rounded-md px-2 py-1" type="submit">Login</button>
        <div className="mt-5">
          Still haven't registered? Do it now! 
          <Link className="ml-5 border-2 border-gray-700 rounded-md hover:bg-gray-400 hover:underline px-2 py-2 " to="/register/">Register</Link>
        </div>
      </form>
    </section>
  );
};

export default LoginPage;