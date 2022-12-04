import React, { useContext, useEffect, useState } from "react"
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import useAxios from "../utils/useAxios";

function PaymentBlock(props){
 return(
  <>
   <div className="text-center my-5">
        <p> Amount: {props.payment.amount} </p>
        <p> Plan Month Length: {props.payment.plan_month_length} </p >
        <p> Paid card Number: {props.payment.paid_card_number} </p >
        <p> Paid at: {props.payment.paid_at} </p >
        <p> Paid: {props.payment.paid}</p >
    </div>
  </>
 )
}


function PaymentHistoryPage(){
 let { user } = useContext(AuthContext);
    const api = useAxios();
    const [payments, setPayments] = useState([])

    useEffect(() => {
     const fetchData = async() =>{

        await api.get(
        "http://localhost:8000/subscriptions/payment_history/"
        ).then(
        response => {
            // console.log(response.data)
            if (response.data.count != 0) {
                setPayments(response.data.results)
            }
        }
        ).catch(
        error => {
            console.log(error.responses)
        }
        )
     }
     fetchData();
    }, [])

    if (payments.length === 0) {
        return (
        <> 
            <p className="text-2xl text-center"> Payment History </p> 
            <p className="text-center my-5"> You never have a payment before. </p>
        </>)
    }

    return (
     <>
        <p className="text-2xl text-center"> Payment History </p>
        <PaymentBlock payment={payments[0]}/>
      {/* {
       <PaymentHisPageBlock amount={payment.amount} plan_month_length={payment.plan_month_length} paid_card_number={payment.paid_card_number} paid_at={payment.paid_at} paid = {payment.paid}/>
      } */}
     </>
    )

}
export default PaymentHistoryPage;