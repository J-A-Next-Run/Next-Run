// React components and hooks
import React, { useState, useEffect } from "react";
import "./App.css";

//Ionic Capcitor layer
import { Plugins } from '@capacitor/core';
const { Geolocation } = Plugins;

// Database helper object
import useDatabase from "../helpers/useDatabase";

//API calls
import {
  GoogleMap,
  withGoogleMap,
  withScriptjs,
  Marker
} from "react-google-maps";

//API keys
const API_KEY = process.env.REACT_APP_GMAPS_API_KEY;
const MAP_URL = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&v=3.exp&libraries=geometry`;

const App = props => {

  const [state, setState] = useState({
    courts: [],
    currentLocation: {}
  });

  const { getAllCourts } = useDatabase(); //Object destructure to use getAllcourts function

  //*------------------------------- Methods ----------------------------------------------

  /**
   * Sets current location and adds to state
   */
  const setCurrentLocation = position => {

    setState(prevState => ({
      ...prevState,
      currentLocation: position
    }));
  };

  //Gets current location through capacitor API
  const getCurrentLocation = async () => {

    //Watch for location changes and update state
    await Geolocation.watchPosition({enableHighAccuracy: true}, (location, err) => {
      if (err){
        console.log(err);
      }
      else{
        const coords = {
          lat: location.coords.latitude,
          lng: location.coords.longitude
        }

        setCurrentLocation(coords);
      }
    });
  }

  //*-------------------------------Custom components----------------------------------------------

  /**
   * Generates custom map marker component
   * @param {*} props 
   */
  const CurrentLocationMarkerComponent = (props) => {
    return (
      //TODO: Use defaultIcon prop to link to png
      <Marker position={state.currentLocation}/>
    );
  }

  /**
   * Generates Map component other props are used with withScriptjs and withGoogleMap
   */
  const MapComponent = withScriptjs(
    withGoogleMap(props => {
      return (
        <GoogleMap defaultZoom={15} defaultCenter={state.currentLocation}>
          <CurrentLocationMarkerComponent/>
        </GoogleMap>
      );
    })
  );

  /**
   * Runs everytime App component is rendered.
   */
  useEffect(() => {

    //Get all courts from database and updates state
    getAllCourts().then((res, err) => {
      if (err) {
        console.log(err);
      }

      setState(prevState => ({
        ...prevState,
        courts: res.data
      }));
    });

    getCurrentLocation();
    
  }, []); //Empty arr tells it to only run once after App rendered

  return (
    <div className="App">
      <div className="App-header">
        <img src={"images/Next-Run_logo.png"} className="App-logo" alt="logo" />
      </div>
      <MapComponent
        googleMapURL={MAP_URL}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    </div>
  );
};

export default App;
