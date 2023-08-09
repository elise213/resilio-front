import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import GoogleMapReact from "google-map-react";
import { useNavigate } from "react-router-dom";

export const SimpleMap = ({ zipCode, setZipCode, setPlace, place, openModal, filterByBounds, setFilterByBounds }) => {
  const { store, actions } = useContext(Context);
  const [zipInput, setZipInput] = ("")

  const [city, setCity] = useState({
    // AUSTIN
    // center: { lat: 30.266666, lng: -97.733330 },
    // LOS ANGELES
    center: { lat: 34.0522, lng: -118.2437 },
    bounds: {
      ne: { lat: (34.0522 + 0.18866583325124964), lng: (-118.2437 + 0.44322967529295454) },
      sw: { lat: (34.0522 - 0.18908662930897435), lng: (-118.2437 - 0.44322967529298296) }
    }
  });

  const handleZipInputChange = (e) => {
    const value = e.target.value;
    if (value.length <= 5 && /^[0-9]*$/.test(value)) {
      setZipInput(value);
      if (value.length === 5) {
        setZipCode(zipInput);
      }
    }
  };

  useEffect(() => {
    setPlace(city);
  }, [city])

  function geoFindMe() {
    function success(position) {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;

      setBounds(latitude, longitude);
    }
    function error() {
      alert("Unable to retrieve your location");
    }
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
    } else {
      console.log("Locating…");
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }

  const Marker = ({ text, id, result }) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();
    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    const handleMarkerClick = () => {
      openModal(result);
    };

    return (
      <div
        className="marker"
        style={{ cursor: "pointer" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleMarkerClick}
      >
        <div className="marker-icon">
          <i className="fa-solid fa-map-pin"></i>
          {isHovered && text && <span className="marker-text">{text}</span>}
        </div>
      </div>
    );
  };

  const handleBoundsChange = (data) => {
    const center = city.center;
    const ne = data.bounds.ne;
    const sw = data.bounds.sw;
    const bounds = {
      ne: { lat: Math.max(ne.lat, center.lat), lng: Math.max(ne.lng, center.lng) },
      sw: { lat: Math.min(sw.lat, center.lat), lng: Math.min(sw.lng, center.lng) },
    };
    setCity((prev) => ({
      ...prev,
      bounds: bounds,
    }));
    actions.setSearchResults();
    actions.setBoundaryResults();
  };

  const setBounds = (lati, longi) => {
    let neLat = (lati + 0.18866583325124964);
    let swLat = (lati - 0.18908662930897435);
    let neLng = (longi + 0.44322967529295454);
    let swLng = (longi - 0.44322967529298296);

    setCity({
      center: { lat: lati, lng: longi },
      bounds: {
        ne: { lat: neLat, lng: neLng },
        sw: { lat: swLat, lng: swLng }
      }
    })
    actions.setSearchResults();
    actions.setBoundaryResults();
  }

  return (
    <div className="map-info">

      <div className="map-city-buttons">
        <button
          className="geo-button" style={{}}
          onClick={() => {
            geoFindMe()
            console.log("GEO CITY CENTER", city.center)
          }}
        >
          Find my Location
        </button>

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
        </div>

        <div className="zipcode-input-container">
          {/* <label htmlFor="zipcode"></label> */}
          <input
            type="text"
            id="zipcode"
            value={zipInput}
            onChange={handleZipInputChange}
            maxLength="5"
            placeholder="Enter Zipcode"
          />
        </div>
      </div>

      <div className="map-container" style={{ height: "73vh", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyDOhqYOYIXvrk8lt2HQQLI8cS1O8FnZt9I" }}
          center={city.center}
          defaultZoom={11}
          onChange={handleBoundsChange}
        >
          {filterByBounds ?
            store.boundaryResults.map((result, i) => {
              return (
                <Marker
                  lat={result.latitude}
                  lng={result.longitude}
                  text={result.name}
                  key={i}
                  category={result.category}
                  id={result.id}
                  openModal={openModal}
                  result={result}
                />
              );
            })
            :
            store.searchResults.map((result, i) => {
              return (
                <Marker
                  lat={result.latitude}
                  lng={result.longitude}
                  text={result.name}
                  key={i}
                  category={result.category}
                  id={result.id}
                  openModal={openModal}
                  result={result}
                />
              );
            })}
        </GoogleMapReact>
      </div>
    </div>
  );
};
