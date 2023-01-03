import React, { useEffect, useState, useContext } from "react";
import useAxios from "../utils/useAxios";
import { Link, useLocation, useNavigate } from "react-router-dom";

function FillCardInfoPage() {
    const api = useAxios();
    // const [isLoading, setIsLoading] = useState(true)
    const [card_number, setCardNumber] = useState("")
    const [card_expiry, setCardExpiry] = useState("")
    const [card_security_code, setCardSecurityCode] = useState("")
    const [errors, setErrors] = useState({})
    const location = useLocation()
    const { neverSubscribe, plan_code, reactivate } = location.state
    const navigate = useNavigate()

    const subscribe_plan = async () => {
        if (neverSubscribe) {
            await api.post(
                `/api/subscriptions/subscribe/`,
                JSON.stringify(
                    {
                        plan_code: plan_code,
                        card_number: card_number,
                        card_expiry: card_expiry,
                        card_security_code: card_security_code,
                    }
                ),
                {headers: {"Content-Type": "application/json"}}
            ).then(() => {
                navigate("/user-home/");
            }).catch( errors => {
                setErrors(errors.response.data);
            })
        } else {
            if (!reactivate) {
                await api.put(
                    `/api/subscriptions/update_card_info/`,
                    JSON.stringify(
                        {
                            // plan_code: plan_code,
                            card_number: card_number,
                            card_expiry: card_expiry,
                            card_security_code: card_security_code,
                        }
                    ),
                    {headers: {"Content-Type": "application/json"}}
                ).then( () => {
                    navigate("/user-home/");
                }).catch( errors => {
                    setErrors(errors.response.data);
                })
            } else {
                await api.put(
                    `/api/subscriptions/reactivate_plan/`,
                    JSON.stringify(
                        {
                            plan_code: plan_code,
                            card_number: card_number,
                            card_expiry: card_expiry,
                            card_security_code: card_security_code,
                        }
                    ),
                    {headers: {"Content-Type": "application/json"}}
                ).then( () => {
                    navigate("/user-home/");
                }).catch( errors => {
                    setErrors(errors.response.data);
                })
            }
        }
    }

    const handleSubmit = async e => {
        e.preventDefault();
        await subscribe_plan();
    }


    return (
        <section>
      <form onSubmit={handleSubmit}>
        {plan_code && <h1 className="text-4xl mb-2"> Pay for Plan {plan_code}</h1>}
        {!plan_code && <h1 className="text-4xl mb-2"> Update card information </h1>}
        <hr className="mb-6"/>
        <div>
          <label className="block" htmlFor="card_number">Card Number</label>
          <input
            type="text"
            id="card_number"
            onChange={e => setCardNumber(e.target.value)}
            placeholder="Card Number (required)"
            className="block mb-5 w-full border-b-2 border-gray-800 outline-none p-2"
          />
          { errors.card_number && <p className="block text-red-500 rounded-md px-2 py-1 mb-5"> {errors.card_number[0]}</p> }
        </div>
        <div>
          <label htmlFor="card_expiry">Expiry Date</label>
          <input
            type="text"
            id="card_expiry"
            onChange={e => setCardExpiry(e.target.value)}
            placeholder="Card Expiry Date (required)"
            className="block mb-5 w-full border-b-2 border-gray-800 outline-none p-2"
          />
          { errors.card_expiry && <p className="block text-red-400 rounded-md px-2 py-1 mb-5"> {errors.card_expiry[0]}</p> }
        </div>
        <div>
          <label htmlFor="card_security_code"> Security Code </label>
          <input
            type="text"
            id="card_security_code"
            onChange={e => setCardSecurityCode(e.target.value)}
            placeholder="Security Code (required)"
            className="block mb-5 w-full border-b-2 border-gray-800 outline-none p-2"
          />
          { errors.card_security_code && <p className="block text-red-400 rounded-md px-2 py-1 mb-5"> {errors.card_security_code[0]}</p> }
        </div>
        <button className="mt-5 border-2 px-2 py-1 rounded-md border-gray-700 hover:bg-gray-400" type="submit" id="register"> Submit </button>
      </form>
    </section>
    )
}

export default FillCardInfoPage