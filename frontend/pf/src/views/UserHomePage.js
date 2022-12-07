import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import useAxios from "../utils/useAxios";
import UserProfileCard from "../templates/UserProfileCard";
import SubscriptionProfileCard from "../templates/SubscriptionProfileCard";


function UserHomePage () {
    const api = useAxios();
    // result
    const [userProfile, setUserProfile] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [neverSubscribe, setNeverSubcribe] = useState(false);
    const [subscriptionProfile, setSubscriptionProfile] = useState({})

    const getSubscriptionProfile = async () => {
      await api.get(
          `http://localhost:8000/subscriptions/view_subscription/`,
          {headers: {"Content-Type": "application/json"}}
      ).then(
          response => {
              // console.log(response.data)
              setSubscriptionProfile(response.data)
          }
      ).catch(
          error => {
              setNeverSubcribe(true)
              console.log(error.response)
          }
      )
  }

    const getUserProfile = async () => {
      await api.get(
        "http://localhost:8000/accounts/view_profile/", 
        { headers: { "Content-Type": "application/json" } }
      ).then((response) => {
        console.log(response.data)
        setUserProfile(response.data)
      }).catch((error) => {
        console.log(error.response)
      })
    }

    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true)
        await getUserProfile();
        await getSubscriptionProfile();
        setIsLoading(false)
      }
      fetchData()
    }, [])

    if (isLoading) {
      return (<p> Still Loading... </p>)
    }


    return (
      <>
        <p className="mb-5"> Hello User, </p>
        <div>
          <UserProfileCard userProfile={userProfile}/>
          <SubscriptionProfileCard subscriptionProfile={subscriptionProfile} neverSubscribe={neverSubscribe}/>
        </div>
        <hr className="mt-10 mb-8"/>
        <div className="flex gap-10 mt-5 flex-wrap">
          {/* <a href="/user-profile/" className="border-gray-400 border-2 px-5 py-5 hover:bg-gray-100"> 
            <p className="text-xl"> Profile </p>
            <p className="text-sm mt-2"> View personal Profile </p>
          </a> */}
          <a href="/course-management/" className="border-gray-400 border-2 px-5 py-5 hover:bg-gray-100"> 
            <p className="text-xl"> Course Management </p>
            <p className="text-sm mt-2"> View, drop enrolled classes </p>
          </a>
          <a href="/studios-list/" className="border-gray-400 border-2 px-5 py-5 hover:bg-gray-100"> 
            <p className="text-xl"> Course Enrolment </p>
            <p className="text-sm mt-2"> Select studios, enroll classes </p>
          </a>
          {/* <a href="/subscription-management/" className="border-gray-400 border-2 px-5 py-5 hover:bg-gray-100"> 
            <p className="text-xl"> Subscription Management </p>
            <p className="text-sm mt-2"> Manage subscription plan </p>
          </a> */}
          <a href="/payment-history/" className="border-gray-400 border-2 px-5 py-5 hover:bg-gray-100"> 
            <p className="text-xl"> Payment History </p>
            <p className="text-sm mt-2"> View past and future payments </p>
          </a>
          <a href="/course-history/" className="border-gray-400 border-2 px-5 py-5 hover:bg-gray-100"> 
            <p className="text-xl"> Class History </p>
            <p className="text-sm mt-2"> View class history </p>
          </a>
        </div>
        
      </>
    )
};

export default UserHomePage;