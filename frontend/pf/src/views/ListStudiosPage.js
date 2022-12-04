import React, { useContext, useEffect, useState } from "react";
import { useGeolocated } from "react-geolocated";
import AuthContext from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import useAxios from "../utils/useAxios";
import { useGeolocation } from "react-use";

function StudioIntroBlock(props) {
  // const images = props.studio_images.map((image) => {
  //     return <img src={image} alt={image} />
  // });
  // console.log('propeee',props.studio.studio_images[0].images)
  const link = `http://localhost:3000/studio-info/${props.studio.id}/`

  return (
    <>
      <a href={link} className="hover:bg-gray-100 px-4 py-4 rounded-2xl relative group">
        <p> Studio Name: {props.studio.name} </p>
        <p> Studio Address: {props.studio.address} </p>
        <p> Phone number: {props.studio.phone_number} </p>
        <p> Distance from you: {props.studio.distance} </p>
        <p> Images: </p>
        {props.studio.studio_images.map((image) => (
          <img className="max-w-sm max-h-56 mx-auto" src={`${image?.images}`} />
        ))}
        <p > Specific Information: </p>
        <Link to={`studio-info/${props.id}/`}>Studio {props.id}</Link>
        <p className="text-2xl absolute inset-0 items-center justify-center group-hover:opacity-100 opacity-0 flex backdrop-blur-sm transition-all"> 
            <span className="bg-gray-600 px-5 py-5 text-white rounded-full"> Go to Studio </span> 
        </p>
      </a>
    </>
  );
}

function StudioPageBlock(props) {
  console.log("count: " + props.count);
  return (
    <>
      <div className="my-5 block hover:bg-grey-200">
        <p> count: {props.count} </p>
        {/* <Link to={`${props.next.substring(24,)}`}> Next Page </Link> */}
        <p> previous: {props.previous} </p>
        {props.results.map((studio) => (
          <StudioIntroBlock
            name={studio.name}
            address={studio.address}
            phone_number={studio.phone_number}
            distance={studio.distance}
            id={studio.id}
            studio_images={studio.studio_images}
          />
        ))}
      </div>
    </>
  );
}

// https://norbertbartos.tech/blog/use-geolocation-api-with-react-hooks/
const useCurrentLocation = (
  options = { maximumAge: 60000, timeout: 100000 }
) => {
  // store error message in state
  const [error, setError] = useState();
  const [location, setLocation] = useState();
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  // Success handler for geolocation's `getCurrentPosition` method
  const handleSuccess = (position) => {
    const { latitude, longitude } = position.coords;

    setLocation({
      latitude,
      longitude,
    });

    setIsLoadingLocation(false);
  };

  // Error handler for geolocation's `getCurrentPosition` method
  const handleError = (error) => {
    setError(error.message);
  };

  useEffect(() => {
    // If the geolocation is not defined in the used browser you can handle it as an error
    if (!navigator.geolocation) {
      setError("Geolocation is not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      options
    );
  }, []);

  return { location, error, isLoadingLocation };
};

function ListStudiosPage() {
  const api = useAxios();
  // result
  const [studios, setStudios] = useState([]);
  const [position, setPosition] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

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
    setPage(page);
    await api
      .get(`http://localhost:8000/studios/list_studios/?page=${page}`)
      .then((response) => {
        setStudios(response.data.results);
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
      await getLocation();
      await getStudios(page);

      setIsLoading(false);
    };
    fetchData();
  }, []);

  // console.log(studios.results.length)

  if (isLoading) {
    return <p> Wait for getting the location info </p>;
  }

  console.log("studios", studios[0]);

  return (
    <>
      <p> View more details by clicking each block! </p>
      <div className="flex gap-10 text-center my-5 justify-center">
        {studios.map((studio) => (
          <StudioIntroBlock studio={studio} />
        ))}
      </div>
      <div className="flex gap-3">
        <button className="border-2 border-black px-1 py-1 ml-auto" onClick={() => getStudios(page - 1)}>
          Previous
        </button>
        <button className="border-2 border-black px-1 py-1 mr-auto"  onClick={() => getStudios(page + 1)}> Next </button>
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
}

export default ListStudiosPage;
