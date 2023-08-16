import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import GoogleMapReact from "google-map-react";
import { useNavigate } from "react-router-dom";

export const SimpleMap = ({ openModal, filterByBounds, setBoundsData, city, setCity }) => {

  const apiKey = import.meta.env.VITE_GOOGLE;
  const { store, actions } = useContext(Context);


  const normalizeBounds = (bounds) => {
    console.log("BOUNDS", bounds)
    if (bounds) {
      return ({
        ne: { lat: bounds.northeast.lat, lng: bounds.northeast.lng },
        sw: { lat: bounds.southwest.lat, lng: bounds.southwest.lng }
      })
    }
  };

  const fetchInitialBounds = async () => {
    console.log("CITY", city)
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

      <div className="map-container" style={{ height: "60vh", width: "95vw" }}>


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
