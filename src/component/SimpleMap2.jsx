import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import GoogleMapReact from "google-map-react";
import { Link, useNavigate } from "react-router-dom";

export const SimpleMap2 = (props) => {
    const { store, actions } = useContext(Context);

    // let lat = 25.727264069277847;
    // let lng = -80.2627160981497;

    let lat = parseFloat(props.latitude);
    let lng = parseFloat(props.longitude);

    const [city, setCity] = useState({
        center: { lat: lat, lng: lng },
    });

    // Define the Marker component
    const Marker = ({ lat, lng, color, text, category }) => {
        const [isHovered, setIsHovered] = useState(false);
        const navigate = useNavigate(); // 
        const handleMouseEnter = () => {
            setIsHovered(true);
        };
        const handleMouseLeave = () => {
            setIsHovered(false);
        };

        const handleMarkerClick = () => {
            const wantDirections = window.confirm("Do you want directions to this resource?");
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
                onClick={handleMarkerClick} // Remove the arrow function here
            >
                <div className="marker-icon">
                    <i className="fa-solid fa-map-pin"></i>

                    {isHovered && text && <span>Click for Directions</span>}
                </div>
            </div>
        );

    };


    return (

        <div>
            <div className="map-container" style={{ height: "40vh", width: "100%" }}>
                <GoogleMapReact
                    // Put the google API key here!!
                    bootstrapURLKeys={{ key: "AIzaSyDOhqYOYIXvrk8lt2HQQLI8cS1O8FnZt9I" }}
                    center={city.center}
                    defaultZoom={14}
                >
                    <Marker
                        lat={lat}
                        lng={lng}
                        color="red"
                        text="hi"
                    />
                </GoogleMapReact>
            </div>
        </div>
    );
};
