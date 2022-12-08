import React, { Component, useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '500px',
  height: '600px'
};

// https://stackoverflow.com/questions/41405343/adding-marker-to-google-maps-in-google-map-react

const createControlledPromise = () => {
  let resolver;
  let rejector;
  const promise = new Promise((resolve, reject) => {
    resolver = resolve;
    rejector = reject;
  });
  return { promise, resolver, rejector };
};

// const useMarker = ({ location }) => {
//   const { 
//     promise: apiPromise, 
//     resolver: handleGoogleApiLoaded 
//   } = useMemo(
//     createControlledPromise,
//     []
//   ).current;

//   useEffect(
//     () => {
//       let marker;
//       apiPromise.then(api => {
//         const { map, maps } = api;
//         marker = new maps.Marker({ position: { location }, map });
//       });
//       return () => {
//         if (marker) {
//           marker.setMap(null);
//         }
//       };
//     },
//     [location],
//   );
//   return { handleGoogleApiLoaded };
// };


function MyGoolgeMap (props) {
  const center  = props.state
  // const { handleGoogleApiLoaded } = useMarker(center);
  const [isLoading, setIsLoading] = useState(true)

  const options = useMemo(() => ({
    disableDefaultUI: true,
    clickableIcons: false
  }), [])

  const renderMarkers = (map, maps) => {
      let marker = new maps.Marker({
      position: center,
      map,
      // title: 'Hello World!'
      });
      return marker;
   };

  useEffect (() => {
    setIsLoading(true)
    setIsLoading(false)
  }, [])

  if (isLoading || center === undefined) {
  return (<p> Still Loading</p>)
  }

  // let yesIWantToUseGoogleMapApiInternals = true
  // console.log(center)

    return (
      <LoadScript
        googleMapsApiKey="AIzaSyBb33AynHIsQvdta8jk2Q5lr6vShcU6NQg"
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={16}
          // options={options}
          // onLoad={onLoad}
          // yesIWantToUseGoogleMapApiInternals
          // onGoogleApiLoaded={({ map, maps }) => renderMarkers(map, maps)}
        >
          { /* Child components, such as markers, info windows, etc. */ }
          <Marker position={center}/>
        </GoogleMap>
      </LoadScript>
    )
}

export default MyGoolgeMap