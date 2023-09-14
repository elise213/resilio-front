import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import GoogleMapReact from "google-map-react";

const SimpleMap = ({
  openModal,
  filterByBounds,
  setBoundsData,
  city,
  setCity,
  zipInput,
  clearZipInput,
  resources
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE;
  const { store, actions } = useContext(Context);

  const normalizeBounds = (bounds) => {
    if (bounds) {
      return ({
        ne: { lat: bounds.northeast.lat, lng: bounds.northeast.lng },
        sw: { lat: bounds.southwest.lat, lng: bounds.southwest.lng }
      })
    }
  };

  const fetchInitialBounds = async () => {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${city.center.lat},${city.center.lng}&key=${apiKey}`);
    const data = await response.json();

    if (data.results[0].geometry) {
      const bounds = normalizeBounds(data.results[0].geometry.bounds);
      if (bounds) {
        setCity(prev => ({
          ...prev,
          bounds: {
            ne: { lat: bounds.ne.lat, lng: bounds.ne.lng },
            sw: { lat: bounds.sw.lat, lng: bounds.sw.lng }
          }
        }));
        setBoundsData(bounds);
      }
    }
  };

  useEffect(() => {
    fetchInitialBounds();
  }, []);

  useEffect(() => {
    if (zipInput && zipInput.length === 5) {
      async function fetchBoundsFromZip() {
        try {
          const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${zipInput}&key=${apiKey}`);
          const data = await response.json();
          if (data.results[0] && data.results[0].geometry) {
            const location = data.results[0].geometry.location;
            const bounds = normalizeBounds(data.results[0].geometry.bounds || data.results[0].geometry.viewport);

            setCity({
              center: { lat: location.lat, lng: location.lng },
              bounds: bounds
            });
            setBoundsData(bounds);
          }
        } catch (error) {
          console.error("Error fetching bounds from zip code:", error.message);
        }
      }
      fetchBoundsFromZip();
    }
  }, [zipInput]);


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
      actions.setBoundaryResults(data.bounds, resources);
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

export default SimpleMap;