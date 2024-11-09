import React, { useContext, useEffect, useState, useRef, useMemo } from "react";
import { Context } from "../store/appContext";
import GoogleMapReact from "google-map-react";
import Styles from "../styles/simple_map.css";
import HoverCard from "./HoverCard";
import { debounce } from "lodash";
import ResourceCard from "../component/ResourceCard";

const SimpleMap = ({
  layout,
  handleBoundsChange,
  city,
  userLocation,
  setHoveredItem,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE;
  const { store, actions } = useContext(Context);
  const [isGoogleMapsLoaded, setGoogleMapsLoaded] = useState(true); //not finished
  const [mapCenter, setMapCenter] = useState(city.center);
  const [mapZoom, setMapZoom] = useState(11);
  const mapContainerRef = useRef(null);
  const selectedResources = store.selectedResources;

  const closeModal = actions.closeModal;
  const openModal = actions.openModal;

  const createMapOptions = (maps) => {
    return {
      scrollwheel: false,
    };
  };

  useEffect(() => {
    if (city.center) {
      setMapCenter({
        lat: city.center.lat,
        lng: city.center.lng,
      });
    }
  }, [city.center]);

  useEffect(() => {
    console.log("City center updated to:", city.center);
    if (city.center) {
      setMapCenter({
        lat: city.center.lat,
        lng: city.center.lng,
      });
    }
  }, [city.center]);

  useEffect(() => {
    const fetchMarkers = async () => {};
    if (city && city.bounds) {
      fetchMarkers();
    }
  }, [city.bounds]);

  useEffect(() => {
    if (userLocation) {
      setMapCenter({
        lat: userLocation.lat,
        lng: userLocation.lng,
      });
      setMapZoom(13);
    }
  }, [userLocation]);

  const calculateClosestCorner = (cursorX, cursorY) => {
    const mapRect = mapContainerRef.current.getBoundingClientRect();
    const isCloserToTop = cursorY < (mapRect.top + mapRect.bottom) / 2;
    const isCloserToLeft = cursorX < (mapRect.left + mapRect.right) / 2;

    if (isCloserToTop && isCloserToLeft) {
      console.log("top left");
      return "corner-top-left";
    } else if (isCloserToTop && !isCloserToLeft) {
      console.log("top right");
      return "corner-top-right";
    } else if (!isCloserToTop && isCloserToLeft) {
      console.log("bottom left");
      return "corner-bottom-left";
    } else {
      console.log("bottom right");
      return "corner-bottom-right";
    }
  };

  const Marker = React.memo(
    ({ text, id, result, markerColor }) => {
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
              <ResourceCard
                key={result.id}
                item={result}
                openModal={openModal}
                closeModal={closeModal}
              />
            </div>
          )}

          {!isHovered && result && (
            <div className="marker-icon">
              <i className={iconClass} style={{ color }}></i>
            </div>
          )}
        </div>
      );
    },
    (prevProps, nextProps) => {
      return (
        prevProps.id === nextProps.id &&
        prevProps.isHovered === nextProps.isHovered
      );
    }
  );

  return (
    <>
      <div className={`map-frame`}>
        <div
          ref={mapContainerRef}
          className={`map-container ${layout}map`}
          style={{ height: "100vh", width: "calc(100vw - 350px)" }}
        >
          {isGoogleMapsLoaded && (
            <GoogleMapReact
              bootstrapURLKeys={{ key: apiKey }}
              center={mapCenter}
              zoom={mapZoom} // dynamic zoom level
              defaultZoom={11}
              options={createMapOptions}
              onChange={handleBoundsChange}
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
          )}
        </div>
      </div>
    </>
  );
};

export default React.memo(SimpleMap);
