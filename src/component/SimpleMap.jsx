import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import GoogleMapReact from "google-map-react";
import { useNavigate } from "react-router-dom";

export const SimpleMap = ({ zipCode, setZipCode, openModal, filterByBounds, setFilterByBounds, setBoundsData, city, setCity }) => {

  const apiKey = import.meta.env.VITE_GOOGLE;
  const { store, actions } = useContext(Context);
  const [zipInput, setZipInput] = useState("");

  const normalizeBounds = (bounds) => ({
    ne: { lat: bounds.ne.lat || bounds.northeast.lat, lng: bounds.ne.lng || bounds.northeast.lng },
    sw: { lat: bounds.sw.lat || bounds.southwest.lat, lng: bounds.sw.lng || bounds.southwest.lng }
  });

  const fetchInitialBounds = async () => {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${city.center.lat},${city.center.lng}&key=${apiKey}`);
    const data = await response.json();

    if (data && data.results && data.results[0] && data.results[0].geometry) {
      const bounds = normalizeBounds(data.results[0].geometry.bounds || data.results[0].geometry.viewport);

      setCity(prev => ({
        ...prev,
        bounds: {
          ne: { lat: bounds.northeast.lat, lng: bounds.northeast.lng },
          sw: { lat: bounds.southwest.lat, lng: bounds.southwest.lng }
        }
      }));
      setBoundsData(bounds);
    }
  };

  useEffect(() => {
    fetchInitialBounds();
  }, []);

  const handleZipInputChange = async (e) => {
    const value = e.target.value;
    if (value.length <= 5 && /^[0-9]*$/.test(value)) {
      setZipInput(value);

      if (value.length === 5) {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${value}&key=${apiKey}`);
        const data = await response.json();

        if (data && data.results && data.results[0] && data.results[0].geometry) {
          const location = data.results[0].geometry.location;
          const bounds = data.results[0].geometry.bounds || data.results[0].geometry.viewport; // Fallback to viewport if bounds is not available.

          setCity({
            center: { lat: location.lat, lng: location.lng },
            bounds: {
              ne: { lat: bounds.northeast.lat, lng: bounds.northeast.lng },
              sw: { lat: bounds.southwest.lat, lng: bounds.southwest.lng }
            }
          });
        }
      }
    }
  };

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

  const Marker = ({ text, id, result }) => {
    const [isHovered, setIsHovered] = useState(false);
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
    console.log("Bounds Changed:", data.bounds);
    if (filterByBounds) {
      setCity(prev => ({
        ...prev,
        bounds: {
          ne: data.bounds.ne,
          sw: data.bounds.sw
        },
        center: {
          lat: data.center.lat,
          lng: data.center.lng
        }
      }));
      setBoundsData(data.bounds);
      actions.setBoundaryResults(data.bounds);
    }
  };

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

      <div className="map-container" style={{ height: "60vh", width: "100" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: apiKey }}
          center={city.center}
          bounds={city.bounds}
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
              )
            })}
        </GoogleMapReact>
      </div>
    </div>
  );
};
