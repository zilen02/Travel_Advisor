import React, { useState, useEffect } from "react";
import { CssBaseline, Grid } from "@material-ui/core";

import Header from "./components/Header/Header";
import List from "./components/List/List";
import Map from "./components/Map/Map";

// import data from "./api/data";
// import wdata from "./api/wdata";

import { getPlaceData, getWeatherData } from "./api/index";

const App = () => {
  const [places, setPlaces] = useState([]);
  const [weatherData,setWeatherData] = useState([]);
  const [coordinates, setCoordinates] = useState({});
  const [bounds, setBounds] = useState(null);

  const [child, setChild] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [type, setType] = useState("restaurants");
  const [rating, setRating] = useState("0");
  const [filterPlaces, setFilterPlaces] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoordinates({ lat: latitude, lng: longitude });
      }
    );
    // setPlaces(
    //   data?.filter(
    //     (place) =>
    //       place.name && place.num_reviews > 0
    //   )
    // );
    // setWeatherData(wdata[0]);
    // setFilterPlaces([]);
  }, []);

  useEffect(() => {
    const newRatedPlaces = places.filter(
      (place) => parseFloat(place.rating) > rating
    );
    setFilterPlaces(newRatedPlaces);
  }, [rating]);

  useEffect(() => {
    getWeatherData(coordinates.lat, coordinates.lng).then((data) =>
      setWeatherData(data)
    );
    console.log(weatherData);
  }, [coordinates]);

  useEffect(() => {
    if (bounds) {
      setIsLoading(true);
      getPlaceData(type, bounds.sw, bounds.ne).then((data) => {
        setPlaces(data?.filter((place) => place.name && place.num_reviews > 0));
        console.log(places);
        setRating("0");
        setFilterPlaces([]);
        setIsLoading(false);
      });
    }
  }, [bounds, type]);

  return (
    <>
      <CssBaseline />
      <Header setCoordinates={setCoordinates} />
      <Grid container spacing={3} style={{ width: "100%" }}>
        <Grid item xs={12} md={4}>
          <List
            places={filterPlaces.length ? filterPlaces : places}
            child={child}
            type={type}
            setType={setType}
            rating={rating}
            setRating={setRating}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Map
            setCoordinates={setCoordinates}
            setBounds={setBounds}
            coordinates={coordinates}
            places={filterPlaces.length ? filterPlaces : places}
            setChild={setChild}
            weatherData={weatherData}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default App;
