import CardMembershipIcon from '@mui/icons-material/CardMembership';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import React, {useState, useEffect} from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PasswordIcon from '@mui/icons-material/Password';
import {useNavigate} from "react-router-dom"
import { useCallback } from 'react';
import { Box } from '@mui/material';
import useAxios from '../utils/useAxios';

// const subscriptionProfile = {
//     plan: {
//         id: 1,
//         month_length: 12,
//         price: 144.99
//     },
//     valid_date: "2023-02-01",
//     card_number: "4111111111111111",
//     cancelled: true
// }

// const neverSubscribe = false;
// const reactivate = false;

export default function SubscriptionProfileCard(props) {
    const navigate = useNavigate()
    const api = useAxios();

    const [neverSubscribe, setNeverSubcribe] = useState(false);
    const [subscriptionProfile, setSubscriptionProfile] = useState({})

    const [isLoading, setIsLoading] = useState(true)

    const cancel_subscription = async () => {
        await api.put(
            `http://localhost:8000/subscriptions/cancel_plan/`,
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

    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true)
        await getSubscriptionProfile();
        setIsLoading(false)
      }
      fetchData()
    }, [])

    if (isLoading) {
      return (<p> Still Loading... </p>)
    }

  return (
    <Card sx={{ maxHeight: 320, maxWidth: 550, border:1, borderRadius:"10px" }}>
      <CardHeader
        // avatar={
        //   <Avatar src={userProfile.avatar} sx={{width: 60, height:60}}/>
        // }
        titleTypographyProps={{variant:'h5'}}
        title="Subscription Profile"
        subheader="Plan, Valid date, Card number"
      />
      {neverSubscribe && 
        <>
            <CardContent>
            <Typography variant="body" sx={{ml: 1, mb:1}}>
                You never subscribe a plan before!
            </Typography>
            </CardContent>
            <CardActions disableSpacing>
            <IconButton aria-label="add to favorites" 
            onClick={(e) => navigate("/plan-selection/", {state:{ neverSubscribe: neverSubscribe, reactivate: false}})}>
            <ArrowForwardIcon />
            <Typography variant="body1" color="text.secondary" sx={{ml: 1}}>
                Subscirbe a plan!
            </Typography>
            </IconButton>
            </CardActions>
        </>
      }
      {!neverSubscribe && !subscriptionProfile.cancelled &&
        <>
            <CardContent>
                <Typography variant="body2" sx={{ml: 1}}>
                    Valid Until: {subscriptionProfile.valid_date}
                </Typography>
                <Typography variant="body2" sx={{ml: 1, mb:1}}>
                    Card Number: {subscriptionProfile.card_number}
                </Typography>
                <Card sx={{mb: 2, mt: 2, ml:3, mr:20, py:1, border:1, borderRadius:"10px", borderColor:"gray"}}>
                    <Typography variant="body2" sx={{ml: 3}}>
                        Plan Code: {subscriptionProfile.plan.id}
                    </Typography>
                    <Typography variant="body2" sx={{ml: 3}}>
                        Plan Month Length: {subscriptionProfile.plan.month_length}
                    </Typography>
                    <Typography variant="body2" sx={{ml: 3}}>
                        Price: {subscriptionProfile.plan.price}
                    </Typography>
                </Card>

                <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites" 
                    onClick={(e) => navigate("/plan-selection/", {state:{ neverSubscribe: neverSubscribe, reactivate: false}})}>
                    <ArrowForwardIcon />
                    <Typography variant="body2" color="text.secondary" sx={{ml: 1}}>
                        Update Plan
                    </Typography>
                    </IconButton>
                    <IconButton aria-label="add to favorites" 
                    onClick={(e) => navigate("/fill-card-info/", {state:{ neverSubscribe: neverSubscribe, reactivate: false}})}>
                    <CardMembershipIcon />
                    <Typography variant="body2" color="text.secondary" sx={{ml: 1}}>
                        Update Payment Method
                    </Typography>
                    </IconButton>
                    <IconButton aria-label="add to favorites" 
                    onClick={cancel_subscription}>
                    <CancelIcon />
                    <Typography variant="body2" color="text.secondary" sx={{ml: 1}}>
                        Cancel Plan
                    </Typography>
                    </IconButton>
                </CardActions>
            </CardContent>
        </>
      }
      {!neverSubscribe && subscriptionProfile.cancelled &&
        <>
            <CardContent>
                <Typography variant="body" sx={{ml: 1, mb:1}}>
                    Valid Until: {subscriptionProfile.valid_date}
                </Typography>
                <br/>
                <Typography variant="body" sx={{ml: 1, mb:3}}>
                    Card Number: {subscriptionProfile.card_number}
                </Typography>
                <br/>
                <Card sx={{mb: 2, mt: 2, ml:3, mr:20, pr:3, py:1, border:1, borderRadius:"10px", borderColor:"gray"}}>
                    <Typography variant="body2" sx={{ml: 3}}>
                        No susbcription now. <br/>Do you want to reactive a subscription? 
                    </Typography>
                </Card>

                <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites" 
                    onClick={(e) => navigate("/plan-selection/", {state:{ neverSubscribe: neverSubscribe, reactivate: true}})}>
                    <ArrowForwardIcon />
                    <Typography variant="body2" color="text.secondary" sx={{ml: 1}}>
                        Reactivate Plan
                    </Typography>
                    </IconButton>
                </CardActions>
            </CardContent>
        </>
      }
      {/* <CardContent>
        <Typography variant="body2" sx={{ml: 1, mb:1}}>
            Email: {subscriptionProfile.plan !== "" ? userProfile.plan : "(You don't have a first name, why not add it?)"}
          </Typography>
          <Typography variant="body2" sx={{ml: 1, mb:1}}>
            First Name: {subscriptionProfile.valid_date !== "" ? subscriptionProfile.first_name : "(You don't have a first name, why not add it?)"}
          </Typography>
          <Typography variant="body2" sx={{ml: 1, mb:1}}>
            Last Name: {subscriptionProfile.card_number !== "" ? subscriptionProfile.last_name : "(Add your name!!!)"}
          </Typography>
          <Typography variant="body2" sx={{ml: 1, mb:1}}>
            Phone Number: {subscriptionProfile.cancelled !== "" ? userProfile.phone_number : "(No phone number...)"}
          </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites" onClick={navigateUpdateProfile}>
          <AccountCircleIcon />
          <Typography variant="body1" color="text.secondary" sx={{ml: 1}}>
            Update Profile
          </Typography>
        </IconButton>
        <IconButton aria-label="share" onClick={navigateChangePassword}>
          <PasswordIcon />
          <Typography variant="body1" color="text.secondary" sx={{ml: 1}}>
            Update Password
          </Typography>
        </IconButton>
      </CardActions> */}
    </Card>
  );
}