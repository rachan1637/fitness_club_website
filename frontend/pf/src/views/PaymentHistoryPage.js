import React, { useContext, useEffect, useState } from "react"
import AuthContext from "../context/AuthContext";
import { Link } from "@mui/material";
import useAxios from "../utils/useAxios";
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Card from '@mui/material/Card';
import Button from '../home_template/modules/components/Button';

function Title(props) {
    return (
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        {props.children}
      </Typography>
    );
  }
  
  Title.propTypes = {
    children: PropTypes.node,
  };


function PaymentHistory(props) {
    const rows = props.payments
    const goNext = props.goNext
    const goPrev = props.goPrev
    return (
      <React.Fragment>
        <Card sx={{px: 5, py: 5}}>
        <Title>Payment Hisotry</Title>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Plan Month Length</TableCell>
              <TableCell>Paid Card Number</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell align="right">Already Paid</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow>
                <TableCell>{row.paid_at}</TableCell>
                <TableCell>{row.plan_month_length}</TableCell>
                <TableCell>{row.paid_card_number}</TableCell>
                <TableCell>{`$${row.amount}`}</TableCell>
                <TableCell align="right">{row.paid === true ? "True" : "False"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className='mt-3'></div>
        <Button onClick={goPrev} sx={{ mt: 3, border:1, mr: 2}} size="small">
          Prev
        </Button>
        <Button onClick={goNext} sx={{ mt: 3, border:1}} size="small">
          Next
        </Button>
        </Card>
      </React.Fragment>
    );
  }  
// function PaymentBlock(props){
//     console.log(props.payment)
//  return(
//   <>
//    <div className="my-5 border-2 border-black px-5 py-2">
//         <p> Amount: {props.payment.amount} </p>
//         <p> Plan Month Length: {props.payment.plan_month_length} </p >
//         <p> Paid card Number: {props.payment.paid_card_number} </p >
//         <p> Paid at: {props.payment.paid_at} </p >
//         <p> Paid: {String(props.payment.paid)}</p >
//     </div>
//   </>
//  )
// }


function PaymentHistoryPage(){
 let { user } = useContext(AuthContext);
    const api = useAxios();
    const [payments, setPayments] = useState([])
    const [page, setPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)

    const getPaymentHistory = async (page) => {
        await api.get(
            `http://localhost:8000/subscriptions/payment_history/?page=${page}&size=10`
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

    useEffect(() => {
     const fetchData = async () =>{
        setIsLoading(true)
        getPaymentHistory(page);
        setIsLoading(false)
     }
     fetchData();
    }, [])

    return (
        <PaymentHistory payments={payments} goNext={() => {getPaymentHistory(page + 1)}} goPrev={() => {getPaymentHistory(page - 1)}}/>
    )

    // if (payments.length === 0) {
    //     return (
    //     <> 
    //         <p className="text-2xl text-center"> Payment History </p> 
    //         <p className="text-center my-5"> You never have a payment before. </p>
    //     </>)
    // }

    // return (
    //  <>
    //     <p className="text-2xl text-center"> Payment History </p>
    //     <div className="flex flex-col w-52 mx-auto">
    //         { payments.map(payment => (<PaymentBlock payment={payment}/>)) }
    //     </div>
    //     <div className="flex gap-3 my-5">
    //         <button className="border-2 border-black px-2 py-1 ml-auto rounded-lg" onClick={() => getPaymentHistory(page - 1)}>
    //         Previous
    //         </button>
    //         <button className="border-2 border-black px-2 py-1 mr-auto rounded-lg"  onClick={() => getPaymentHistory(page + 1)}> Next </button>
    //     </div>
    //     {/* <PaymentBlock payment={payments[0]}/> */}
    //   {/* {
    //    <PaymentHisPageBlock amount={payment.amount} plan_month_length={payment.plan_month_length} paid_card_number={payment.paid_card_number} paid_at={payment.paid_at} paid = {payment.paid}/>
    //   } */}
    //  </>
    // )

}
export default PaymentHistoryPage;