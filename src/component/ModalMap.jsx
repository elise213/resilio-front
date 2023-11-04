import React, { useState } from "react";
import GoogleMapReact from "google-map-react";
import { useNavigate } from "react-router-dom";
import Styles from "../styles/simple_map.css";

export const ModalMap = (props) => {
  let lat = parseFloat(props.latitude);
  let lng = parseFloat(props.longitude);

  const [city, setCity] = useState({
    center: { lat: lat, lng: lng },
  });

  const Marker = ({ lat, lng, color, text, category }) => {
    const [isHovered, setIsHovered] = useState(false);

    const navigate = useNavigate();

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    const handleMarkerClick = () => {
      const wantDirections = window.confirm(
        "Do you want directions to this resource?"
      );
      if (wantDirections) {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        window.open(url, "_blank");
      }
    };

    return (
      <div
        className="marker"
        style={{ color: color, cursor: "pointer" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleMarkerClick}
      >
        <div className="marker-icon">
          <i className="fa-solid fa-map-pin"></i>

          {isHovered && text && <span>Click for Directions.</span>}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div
        className="map-container-modal"
        style={{ height: "20vh", width: "100%" }}
      >
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyDOhqYOYIXvrk8lt2HQQLI8cS1O8FnZt9I" }}
          center={city.center}
          defaultZoom={14}
        >
          <Marker lat={lat} lng={lng} color="red" text="hi" />
        </GoogleMapReact>
      </div>
    </div>
  );
};
