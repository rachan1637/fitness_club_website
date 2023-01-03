import React, { useEffect, useState, useContext } from "react";
import useAxios from "../utils/useAxios";
import { Link, useNavigate } from "react-router-dom";

function SubscriptionProfileBlock(props) {
    const navigate = useNavigate();

    const cancel_subscription = async () => {
        await props.api.put(
            `/api/subscriptions/cancel_plan/`,
            JSON.stringify({
                cancelled: true,
            }),
            {headers: {"Content-Type": "application/json"}}
        ).then(() => {
            window.location.reload()
        }).catch( errors => {
            console.log(errors.response)
        })
    }

    return (
        <>
            <div>
                { !props.subscriptionProfile.cancelled &&
                    <div>
                        <p> Plan Code: {props.subscriptionProfile.plan.id}</p>
                        <p> Length: {props.subscriptionProfile.plan.month_length}</p>
                        <p> Price: {props.subscriptionProfile.plan.price} </p>
                    </div>
                }
                { props.subscriptionProfile.cancelled && 
                    <>
                        <p className="mb-5"> No susbcription now. Do you want to reactive a subscription? </p>
                        <Link 
                        to="/plan-selection/" 
                        className="border-2 px-2 py-2 border-black rounded-lg" 
                        state={{ neverSubscribe: false, reactivate: true }}>
                        Reactivate</Link>
                    </>
                }
                <div>
                    <p className="mt-5"> Subscription is valid until: {props.subscriptionProfile.valid_date} </p>
                    <p> Card Number: {props.subscriptionProfile.card_number} </p>
                </div>
                { !props.subscriptionProfile.cancelled &&
                    <>
                        <div className="flex gap-10 justify-center">
                            <Link 
                            to="/fill-card-info/" 
                            className="underline 
                            hover:text-blue-500" 
                            state={{ neverSubscribe: false, reactivate: false }}>Update Credit Card Information</Link>
                            <Link 
                            to="/plan-selection/" 
                            className="underline hover:text-blue-500" 
                            state={{ neverSubscribe: false, reactivate: false }}>Update Subscription Plan</Link>
                            <button onClick={cancel_subscription} className="underline hover:text-blue-500">Cancel Subscription</button>
                        </div>
                    </>
                }
            </div>
        </>
    )
}


function SubscriptionManagementPage() {
    const api = useAxios();
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1);
    const [subscriptionProfile, setSubscriptionProfile] = useState({})
    const [allSubscriptionPlans, setAllSubscriptionPlans] = useState([])
    const [neverSubscribe, setNeverSubcribe] = useState(false)
    const [cancelled, setCancelled] = useState(false)

    const getSubscriptionProfile = async () => {
        await api.get(
            `/api/subscriptions/view_subscription/`,
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

    useEffect (() => {
        const fetchData = async () =>  {
            setIsLoading(true);
            await getSubscriptionProfile();
            setIsLoading(false);
        }

        fetchData();
    }, [])

    if (isLoading) {
        return (<><p> Still Loading </p></>)
    }

    console.log(subscriptionProfile)

    return (
        <>
            <div className="mb-10">
                <p> Subscription Profile </p>
                <hr className="my-5"/>
                {neverSubscribe &&
                    <> 
                        <p> You never subscribe before. </p> 
                        <Link to="/plan-selection/" state={{ neverSubscribe: neverSubscribe, reactivate: false}} className="underline hover:text-blue-500"> Go subscribe a plan! </Link> 
                    </>
                }
                {!neverSubscribe && 
                    <>
                        <SubscriptionProfileBlock api={api} subscriptionProfile={subscriptionProfile}/>
                    </>
                }
            </div>
        </>
    )
}

export default SubscriptionManagementPage