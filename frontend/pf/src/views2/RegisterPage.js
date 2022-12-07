import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";

function set_info(box, message) {
    box.innerHTML = message;
    box["className"] = "block text-red-400 rounded-md px-2 py-1 mb-5";
};

const all_errors = ["username", "password", "password2", "email"]

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [email, setEmail] = useState("");
  const [first_name, setFirstname] = useState("");
  const [last_name, setLastname] = useState("");
  const {registerUser, errors } = useContext(AuthContext);  

  const handleSubmit = async e => {
    e.preventDefault();
    registerUser(username, password, password2, email, first_name, last_name);
    console.log(errors)
  };

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <h1 className="text-4xl mb-2">Register as a new user</h1>
        <hr className="mb-6"/>
        <div>
          <label className="block" htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            onChange={e => setUsername(e.target.value)}
            placeholder="Username  (required)"
            required
            className="block mb-5 w-full border-b-2 border-gray-800 outline-none p-2"
          />
          { errors.username && <p className="block text-red-400 rounded-md px-2 py-1 mb-5"> </p> }
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={e => setPassword(e.target.value)}
            placeholder="Password (required)"
            required
            className="block mb-5 w-full border-b-2 border-gray-800 outline-none p-2"
          />
          { errors.password && <p className="block text-red-400 rounded-md px-2 py-1 mb-5"> </p> }
        </div>
        <div>
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            onChange={e => setPassword2(e.target.value)}
            placeholder="Confirm Password (required)"
            required
            className="block mb-5 w-full border-b-2 border-gray-800 outline-none p-2"
          />
          {/* <p>{password2 !== password ? "Passwords do not match" : ""}</p> */}
          <text class="notification" id="password2-notification"> </text>
        </div>
        {/* <h1 className="text-indigo-500 text-l mb-2">Optional Field</h1> */}
        {/* <hr className="mb-6"/> */}
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            onChange={e => setEmail(e.target.value)}
            placeholder="Email (optional)"
            className="block mb-5 w-full border-b-2 border-gray-800 outline-none p-2"
          />
          <p class="notification" id="email-notification"> </p>
        </div>
        <div>
          <label htmlFor="first_name">First Name</label>
          <input
            type="text"
            id="first_name"
            onChange={e => setFirstname(e.target.value)}
            placeholder="Fill in your first name (optional)"
            className="block mb-5 w-full border-b-2 border-gray-800 outline-none p-2"
          />
        </div>
        <div>
          <label htmlFor="last_name">Last Name</label>
          <input
            type="text"
            id="last_name"
            onChange={e => setLastname(e.target.value)}
            placeholder="Fill in your last name (optional)"
            className="block mb-5 w-full border-b-2 border-gray-800 outline-none p-2"
          />
        </div>
        <button className="mt-5 border-2 px-2 py-1 rounded-md border-gray-700 hover:bg-gray-400" type="submit" id="register">Register</button>
      </form>
    </section>
  );
}

export default RegisterPage;