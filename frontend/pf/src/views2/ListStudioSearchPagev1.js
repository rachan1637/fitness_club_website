import React, { useContext, useEffect, useState, useRef } from "react";
import { useGeolocated } from "react-geolocated";
import AuthContext from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import useAxios from "../utils/useAxios";
// import { useGeolocation } from "react-use";
// import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
// import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { requirePropFactory } from "@mui/material";

const theme = createTheme();

const STUDIO_BASE_URL = ".../backend/PB/media/studios/"

function StudioCards(props) {
  const studios = props.studios
  // console.log(studios[2].studio_images)
return (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {/* <AppBar position="relative">
      <Toolbar>
        <CameraIcon sx={{ mr: 2 }} />
        <Typography variant="h6" color="inherit" noWrap>
          Album layout
        </Typography>
      </Toolbar>
    </AppBar> */}
    <main>
      {/* Hero unit */}
      {/* <Box
        sx={{
          bgcolor: 'background.paper',
          // pt: 2,
          pb: 2,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Choose a Studio
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            You can view all courses provided at the studio, and enroll either one class or all classes of that course.
          </Typography> */}
          {/* <Stack
            sx={{ pt: 4 }}
            direction="row"
            spacing={2}
            justifyContent="center"
          >
            <Button variant="contained">Main call to action</Button>
            <Button variant="outlined">Secondary action</Button>
          </Stack> */}
        {/* </Container>
      </Box> */}
      <Container sx={{ py: 2 }} maxWidth="lg">
        {/* End hero unit */}
        <Grid container spacing={3} alignItems="center">
          {studios.map((studio) => {
            // console.log(studio.studio_images[0].images)
            console.log(studio.distance)
            return (
            <>
            <Grid item key={studio.name} xs={12} sm={6} md={4} >
              <Card
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <CardMedia
                  component="img"
                  sx={{
                    // 16:9
                    pt: '0%',
                  }}
                  image={studio.studio_images[0].images}
                  alt="random"
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {studio.name}
                  </Typography>
                  <Typography>
                    Address: {studio.address}
                  </Typography>
                  <Typography>
                      Phone Number: {studio.phone_number}
                  </Typography>
                  <Typography sx={{pt: 3}}>
                      Distance from You: {studio.distance.toFixed(2)} km
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="large" href={`http://localhost:3000/studio-info/${studio.id}/`}>View</Button>
                </CardActions>
              </Card>
            </Grid>
            </>
            )
                })}
        </Grid>
      </Container>
    </main>
    {/* End footer */}
  </ThemeProvider>
);
}


// function StudioIntroBlock(props) {
//   // const images = props.studio_images.map((image) => {
//   //     return < img src={image} alt={image} />
//   // });
//   // console.log('propeee',props.studio.studio_images[0].images)
//   const link = `http://localhost:3000/studio-info/${props.studio.id}/`

//   return (
//     <>
//       <a href= "hover:bg-gray-100 px-4 py-4 rounded-2xl relative group">
//         <p> Studio Name: {props.studio.name} </p >
//         <p> Studio Address: {props.studio.address} </p >
//         <p> Phone number: {props.studio.phone_number} </p >
//         <p> Distance from you: {props.studio.distance} </p >
//         <div className>
//             {props.studio.studio_images.map((image) => (
//             < img className="max-w-sm max-h-56 mx-auto" src={`${image?.images}`} />
//             ))}
//         </div>
//         <p className="text-2xl absolute inset-0 items-center justify-center group-hover:opacity-100 opacity-0 flex backdrop-blur-sm transition-all"> 
//             <span className="bg-gray-600 px-5 py-5 text-white rounded-full"> Go to Studio </span> 
//         </p >
//       </a >
//     </>
//   );
// }

export const ListStudioSearch = ({searchfield}) => {
  const api = useAxios();
  // result
  const [studios, setStudios] = useState([]);
//   const [position, setPosition] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

//   const getLocation = async () => {
//     const location = await new Promise((resolve, reject) => {
//       navigator.geolocation.getCurrentPosition(resolve, reject, {
//         maximumAge: 60000,
//         timeout: 100000,
//       });
//     });

//     const position =
//       location.coords.latitude + ", " + location.coords.longitude;
//     setPosition(position);

//     let hasLocation = false;

//     await api
//       .post(
//         "http://localhost:8000/studios/create_location/",
//         JSON.stringify({
//           location: position,
//         }),
//         { headers: { "Content-Type": "application/json" } }
//       )
//       .then((response) => {
//         console.log("Create location successfully");
//         // console.log(response)
//         // console.log(response.data)
//       })
//       .catch((error) => {
//         console.log(error.response);
//         hasLocation = true;
//       });

//     if (hasLocation) {
//       // Update location if the user already has one
//       await api
//         .put(
//           "http://localhost:8000/studios/update_location/",
//           JSON.stringify({
//             location: position,
//           }),
//           { headers: { "Content-Type": "application/json" } }
//         )
//         .then((response) => {
//           console.log("Update location successfully");
//         })
//         .catch((error) => {
//           console.log(error.response);
//         });
//     }
//   };
  //const searchfield = useRef(null);
  
  const getStudiosSearch = async (page, searchfield) => {
    await api
      .get(`http://localhost:8000/studios/list_studios/?page=${page}&search=${searchfield}`)
      .then((response) => {
        setStudios(response.data.results);
        setPage(page);
        // console.log(response.data.next)
        // console.log('studios', response.data)
      })
      .catch((error) => {
        console.log(error.responses);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
    //   await getLocation();
      await getStudiosSearch(page);

      setIsLoading(false);
    };
    fetchData();
  }, []);

  // console.log(studios.results.length)

//   if (isLoading) {
//     return <p className="text-center"> Wait for location information... </p >;
//   }
//   function updatePost(){
//     <>
//     <StudioCards studios={studios}/>


//       <div className="flex gap-3 my-5">
//         <button className="border-2 border-black px-2 py-1 ml-auto rounded-lg" onClick={() => getStudiosSearch(page - 1)}>
//           Previous
//         </button>
//         <button className="border-2 border-black px-2 py-1 mr-auto rounded-lg"  onClick={() => getStudiosSearch(page + 1)}> Next </button>
//       </div>
//       {/* <StudioPageBlock count={studios.count} next={studios.next} previous={studios.previous} results={studios.results} /> */}
//       {/* {
//                 studios.map((studio) => {
//                     return <StudioIntroBlock name={studio.name} address={studio.address} phone_number={studio.phone_number} distance={studio.distance} id={studio.id}/>
//                 }
//                 )
//             } */}
//       {/* {render_studios()} */}
//     </>
//   }
  return (
    <>
      {/* <p className="text-center"> View more details by clicking each block! </p >
      <hr className="my-5"/>
      <div className="flex gap-10 text-center justify-center">
        {studios.map((studio) => (
          <StudioIntroBlock studio={studio} />
        ))}
      </div> */}
      {/* <div>
                <label htmlFor="searchfield">Search</label>
                <input
                type="text"
                id="searchfield"
                ref = {searchfield}
                // defaultValue = {post.last_name}
                // value = {{...post, last_name:lastname}}
                // onChange={(e) => {setPost({...post, first_name:e.target.value})}}
                // onChange={(e) => {setNote({...note, body:e.target.value})}} value={note?.body}
                // onChange={e => setNote('b')}
                placeholder="Fill in your search "
                className="block mb-5 w-full border-b-2 border-gray-800 outline-none p-2"
              />
        </div> */}

        {/* <button onClick={updatePost}>Search</button> */}
        <StudioCards studios={studios}/>


<div className="flex gap-3 my-5">
  <button className="border-2 border-black px-2 py-1 ml-auto rounded-lg" onClick={() => getStudiosSearch(page - 1)}>
    Previous
  </button>
  <button className="border-2 border-black px-2 py-1 mr-auto rounded-lg"  onClick={() => getStudiosSearch(page + 1)}> Next </button>
</div>
{/* <StudioPageBlock count={studios.count} next={studios.next} previous={studios.previous} results={studios.results} /> */}
{/* {
          studios.map((studio) => {
              return <StudioIntroBlock name={studio.name} address={studio.address} phone_number={studio.phone_number} distance={studio.distance} id={studio.id}/>
          }
          )
      } */}
{/* {render_studios()} */}
    </>
  );
};

// export default ListStudioSearch;