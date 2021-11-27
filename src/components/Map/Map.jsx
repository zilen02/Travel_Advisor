import React from "react";
import GoogleMapReact from "google-map-react";
import { Paper, Typography, useMediaQuery } from "@material-ui/core";
import LocationOnOutlinedIcon from "@material-ui/icons/LocationOnOutlined";
import Rating from "@material-ui/lab/Rating";

import useStyles from "./styles";
import mapStyles from "./mapStyles";

const Map = ({ setCoordinates, setBounds, coordinates, places, setChild ,weatherData }) => {
  const classes = useStyles();
  const isDesktop = useMediaQuery("(min-width:600px)");

  places = places.filter(function (place) {
    return place.latitude !== undefined;
  });

  console.log(weatherData);

  return (
    <div className={classes.mapContainer}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
        defaultCenter={coordinates}
        center={coordinates}
        defaultZoom={14}
        margin={[50, 5, 50, 50]}
        onChange={(e) => {
          setCoordinates({ lat: e.center.lat, lng: e.center.lng });
          setBounds({ sw: e.marginBounds.sw, ne: e.marginBounds.ne });
        }}
        onChildClick={(child) => {
          setChild(child);
        }}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          styles: mapStyles,
        }}
      >
        {places?.map((place, i) => (
          <div
            className={classes.markerContainer}
            lat={parseFloat(place.latitude)}
            lng={parseFloat(place.longitude)}
            key={i}
          >
            {!isDesktop ? (
              <LocationOnOutlinedIcon color="primary" fontsize="large" />
            ) : (
              <Paper elevation={3} className={classes.paper}>
                <Typography
                  className={classes.typography}
                  variant="subtitle2"
                  gutterBottom
                >
                  {place.name}
                </Typography>
                <img
                  className={classes.pointer}
                  src={
                    place.photo
                      ? place.photo.images.large.url
                      : "https://images.pexels.com/photos/3201920/pexels-photo-3201920.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                  }
                  alt={place.name}
                />
                <Rating
                  size="small"
                  value={parseFloat(place.rating)}
                  readOnly
                />
              </Paper>
            )}
          </div>
        ))}

        {weatherData?.list?.length &&
          weatherData.list.map((data, i) => (
            <div key={i} lat={data.coord.lat} lng={data.coord.lon}>
              <img
                src={`http://openweathermap.org/img/w/${data.weather[0].icon}.png`}
                height="70px"
              />
            </div>
          ))}
      </GoogleMapReact>
    </div>
  );
};

export default Map;
