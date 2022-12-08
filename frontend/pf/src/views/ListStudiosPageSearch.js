import React, { useContext, useEffect, useState,useRef } from "react";
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
import { display } from "@mui/system";
// import SimpleCollapsible from "../components/SimpleCollapsible"

const theme = createTheme();

const STUDIO_BASE_URL = ".../backend/PB/media/studios/"

function StudioCard(props) {
    const [imageCount, setImageCount] = useState(0)
    const studio = props.studio
    // console.log(studio.studio_images.length)
  
    return (
        <Card
        sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <CardMedia
          component="img"
          sx={{
            // 16:9
            pt: '0%',
          }}
          image={studio.studio_images[imageCount]?.images}
          alt="random"
          onClick={() => {
            // console.log("hi", studio.images[imageCount])
            setImageCount((imageCount+1) % studio.studio_images.length)
          }}
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
    )
  }

function StudioCards(props) {
  const studios = props.studios
  // console.log(studios[2].studio_images)
//   console.log(studios)
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
      <Box
        sx={{
          bgcolor: 'background.paper',
          // pt: 2,
          pb: 2,
        }}
      >
        <Container maxWidth="lg">
          {/* <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Search the Studio
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            You can find a studio based on your requirements.
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
        </Container>
      </Box>
      <Container sx={{ py: 2 }} maxWidth="lg">
        {/* End hero unit */}
        <Grid container spacing={3} alignItems="center">
          {studios.map((studio) => {
            // console.log(studio.studio_images[0].images)
            console.log(studio.distance)
            return (
            <>
            <Grid item key={studio.name} xs={12} sm={6} md={4} >
              <StudioCard studio={studio}/>
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

function ListStudiosPageSearch() {
  const api = useAxios();
  // result
  const [studios, setStudios] = useState([]);
//   const [filterStudios, setFilterStudios] = useState([]);
  const [position, setPosition] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [inputVal, setVal] = useState('');
  const inputValv = useRef('')
  const [searchResult, setSearchResult] = useState()
  const [filterName, setfilterName] = useState('');
  const [filterAmeneties, setfilterAmeneties] = useState('');
  const [allStudios, setAllStudios] = useState([]);
  const [allCourse, setAllCourse] = useState([]);
  const [allAmenity, setAllAmenity] = useState([]);
  // const [filterClass, setfilterClass] = useState(1);
  // const [filterCoach, setfilterCoach]= useState(1);

  const [doSearch, setDoSearch] = useState(false)
  const [doFilter, setDoFilter] = useState(false)
  const [searchPage, setSearchPage] = useState(1)
  const [filterPage, setFilterPage] = useState(1)
  const [searchContent, setSerachContent] = useState("")
  const [size, setSize] = useState(0)

  const getLocation = async () => {
    const location = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        maximumAge: 60000,
        timeout: 100000,
      });
    });

    const position =
      location.coords.latitude + ", " + location.coords.longitude;
    setPosition(position);

    let hasLocation = false;

    await api
      .post(
        "http://localhost:8000/studios/create_location/",
        JSON.stringify({
          location: position,
        }),
        { headers: { "Content-Type": "application/json" } }
      )
      .then((response) => {
        console.log("Create location successfully");
        // console.log(response)
        // console.log(response.data)
      })
      .catch((error) => {
        console.log(error.response);
        hasLocation = true;
      });

    if (hasLocation) {
      // Update location if the user already has one
      await api
        .put(
          "http://localhost:8000/studios/update_location/",
          JSON.stringify({
            location: position,
          }),
          { headers: { "Content-Type": "application/json" } }
        )
        .then((response) => {
          console.log("Update location successfully");
        })
        .catch((error) => {
          console.log(error.response);
        });
    }
  };


  const getStudios = async (page) => {

    await api
      .get(`http://localhost:8000/studios/list_studios/?page=${page}&size=3`)
      .then((response) => {
        setStudios(response.data.results);
        setPage(page);
        // setSearchResult(response.data.results);
        // setVal(inputVal)
        // console.log(response.data.next)
        // console.log('studios', response.data)
      })
      .catch((error) => {
        console.log(error.responses);
      });
  };

  const selectedName = useRef("")
  const selectedAmenities = useRef("")
  const selectedClasses = useRef("")
  const selectedCoaches = useRef("")
    
  const getAllStudio = async () => {
    await api
      .get(`http://localhost:8000/studios/list_all_studios/`)
      .then((response) => {
        setAllStudios(response.data);
      })
      .catch((error) => {
        console.log(error.responses);
      });
  };

  const getAllCourse = async () => {
    await api
      .get(`http://localhost:8000/studios/list_all_course/`)
      .then((response) => {
        setAllCourse(response.data);
      })
      .catch((error) => {
        console.log(error.responses);
      });
  };

  const getAllAmenity = async () => {
    await api
      .get(`http://localhost:8000/studios/list_all_amenity/`)
      .then((response) => {
        setAllAmenity(response.data);
      })
      .catch((error) => {
        console.log(error.responses);
      });
  };

  const getStudiosSearch = async (page, inputVal) => {
    await api
      .get(`http://localhost:8000/studios/list_studios_search/?page=${page}&size=3&search=${inputVal}`)
      .then((response) => {
        console.log(response.data)
        setStudios(response.data.results);
        setSearchPage(page);
        setSize(response.data.size)
      })
      .catch((error) => {
        console.log(error.responses);
      });
  };

  const getStudiosFilter = async (page, selectedName, selectedAmenities, selectedClasses, selectedCoaches) => {
    await api
      .get(`http://localhost:8000/studios/list_studios_search/?page=${page}&size=3&name=${selectedName}&amenities__Amname=${selectedAmenities}&classes__classNames=${selectedClasses}&coaches__coachNames=${selectedCoaches}`)
      .then((response) => {
        console.log(response)
        setStudios(response.data.results);
        setPage(page);
      })
      .catch((error) => {
        console.log(error.responses);
      });
  };


  const searchStudios = (e) => {
    e.preventDefault()

    setSearchPage(1)
    setFilterPage(1)
    setPage(1)
    setDoSearch(true)
    setDoFilter(false)

    const content = e.target.search_content.value
    setSerachContent(content)
    getStudiosSearch(1, content)
  }

  const filterStudios = (e) => {
    e.preventDefault()

    setFilterPage(1)
    setSearchPage(1)
    setPage(1)
    setDoSearch(false)
    setDoFilter(true)

    const name_input = e.target.name_input.value
    const amenity_input = e.target.amenity_input.value
    const class_input = e.target.class_input.value
    const coach_input = e.target.coach_input.value

    getStudiosFilter(1, name_input, amenity_input, class_input, coach_input)
  }

    let goPrev = null
    let goNext = null
    if (doSearch) {
        goPrev = () => {getStudiosSearch(searchPage-1, searchContent)}
        goNext = () => {getStudiosSearch(searchPage+1, searchContent)}
    } else if (doFilter) {
        goPrev = () => {getStudiosFilter(searchPage-1, selectedName, selectedAmenities, selectedClasses, selectedCoaches)}
        goNext = () => {getStudiosFilter(searchPage+1, selectedName, selectedAmenities, selectedClasses, selectedCoaches)}
    } else {
        goPrev = () => {getStudios(page-1)}
        goNext = () => {getStudios(page+1)}
    }


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await getLocation();
      await getAllStudio();
      await getAllCourse();
      await getAllAmenity();
      await getStudios(page);

      setIsLoading(false);
    };
    fetchData();
  }, []);

  console.log('searchResult',searchResult)
  console.log('inputVal',inputVal)

  console.log('allStudios', allStudios)
  
  console.log('selectedName',selectedName)
  console.log('selectedAmenities',selectedAmenities)

  
  if (isLoading) {
    return <p className="text-center"> Wait for location information... </p >;
  }

let name_list_uqi= [];
  // let studio_list_uqi= [];
  allStudios.map(studio_i => {
    if (name_list_uqi.indexOf(studio_i.name) === -1) {
      name_list_uqi.push(studio_i.name)
      // studio_list_uqi.push(studio_i)
    }
});
// console.log('studio_list_uqi',studio_list_uqi) 


  // let amenities_list_uqi= [];
  //   allStudios.map(studio_i => {
  //     if (amenities_list_uqi.indexOf(studio_i.amenities) === -1 && studio_i.amenities.length>0) {
  //       studio_i.amenities.map(studio_i_am => {
  //       amenities_list_uqi.push(studio_i_am)
  //       })
  //     }
  // });

    // let amenities_list_id_uqi= [];
    let amenities_list_uqi= [];
    allAmenity.map(studio_i => {
        if (amenities_list_uqi.indexOf(studio_i.type) === -1) {
          amenities_list_uqi.push(studio_i.type)
        }
    });

    // let classes_list_uqi= [];
    //   allStudios.map(studio_i => {
    //     if (classes_list_uqi.indexOf(studio_i.classes) === -1 && studio_i.classes.length>0) {
    //       studio_i.classes.map(studio_i_cl => {
    //       classes_list_uqi.push(studio_i_cl)
    //       })
    //     }
    // });
    let classes_list_uqi= [];
    allCourse.map(studio_i => {
        if (classes_list_uqi.indexOf(studio_i.name) === -1) {
          classes_list_uqi.push(studio_i.name)
        }
    });


    let coaches_list_uqi= [];
    allCourse.map(studio_i => {
        if (coaches_list_uqi.indexOf(studio_i.coach) === -1) {
          coaches_list_uqi.push(studio_i.coach)
        }
    });

    console.log('amenities_list_uqi',amenities_list_uqi);


    name_list_uqi = name_list_uqi.sort()
    let nameList =  name_list_uqi.length > 0
      &&  name_list_uqi.map((item, i) => {
      return (
      <option key={i} value={item}>{item}</option>
      )
    });

    amenities_list_uqi = amenities_list_uqi.sort()
    let amenitiesList =  amenities_list_uqi.length > 0
    &&  amenities_list_uqi.map((item, i) => {
    return (
    <option key={i} value={item}>{item}</option>
    )
    });

    classes_list_uqi = classes_list_uqi.sort()
    let classesList =  classes_list_uqi.length > 0
    &&  classes_list_uqi.map((item, i) => {
    return (
    <option key={i} value={item}>{item}</option>
    )
    });


    coaches_list_uqi = coaches_list_uqi.sort()
    let coachesList =  coaches_list_uqi.length > 0
    &&  coaches_list_uqi.map((item, i) => {
    return (
    <option key={i} value={item}>{item}</option>
    )
    });


// amenitiesList = amenitiesList.sort()
  console.log('amenitiesList',amenitiesList) 

  console.log(studios)

  return (
    <>
        <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Choose a Studio
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph sx={{mb:3}}>
          You can view all courses provided at the studio, and enroll either one class or all classes of that course.
          </Typography>
        {/* <SimpleCollapsible> */}
        <div className="flex items-center justify-center mb-6">
            <form onSubmit={searchStudios}>
                <label className="block" htmlFor="search_content"></label>
                <input className="border-2 py-2 border-black px-2 w-64" type="text" id="search_content" placeholder="Search..."/>
                <button className="border-2 border-black px-2 py-1 ml-3 rounded-lg hover:bg-gray-200">Search</button>
            </form>
        </div>
        <form className="flex flex-wrap justify-center gap-5" onSubmit={filterStudios}> 
            <div className="flex flex-col items-center">
            <p className="mb-2"> Filter By Name </p>
            <select className="border-2 border-black px-2 py-1 ml-auto rounded-lg w-48" id="name_input" defaultValue={""}> <option value="">All</option>{nameList} </select>
            </div>
            <div className="flex flex-col items-center"> 
            <p className="mb-2"> Filter By Amenity </p>
            <select className="border-2 border-black px-2 py-1 ml-auto rounded-lg w-48" id="amenity_input" defaultValue={""}> <option value="">All</option>{amenitiesList} </select>
            </div>
            <div className="flex flex-col items-center">
            <p className="mb-2"> Filter By Class </p>
            <select className="border-2 border-black px-2 py-1 ml-auto rounded-lg w-48" id="class_input" defaultValue={""}> <option value="">All</option>{classesList} </select>
            </div>
            <div className="flex flex-col items-center">
            <p className="mb-2"> Filter By Coach </p>
            <select className="border-2 border-black px-2 py-1 ml-auto rounded-lg w-48" id="coach_input" defaultValue={""}> <option value="">All</option>{coachesList} </select>
            </div>
            <div className="mt-7">
            <button className="border-2 border-black px-2 py-1 rounded-lg hover:bg-gray-200">Filter</button> 
            </div>
        </form>
        {/* </SimpleCollapsible> */}
      <StudioCards studios={studios}/>


      <div className="flex gap-3 my-5">
      {/* <select id="name-input" value={selectedName} onChange={(e) => filterByName(page, setselectedName(e.target.value))}> <option value="">All</option>{nameList} </select> */}
      {/* <div> Filter By Name
      <select className="border-2 border-black px-2 py-1 ml-auto rounded-lg" id="name-input" ref = {selectedName}> <option value="">All</option>{nameList} </select>
      </div>
      <div> Filter By Amenity
      <select className="border-2 border-black px-2 py-1 ml-auto rounded-lg" id="name-input" ref = {selectedAmenities}> <option value="">All</option>{amenitiesList} </select>
      </div>
      <div> Filter By Classes
      <select className="border-2 border-black px-2 py-1 ml-auto rounded-lg" id="name-input" ref = {selectedClasses}> <option value="">All</option>{classesList} </select>
      </div>
      <div> Filter By Coaches
      <select className="border-2 border-black px-2 py-1 ml-auto rounded-lg" id="name-input" ref = {selectedCoaches}> <option value="">All</option>{coachesList} </select>
      </div>
      <button className="border-2 border-black px-2 py-1 ml-auto rounded-lg" onClick = {() => getStudiosSearch(1, inputValv.current.value, selectedName.current.value, selectedAmenities.current.value,selectedClasses.current.value,selectedCoaches.current.value)}>Filter</button> */}

        <button className="border-2 border-black px-2 py-1 ml-auto rounded-lg" onClick={goPrev}>
          Previous
        </button>
        <button className="border-2 border-black px-2 py-1 mr-auto rounded-lg"  onClick={goNext}> Next </button>
        <p>{page}</p>
      </div>
    </>
  );
}

export default ListStudiosPageSearch;