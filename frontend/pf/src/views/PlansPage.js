import React, { useEffect, useState, useContext } from "react";
import useAxios from "../utils/useAxios";
import { Link } from "react-router-dom";

function PlanBlock(props) {
    // console.log(props)

    return (
        <>
            <a href="" className="hover:bg-gray-100 px-4 py-4 rounded-2xl relative group">
                <p> Plan Code: {props.plan.id}</p>
                <p> Length of the Plan: {props.plan.month_length}</p>
                <p> Price: {props.plan.price} </p>
            </a>
        </>
    )
}

function PlansPage() {
    const api = useAxios();
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1);
    const [allSubscriptionPlans, setAllSubscriptionPlans] = useState([])

    const getPlans = async (page) => {
        await api.get(
            `http://localhost:8000/subscriptions/all_plans/?page=${page}`,
            {headers: {"Content-Type": "application/json"}}
        ).then(
            response => {
                // console.log(response.data)
                setPage(page);
                setAllSubscriptionPlans(response.data.results)
            }
        ).catch(
            error => {
                console.log(error.response)
            }
        )
    };

    useEffect (() => {
        const fetchData = async () =>  {
            setIsLoading(true);
            await getPlans(page);
            setIsLoading(false);
        }

        fetchData();
    }, [])

    if (isLoading) {
        return (<><p> Still Loading </p></>)
    }

    // console.log(allSubscriptionPlans)

    return (
        <>
            <p className="text-center"> All available subscription plans are listed below </p>
            <hr className="mt-5 mb-3"/>
            {allSubscriptionPlans.length === 0 && 
                <>
                    <p> No available plan is provided now. </p>
                </>
            }
            <div className="flex gap-10 text-center justify-center">
                {allSubscriptionPlans.map((plan) => (
                    <PlanBlock plan={plan} />
                ))}
            </div>
            <div className="flex gap-3 mt-5">
                <button className="border-2 border-black px-2 py-1 ml-auto rounded-lg" onClick={() => getPlans(page - 1)}>
                Previous
                </button>
                <button className="border-2 border-black px-2 py-1 ml-auto rounded-lg"  onClick={() => getPlans(page + 1)}> Next </button>
            </div>
        </>
    )
}

export default PlansPage