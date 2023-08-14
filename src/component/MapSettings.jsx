import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";

const MapSettings = ({ setCity, handleZipInputChange, zipInput, filterByBounds, setFilterByBounds }) => {

    const apiKey = import.meta.env.VITE_GOOGLE;

    function geoFindMe() {
        async function updateCityCenterAndBounds(lat, lng) {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`);
            const data = await response.json();

            if (data && data.results && data.results[0] && data.results[0].geometry) {
                const location = data.results[0].geometry.location;
                const bounds = data.results[0].geometry.bounds || data.results[0].geometry.viewport;
                setCity({
                    center: { lat: location.lat, lng: location.lng },
                    bounds: {
                        ne: { lat: bounds.northeast.lat, lng: bounds.northeast.lng },
                        sw: { lat: bounds.southwest.lat, lng: bounds.southwest.lng }
                    }
                });
            }
        }
        function success(position) {
            let latitude = position.coords.latitude;
            let longitude = position.coords.longitude;
            updateCityCenterAndBounds(latitude, longitude);
        }
        function error() { alert("Unable to retrieve your location"); }
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
        } else {
            console.log("Locating…");
            navigator.geolocation.getCurrentPosition(success, error);
        }
    }
    return (
        <div className="map-settings">
            <button
                className="geo-button" style={{}}
                onClick={() => {
                    geoFindMe()
                }}
            >
                Find Location
            </button>
            {"  "} or {"  "}
            <div className="zipcode-input-container">
                <input
                    type="text"
                    id="zipcode"
                    value={zipInput}
                    onChange={handleZipInputChange}
                    maxLength="5"
                    placeholder="Enter Zip Code"
                />
            </div>
            {/* 
            <div className="bounds-toggle-container">
                <label className="switch">
                    <input
                        type="checkbox"
                        checked={filterByBounds}
                        onChange={(e) => setFilterByBounds(e.target.checked)}
                    />
                    <span className="slider round"></span>
                </label>
                <span style={{ marginLeft: '10px' }}>Filter Results by Map Boundary</span>
            </div> */}
        </div>
    )
}

export default MapSettings;
