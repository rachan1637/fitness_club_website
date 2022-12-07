import { useState, useEffect, useContext, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthContext from "../context/AuthContext";
import useAxios from "../utils/useAxios";
// import { ReactComponent as ArrowLeft } from '../assets/arrow-left.svg'
const UpdateProfilePage = ({match}) => {
    // let noteId = match.params.id
    const navigate = useNavigate()
    const api = useAxios();
    const [post, setPost] = useState({})
    // const firstname = useRef("");
    // const lastname = useRef("");
    // const emailv = useRef("");
    // const avatarv = useRef("");
    // const phonenumber = useRef("");
    const [isLoading, setIsLoading] = useState(true)
    const [errors, setErrors] = useState({})
    const [file, setFile] = useState(null)

    const fetchData = async () => {
      api.get("http://127.0.0.1:8000/accounts/view_profile/"
        ).then((response) => {
          setPost(response.data);
        });
    }
    
    useEffect(() => {
        setIsLoading(true);
        fetchData()
        setIsLoading(false)
    }, []);

    const updatePost = async (form_data) => {
      console.log(form_data);

      await api.put( "http://127.0.0.1:8000/accounts/update_profile/", 
        form_data, 
        // {headers: {"Content-Type": "application/json"}}
        )
        .then((response) => {
          // setPost(response.data);
          // navigate("/user-home/")
          console.log("scucess")
          navigate("/user-home/")
        }).catch(error => {
          console.log(error.response)
          // setErrors(error.response.data)
        })
        
    }
    // console.log("postpost",post)
    // if (!post) return "No post!"


    // handleChange = event => {
    //   this.setPost({ first_name:e.target.value});
    // }

    const onFileChange = event => {
      // Update the state
      setFile(event.target.files[0]);
     
    };
     
    
    const handleSubmit = async e => {
        // event.preventDefault();
        // updatePost();
        // const first_name = e.target.value;
          console.log("click")
          e.preventDefault();
          const first_name = e.target.first_name.value
          const last_name = e.target.last_name.value
          const email = e.target.email.value
          const phone_number = e.target.phone_number.value

          const form = new FormData()
          form.append("first_name", first_name)
          form.append("last_name", last_name)
          form.append("email", email)
          if (file !== null) {
            form.append("avatar", file);
          }
          form.append("phone_number", phone_number)

          await updatePost(form)
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
           {/* <form> */}
              <h1 className="text-4xl mb-2">Update Profile</h1>
              <hr className="mb-6 w-96 mt-3"/>
              <div>
                <label htmlFor="first_name">First Name</label>
                <input
                type="text"
                id="first_name"
                // ref = {firstname}
                defaultValue = {post.first_name}
                // value = {post, first_name:e.target.value}
                // onChange={(e) => {setPost({...post, first_name:e.target.value})}}
                // onChange={(e) => {setNote({...note, body:e.target.value})}} value={note?.body}
                // onChange={e => setNote('b')}
                placeholder="Fill in your first name (optional)"
                className="block mb-5 w-80 border-b-2 border-gray-800 outline-none p-2"
              />
            </div>
            <div>
                <label htmlFor="last_name">Last Name</label>
                <input
                type="text"
                id="last_name"
                // ref = {lastname}
                defaultValue = {post.last_name}
                // value = {{...post, last_name:lastname}}
                // onChange={(e) => {setPost({...post, first_name:e.target.value})}}
                // onChange={(e) => {setNote({...note, body:e.target.value})}} value={note?.body}
                // onChange={e => setNote('b')}
                placeholder="Fill in your last name (optional)"
                className="block mb-5 w-80 border-b-2 border-gray-800 outline-none p-2"
              />
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input
                type="text"
                id="email"
                // ref = {emailv}
                defaultValue = {post.email}
                placeholder="Fill in your email (optional)"
                className="block mb-5 w-80 border-b-2 border-gray-800 outline-none p-2"
              />
            </div>
            <div>
                <label htmlFor="avatar">Avatar</label>
                <input
                type="file"
                id="avatar"
                // ref = {avatarv}
                // defaultValue = {post.avatar}
                // defaultValue={post.avatar}
                onChange={onFileChange}
                placeholder="Select your avatar (optional)"
                className="block mb-5 w-80 border-b-2 border-gray-800 outline-none p-2"
              />
              {/* {avatarv !== "null" } */}
            </div>
            <div>
                <label htmlFor="phone_number">Phone Number</label>
                <input
                type="text"
                id="phone_number"
                // ref = {phonenumber}
                defaultValue = {post.phone_number}
                placeholder="Fill in your phone number (optional)"
                className="block mb-5 w-80 border-b-2 border-gray-800 outline-none p-2"
              />
            </div>
            {/* <input type="submit" /> */}
            {/* <button onSubmit={updatePost}>Update Post</button> */}
            
            {/* <button className="mt-5 border-2 px-2 py-1 rounded-md border-gray-700 hover:bg-gray-400" type="submit" id="update" onClick={updatePost}>Update</button> */}
            <button className="border-2 px-2 py-1 hover:bg-gray-100 border-black rounded-md mt-2">Update Profile</button>
          </form>
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
export default UpdateProfilePage