import * as React from 'react';
import { styled } from '@mui/material/styles';
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

const userProfile = {
    user: {
        username: "chanyunh2"
    },
    first_name: "",
    last_name: "",
    email: "yhschan1638@gmail.com",
    phone_number: "",
    avatar: "http://localhost:8000/media/avatar/default.png",
}


export default function UserProfileCard(props) {
    const navigate = useNavigate()
    const userProfile = props.userProfile

    const navigateUpdateProfile = () => {
        navigate("/update-profile/")
    }

    const navigateChangePassword = () => {
        navigate("/change-password/")
    }

  return (
    <Card sx={{ maxWidth: 400, border:1, borderRadius:"10px" }}>
      <CardHeader
        avatar={
          <Avatar src={userProfile.avatar} sx={{width: 60, height:60}}/>
        }
        titleTypographyProps={{variant:'h5'}}
        title={userProfile.user.username}
        // subheader="September 14, 2016"
      />
      {/* <CardMedia
        component="img"
        height="194"
        image="/static/images/cards/paella.jpg"
        alt="Paella dish"
      /> */}
      <CardContent>
        <Typography variant="body2" sx={{ml: 1, mb:1}}>
            Email: {userProfile.email !== "" ? userProfile.email : "(You don't have a first name, why not add it?)"}
          </Typography>
          <Typography variant="body2" sx={{ml: 1, mb:1}}>
            First Name: {userProfile.first_name !== "" ? userProfile.first_name : "(You don't have a first name, why not add it?)"}
          </Typography>
          <Typography variant="body2" sx={{ml: 1, mb:1}}>
            Last Name: {userProfile.last_name !== "" ? userProfile.last_name : "(Add your name!!!)"}
          </Typography>
          <Typography variant="body2" sx={{ml: 1, mb:1}}>
            Phone Number: {userProfile.phone_number !== "" ? userProfile.phone_number : "(No phone number...)"}
          </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites" onClick={navigateUpdateProfile}>
          <AccountCircleIcon />
          <Typography variant="body2" color="text.secondary" sx={{ml: 1}}>
            Update Profile
          </Typography>
        </IconButton>
        <IconButton aria-label="share" onClick={navigateChangePassword}>
          <PasswordIcon />
          <Typography variant="body2" color="text.secondary" sx={{ml: 1}}>
            Update Password
          </Typography>
        </IconButton>
      </CardActions>
    </Card>
  );
}