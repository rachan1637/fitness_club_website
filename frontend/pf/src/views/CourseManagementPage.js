import React, { useEffect, useState, useContext } from "react";
import useAxios from "../utils/useAxios";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function CourseManagementPage() {
  const [userProfile, setUserProfile] = useState({
    "first_name": "",
    "last_name": "",
    "email": "",
    "avatar": "",
    "phone_number": ""
    })

  const [subscription_status, setSubScriptionStatus] = useState(false)
  const [enrolled_classes, setEnrolledClasses] = useState([])
  const api = useAxios();

  let { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
        // console.log("fetch again")
        // Check whether there's a subscription and set status to true if there is one
        await api.get(
            "http://localhost:8000/subscriptions/view_subscription/"
        ).then(
            response => {
                if (response.data.cancelled) {
                    setSubScriptionStatus(false)
                } else {
                    setSubScriptionStatus(true)
                }
                // console.log(response)
                // console.log(response.data)
            }
        ).catch(
            error => {
                console.log(error.response)
            }
        )

        await api.get(
            "http://localhost:8000/studios/list_enrolled_classdate/"
        ).then(
            response => {
                // console.log(response.data)
                setEnrolledClasses(response.data)
            }
        ).catch(
            error => {
                console.log(error.response)
            }
        )
    };

    // fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (user) {
    console.log(subscription_status)
    return (
      <div>
        <p> Your enrolled Courses are listed below. </p>
        <hr/>
        { !subscription_status &&
        <>
            <p className="mt-10 mb-5"> You still haven't subscribe a plan. </p> 
            <Link to="subscribe"></Link>
        </>
        }
        { subscription_status && 
        <>
            <p className="mt-10 mb-5"> Do you want to enroll in other courses? Take a look at the provided courses in each studio!</p>
            <Link to="/studios-list" className="px-2 py-2 border-gray-800 border-2 rounded-md hover:shadow-lg hover:bg-gray-400">Studios Overview</Link>
        </>
        }
        {/* <h1>Manage Your Course</h1> */}
        {/* <img src= {userProfile.avatar}/> */}
      </div>
    );
  } else {
    return <div>Not allowed</div>
  }
}

export default CourseManagementPage;