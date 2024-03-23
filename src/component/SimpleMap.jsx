import React, { useContext, useEffect, useState, useRef } from "react";
import { Context } from "../store/appContext";
import GoogleMapReact from "google-map-react";
import Styles from "../styles/simple_map.css";
import HoverCard from "./HoverCard";

const SimpleMap = ({
  openModal,
  handleBoundsChange,
  city,
  userLocation,
  setHoveredItem,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE;
  const { store, actions } = useContext(Context);

  const mapContainerRef = useRef(null);

  useEffect(() => {
    const fetchMarkers = async () => {};
    if (city && city.bounds) {
      fetchMarkers();
    }
  }, [city]);

  // Function to calculate the closest corner
  const calculateClosestCorner = (cursorX, cursorY) => {
    const mapRect = mapContainerRef.current.getBoundingClientRect();
    const isCloserToTop = cursorY < (mapRect.top + mapRect.bottom) / 2;
    const isCloserToLeft = cursorX < (mapRect.left + mapRect.right) / 2;

    if (isCloserToTop && isCloserToLeft) {
      // console.log("top left");
      return "corner-top-left";
    } else if (isCloserToTop && !isCloserToLeft) {
      // console.log("top right");
      return "corner-top-right";
    } else if (!isCloserToTop && isCloserToLeft) {
      // console.log("bottom left");
      return "corner-bottom-left";
    } else {
      // console.log("bottom right");
      return "corner-bottom-right";
    }
  };

  const Marker = ({ text, id, result, markerColor }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [closestCornerClass, setClosestCornerClass] = useState("");

    const handleMouseEnter = (event) => {
      setIsHovered(true);
      setHoveredItem(result);

      // Calculate the position relative to the marker
      const markerRect = event.currentTarget.getBoundingClientRect();
      const cornerClass = calculateClosestCorner(
        markerRect.left + markerRect.width / 2,
        markerRect.top + markerRect.height / 2
      );
      setClosestCornerClass(cornerClass);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setHoveredItem(null);
    };

    const color = "red";
    let iconClass = "fa-solid fa-map-pin";

    return (
      <div
        className="marker"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={result ? () => openModal(result) : undefined}
      >
        {isHovered && result && (
          <div className={`hover-card ${closestCornerClass}`}>
            <HoverCard key={result.id} item={result} openModal={openModal} />
          </div>
        )}

        {!isHovered && result && (
          <div className="marker-icon">
            <i className={iconClass} style={{ color }}></i>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className={`map-frame`}>
        <div
          ref={mapContainerRef}
          className="map-container"
          style={{ height: "100vh", width: "calc(100vw - 350px)" }}
        >
          <GoogleMapReact
            bootstrapURLKeys={{ key: apiKey }}
            center={city.center}
            bounds={city.bounds}
            defaultZoom={9}
            onChange={(e) => handleBoundsChange(e)}
          >
            {store.boundaryResults.map((result, i) => (
              <Marker
                lat={result.latitude}
                lng={result.longitude}
                text={result.name}
                key={i}
                id={result.id}
                openModal={openModal}
                result={result}
              />
            ))}

            {userLocation && (
              <Marker
                lat={userLocation.lat}
                lng={userLocation.lng}
                text="You are here!"
                color="maroon"
              />
            )}
          </GoogleMapReact>
        </div>
        <div className="simple-selection"></div>
      </div>
    </>
  );
};

export default SimpleMap;
