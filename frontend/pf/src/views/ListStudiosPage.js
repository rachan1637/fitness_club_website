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
        <div className>
            {props.studio.studio_images.map((image) => (
            <img className="max-w-sm max-h-56 mx-auto" src={`${image?.images}`} />
            ))}
        </div>
        <p className="text-2xl absolute inset-0 items-center justify-center group-hover:opacity-100 opacity-0 flex backdrop-blur-sm transition-all"> 
            <span className="bg-gray-600 px-5 py-5 text-white rounded-full"> Go to Studio </span> 
        </p>
      </a>
    </>
  );
}

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
    await api
      .get(`http://localhost:8000/studios/list_studios/?page=${page}`)
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
      await getLocation();
      await getStudios(page);

      setIsLoading(false);
    };
    fetchData();
  }, []);

  // console.log(studios.results.length)

  if (isLoading) {
    return <p> Wait for location information... </p>;
  }

  return (
    <>
      <p className="text-center"> View more details by clicking each block! </p>
      <hr className="my-5"/>
      <div className="flex gap-10 text-center justify-center">
        {studios.map((studio) => (
          <StudioIntroBlock studio={studio} />
        ))}
      </div>
      <div className="flex gap-3 my-5">
        <button className="border-2 border-black px-2 py-1 ml-auto rounded-lg" onClick={() => getStudios(page - 1)}>
          Previous
        </button>
        <button className="border-2 border-black px-2 py-1 mr-auto rounded-lg"  onClick={() => getStudios(page + 1)}> Next </button>
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
