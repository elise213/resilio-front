import React, { useState } from "react";

const MapSettings = ({ setCity, handleZipInputChange, zipInput }) => {
    const [isLocating, setIsLocating] = useState(false);
    const apiKey = import.meta.env.VITE_GOOGLE;

    const updateCityCenterAndBounds = async (lat, lng) => {
        try {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`);
            const data = await response.json();

            const location = data?.results?.[0]?.geometry?.location;
            const bounds = data?.results?.[0]?.geometry?.bounds || data?.results?.[0]?.geometry?.viewport;

            if (location && bounds) {
                setCity({
                    center: location,
                    bounds: {
                        ne: bounds.northeast,
                        sw: bounds.southwest
                    }
                });
            } else {
                throw new Error("Received unexpected data format from Google Maps API");
            }
        } catch (error) {
            console.error("Error occurred while updating city center and bounds:", error.message);
            alert("There was an issue fetching location data. Please try again later.");
        }
    };

    const geoFindMe = async () => {
        setIsLocating(true);
        handleZipInputChange({ target: { value: '' } });

        const success = (position) => {
            setIsLocating(false);
            updateCityCenterAndBounds(position.coords.latitude, position.coords.longitude);
        };

        const error = () => {
            alert("Unable to retrieve your location");
            setIsLocating(false);
        };

        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            setIsLocating(false);
        } else {
            navigator.geolocation.getCurrentPosition(success, error);
        }
    };

    return (
        <div className="map-settings">
            <div>
                {isLocating && (
                    <div className="locating-message">
                        <i className="fa-solid fa-bullseye"></i> Locating <i className="fa-solid fa-bullseye"></i>
                    </div>
                )}
            </div>
            <div className="map-settings-buttons">
                <button className="geo-button" onClick={geoFindMe}>
                    Find Location
                </button>
                <span className="or">or</span>
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
            </div>
        </div>
    );
};

export default MapSettings;