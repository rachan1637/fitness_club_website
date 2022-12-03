import React, { useContext, useEffect, useState } from "react"
import { useGeolocated } from "react-geolocated";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import useAxios from "../utils/useAxios";

function StudioIntroBlock(props) {
    return (
        <>
            <div className="my-5 block hover:bg-grey-200">
                <p> Studio Name: {props.name} </p>
                <p> Studio Address: {props.address} </p>
                <p> Phone number: {props.phone_number} </p>
                <p> Distance from you: {props.distance} </p>
                {/* Need image */}
                <Link to={`studio-info/${props.id}`}>Studio {props.id}</Link>
            </div>
        </>
    )
}

// https://norbertbartos.tech/blog/use-geolocation-api-with-react-hooks/
const useCurrentLocation = (options = {maximumAge:60000, timeout: 100000}) => {
    // store error message in state
    const [error, setError] = useState();
    const [location, setLocation] = useState();

    // Success handler for geolocation's `getCurrentPosition` method
    const handleSuccess = position => {
    const { latitude, longitude } = position.coords;

        setLocation({
        latitude,
        longitude
        });
    };

    // Error handler for geolocation's `getCurrentPosition` method
    const handleError = error => {
        setError(error.message);
    };
    
    useEffect(() => {
      // If the geolocation is not defined in the used browser you can handle it as an error
      if (!navigator.geolocation) {
        setError('Geolocation is not supported.');
        return;
      }

      navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {maximumAge:60000, timeout: 100000});
    }, []);

    return { location, error };
  };



function ListStudiosPage() {
    let { user } = useContext(AuthContext);
    const api = useAxios();
    const [studios, setStudios] = useState([])
    const { location, error } = useCurrentLocation();

    useEffect(() => {
        const fetchData = async () => {
            const position = location.latitude + ", " + location.longitude
            // console.log(position)
            // console.log(JSON.stringify(
            //     {
            //         "location": position
            //     }
            // ))
            // localStorage.setItem("position", position)

            // if (!hasLocation) {
            let hasLocation = false;
            await api.post(
                "http://localhost:8000/studios/create_location/",
                JSON.stringify(
                    {
                        "location": position
                    }
                ),
                {headers: {"Content-Type": "application/json"}}
            ).then(
                response => {
                    console.log("Create location successfully")
                    // console.log(response)
                    // console.log(response.data)
                }
            ).catch(
                error => {
                    console.log(error.response)
                    hasLocation = true
                }
            )

            if (hasLocation) {
                // Update location if the user already has one
                await api.put(
                    "http://localhost:8000/studios/update_location/",
                    JSON.stringify(
                        {
                            "location": position
                        }
                    ),
                    {headers: {"Content-Type": "application/json"}}
                ).then(
                    response => {
                        console.log("Update location successfully")
                        // console.log(response)
                        // console.log(response.data)
                    }
                ).catch(
                    error => {
                        console.log(error.response)
                    }
                )
            }
            // } else {

            await api.get(
                "http://localhost:8000/studios/list_studios/"
            ).then(
                response => {
                    setStudios(response.data)
                    console.log(response.data)
                }
            ).catch(
                error => {
                    console.log(error.responses)
                }
            )
        }
        fetchData();

        // function render_studios () {
        //     return (
        //         studios.map(studio => 
        //             <>
        //                 <StudioIntroBlock name={studio.name} address = {studio.address} phone_number={studio.phone_number} distance={studio.distance}/>
        //                 <Link to={`studio-info/${studio.id}`}>Studio {studio.id}</Link>
        //             </>
        //         )
        //     )
        // }

    }, [studios, location])

    return (
        <>
            <p> View more details by clicking each block! </p>
            {
                studios.map((studio) => {
                    // console.log(i, studio)
                    return <StudioIntroBlock name={studio.name} address={studio.address} phone_number={studio.phone_number} distance={studio.distance} id={studio.id}/>
                }
                )
            }
            {/* {render_studios()} */}
        </>
    )
}

export default ListStudiosPage;