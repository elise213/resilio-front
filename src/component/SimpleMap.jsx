import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import GoogleMapReact from "google-map-react";

export const SimpleMap = ({
  openModal,
  filterByBounds,
  setBoundsData,
  city,
  setCity,
  zipInput,
  clearZipInput
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE;
  const { store, actions } = useContext(Context);

  const fetchFromAPI = async (endpoint) => {
    const response = await fetch(`https://maps.googleapis.com/maps/api${endpoint}&key=${apiKey}`);
    return await response.json();
  };

  const normalizeBounds = bounds => bounds && {
    ne: bounds.northeast,
    sw: bounds.southwest
  };

  useEffect(() => {
    (async () => {
      if (!city.center) return;

      const data = await fetchFromAPI(`/geocode/json?address=${city.center.lat},${city.center.lng}`);
      if (data.results[0]?.geometry) {
        const newBounds = normalizeBounds(data.results[0].geometry.bounds || data.results[0].geometry.viewport);
        if (newBounds) {
          setCity(prev => ({ ...prev, bounds: newBounds }));
          setBoundsData(newBounds);
        }
      }

      if (zipInput?.length === 5) {
        const data = await fetchFromAPI(`/geocode/json?address=${zipInput}`);
        if (data.results[0]?.geometry) {
          const location = data.results[0].geometry.location;
          const bounds = normalizeBounds(data.results[0].geometry.bounds || data.results[0].geometry.viewport);
          setCity({
            center: location,
            bounds
          });
          setBoundsData(bounds);
        }
      }
    })();
  }, [city.center, zipInput]);


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
    if (typeof clearZipInput === 'function') {
      clearZipInput();
    }
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
      <div className="map-container" style={{ height: "60vh", width: "95vw" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: apiKey }}
          center={city.center}
          bounds={city.bounds}
          defaultZoom={11}
          onChange={handleBoundsChange}
        >
          {store.boundaryResults.map((result, i) => {
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
          }
        </GoogleMapReact>
      </div>
    </div>
  );
};
