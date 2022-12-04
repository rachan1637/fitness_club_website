import { useState, useEffect,useContext, useRef } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from "../context/AuthContext";
import useAxios from "../utils/useAxios";
// import { ReactComponent as ArrowLeft } from '../assets/arrow-left.svg'

const UpdateProfilePage = ({match}) => {
    // let noteId = match.params.id
    let { user } = useContext(AuthContext);
    const api = useAxios();
    const [post, setPost] = useState(null)
    const firstname = useRef(null);
    const lastname = useRef(null);
    const emailv = useRef(null);
    const avatarv = useRef(null);
    const phonenumber = useRef(null);
    
    useEffect(() => {
        api.get("http://127.0.0.1:8000/accounts/view_profile/"
        ).then((response) => {
          setPost(response.data);
        });
    }, []);

    function updatePost() {
      api.put( "http://127.0.0.1:8000/accounts/update_profile/", {
        first_name: firstname.current.value,
        last_name: lastname.current.value,
        email: emailv.current.value,
        avatar: avatarv.current.file,
        phone_number:phonenumber.current.value,

        })
        .then((response) => {
          setPost(response.data);
        }).catch( errors => {
            console.log(errors.response)
        })
    }

    console.log("postpost",post)
    if (!post) return "No post!"

    // handleChange = event => {
    //   this.setPost({ first_name:e.target.value});
    // }
    
    const handleSubmit = async event => {
        // event.preventDefault();
        // updatePost();
        // const first_name = e.target.value;
        console.log("click")
      };

    // const handleSubmit = (event) => {
    //   event.preventDefault();
    //   // alert(`The name you entered was: ${name}`);
    // }
    
    return (
      // <div>
      //   <h1>{post.first_name}</h1>
      //   <p>{post.last_name}</p>
      //   <button onClick={updatePost}>Update Post</button>
      // </div>
        <section>
           <form onSubmit={handleSubmit} className="flex flex-col items-center">
              <h1 className="text-4xl mb-2">Update Profile</h1>
              <hr className="mb-6"/>
              <div>
                <label htmlFor="first_name">First Name</label>
                <input
                type="text"
                id="first_name"
                ref = {firstname}
                // onChange={(e) => {setPost({...post, first_name:e.target.value})}}
                // onChange={(e) => {setNote({...note, body:e.target.value})}} value={note?.body}
                // onChange={e => setNote('b')}
                placeholder="Fill in your first name (optional)"
                className="block mb-5 w-72 border-b-2 border-gray-800 outline-none p-2"
              />
            </div>
            <div>
                <label htmlFor="last_name">Last Name</label>
                <input
                type="text"
                id="last_name"
                ref = {lastname}
                // onChange={(e) => {setPost({...post, first_name:e.target.value})}}
                // onChange={(e) => {setNote({...note, body:e.target.value})}} value={note?.body}
                // onChange={e => setNote('b')}
                placeholder="Fill in your last name (optional)"
                className="block mb-5 w-72 border-b-2 border-gray-800 outline-none p-2"
              />
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input
                type="text"
                id="email"
                ref = {emailv}
                placeholder="Fill in your email(optional)"
                className="block mb-5 w-72 border-b-2 border-gray-800 outline-none p-2"
              />
            </div>
            <div>
                <label htmlFor="avatar">Avatar</label>
                <input
                type="file"
                id="avatar"
                ref = {avatarv}
                placeholder="Select your avatar(optional)"
                className="block mb-5 w-72 border-b-2 border-gray-800 outline-none p-2"
              />
            </div>
            <div>
                <label htmlFor="phone_number">Phone Number</label>
                <input
                type="text"
                id="phone_number"
                ref = {phonenumber}
                placeholder="Fill in your phone number(optional)"
                className="block mb-5 w-72 border-b-2 border-gray-800 outline-none p-2"
              />
            </div>
            <button onClick={updatePost} className="border-2 px-2 py-1 hover:bg-gray-100 border-black rounded-md mt-2">Update Post</button>
          </form>
          {!post && <p className="block text-red-400 rounded-md px-2 pt-5"> No Change has been made. Please fill in at least one field to</p>}
        </section>
    );
  }

  export default UpdateProfilePage