import { useState, useEffect,useContext, useRef } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from "../context/AuthContext";
import useAxios from "../utils/useAxios";
// import { ReactComponent as ArrowLeft } from '../assets/arrow-left.svg'
const UpdatePasswordPage = ({match}) => {
    // let noteId = match.params.id
    let { user } = useContext(AuthContext);
    const api = useAxios();
    const [post, setPost] = useState(null)

    const oldpassword = useRef(null);
    const passwordv = useRef(null);
    const password2v = useRef(null);
    // const avatarv = useRef(null);
    // const phonenumber = useRef(null);
    
    // useEffect(() => {
    //     api.get("http://127.0.0.1:8000/accounts/view_profile/"
    //     ).then((response) => {
    //       setPost(response.data);
    //     });
    // }, []);

    function updatePost() {
      api.put( "http://127.0.0.1:8000/accounts/change_password/", {
        old_password: oldpassword.current.value,
        password: passwordv.current.value,
        password2: password2v.current.value,
      
        
        })
        .then((response) => {
          setPost(response.data);
        });
    }
    //123456aAs!
    //123456!aA
    console.log("postpost",post)
    // if (!post) return "No post!"

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
           <form onSubmit={handleSubmit}>
           {/* <form> */}
              <h1 className="text-4xl mb-2">Update Password</h1>
              <hr className="mb-6"/>
              <div>
                <label htmlFor="old_password">Old Password</label>
                <input
                type="text"
                id="old_password"
                ref = {oldpassword}
                // onChange={(e) => {setPost({...post, first_name:e.target.value})}}
                // onChange={(e) => {setNote({...note, body:e.target.value})}} value={note?.body}
                // onChange={e => setNote('b')}
                placeholder="Fill in your old password"
                className="block mb-5 w-full border-b-2 border-gray-800 outline-none p-2"
              />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input
                type="text"
                id="password"
                ref = {passwordv}
                // onChange={(e) => {setPost({...post, first_name:e.target.value})}}
                // onChange={(e) => {setNote({...note, body:e.target.value})}} value={note?.body}
                // onChange={e => setNote('b')}
                placeholder="Fill in your new password"
                className="block mb-5 w-full border-b-2 border-gray-800 outline-none p-2"
              />
            </div>
            <div>
                <label htmlFor="password2">Password Check</label>
                <input
                type="text"
                id="password2"
                ref = {password2v}
                placeholder="Fill in your password again"
                className="block mb-5 w-full border-b-2 border-gray-800 outline-none p-2"
              />
            </div>
            {/* <div>
                <label htmlFor="avatar">Avatar</label>
                <input
                type="file"
                id="avatar"
                ref = {avatarv}
                placeholder="Select your avatar(optional)"
                className="block mb-5 w-full border-b-2 border-gray-800 outline-none p-2"
              />
            </div>
            <div>
                <label htmlFor="phone_number">Phone Number</label>
                <input
                type="text"
                id="phone_number"
                ref = {phonenumber}
                placeholder="Fill in your phone number(optional)"
                className="block mb-5 w-full border-b-2 border-gray-800 outline-none p-2"
              />
            </div> */}
            {/* <input type="submit" /> */}
            {/* <button onSubmit={updatePost}>Update Post</button> */}
            
            {/* <button className="mt-5 border-2 px-2 py-1 rounded-md border-gray-700 hover:bg-gray-400" type="submit" id="update" onClick={updatePost}>Update</button> */}
          </form>
          <button onClick={updatePost}>Update Password</button>
        </section>
    );
  }
    // console.log("note",note)
    // let getNote = async () => {

    //   await api.get(
    //     "http://127.0.0.1:8000/accounts/view_profile/"
    //   ).then(
    //       response => {
    //           if (response.data.cancelled) {
    //               setSubScriptionStatus(false)
    //           } else {
    //               setSubScriptionStatus(true)
    //           }
    //           // console.log(response)
    //           // console.log(response.data)
    //       }
    //   ).catch(
    //       error => {
    //           console.log(error.response)
    //       }
    //   )
    //     let response = await api.get("http://127.0.0.1:8000/accounts/view_profile/")
    //     let data = await response.json();
    //     // console.log("data",data)
    //     console.log("note",response.data)
    //     setNote(data);
        
    // }

    // let updateNote = async () => {
    //   let response = await api.put("http://127.0.0.1:8000/accounts/update_profile/",
    //   JSON.stringify({note}),
    //   {headers: { "Content-Type": "application/json"}}
    //   ).then(
    //     response => {
    //       console.log("update successfully")
    //     }
    //   )
  
    // }

    // let handleSubmit = async () => {
    //   await updateNote();
    //   console.log("click")
    // };
    
    // return (
    //   <section>
    //        <form onSubmit={handleSubmit}>
    //           <h1 className="text-4xl mb-2">Update Profile</h1>
    //           <hr className="mb-6"/>
    //           <div>
    //             <label htmlFor="first_name">First Name</label>
    //             <input
    //             type="text"
    //             id="first_name"
    //             onChange={(e) => {setNote({...note, body:e.target.value})}} value={note?.body}
    //             // onChange={(e) => {setNote({...note, body:e.target.value})}} value={note?.body}
    //             // onChange={e => setNote('b')}
    //             placeholder="Fill in your first name (optional)"
    //             className="block mb-5 w-full border-b-2 border-gray-800 outline-none p-2"
    //           />
    //         </div>
    //         <button className="mt-5 border-2 px-2 py-1 rounded-md border-gray-700 hover:bg-gray-400" type="submit" id="update">Update</button>
    //       </form>
    //     </section>
    //   );
  
        // <div className='note'>
        //     <div className='note-header'>
        //         <h3>
        //             <Link to="/">
        //                 <button onClick={handleSubmit}> Ccc</button>
                        
        //             </Link>
        //             <div>React Try</div>
        //         </h3>
        //     </div>
            
        //     <textarea onChange={(e) => {setNote({...note, body:e.target.value})}} value={note?.body}></textarea>
        // </div>
    // )
// }
export default UpdatePasswordPage