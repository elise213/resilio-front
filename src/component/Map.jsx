import React, { useContext, useEffect, useState, useRef, useMemo } from "react";
import { Context } from "../store/appContext";
import GoogleMapReact from "google-map-react";
import Styles from "../styles/map.css";
import ResourceCard from "./ResourceCard";

const Map = ({
  layout,
  handleBoundsChange,
  city,
  userLocation,
  setHoveredItem,

  mapCenter,

  mapZoom,
  filteredResults2,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE;
  const { store, actions } = useContext(Context);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const mapsInstanceRef = useRef(null);

  useEffect(() => {
    const list =
      filteredResults2?.length > 0 ? filteredResults2 : store.boundaryResults;
    console.log("🗺 Total markers rendering:", list.length);
    if (list.length > 0) {
      console.log(
        "✅ First marker example:",
        list[0]?.name,
        list[0]?.latitude,
        list[0]?.longitude
      );
    }
  }, [filteredResults2, store.boundaryResults]);

  useEffect(() => {
    const toLog =
      filteredResults2?.length > 0 ? filteredResults2 : store.boundaryResults;
    console.log("🗺 Rendering markers for:", toLog.length, "items");
  }, [filteredResults2, store.boundaryResults]);

  // const Marker = React.memo(
  //   ({ text, id, result, markerColor }) => {
  //     const [isHovered, setIsHovered] = useState(false);
  //     const [closestCornerClass, setClosestCornerClass] = useState("");

  //     const handleMouseEnter = (event) => {
  //       if (result !== store.hoveredItem) {
  //         setHoveredItem(result);
  //       }
  //       setIsHovered(true);
  //       const cursorX = event.clientX;
  //       const cursorY = event.clientY;
  //       const mapRect = mapContainerRef.current.getBoundingClientRect();
  //       const isCloserToTop = cursorY < (mapRect.top + mapRect.bottom) / 2;
  //       const isCloserToLeft = cursorX < (mapRect.left + mapRect.right) / 2;

  //       if (isCloserToTop && isCloserToLeft) {
  //         setClosestCornerClass("corner-top-left");
  //       } else if (isCloserToTop && !isCloserToLeft) {
  //         setClosestCornerClass("corner-top-right");
  //       } else if (!isCloserToTop && isCloserToLeft) {
  //         setClosestCornerClass("corner-bottom-left");
  //       } else {
  //         setClosestCornerClass("corner-bottom-right");
  //       }
  //     };

  //     const handleMouseLeave = () => {
  //       setIsHovered(false);
  //       setHoveredItem(null);
  //     };

  //     return (
  //       <div
  //         className="marker"
  //         onMouseEnter={handleMouseEnter}
  //         onMouseLeave={handleMouseLeave}
  //         onClick={() => {
  //           if (!result) {
  //             console.error("Error: result is undefined for marker", id);
  //             return;
  //           }
  //           actions.setSelectedResource(result);
  //           actions.openModal();
  //         }}
  //       >
  //         {isHovered && result && (
  //           <div className={`hover-card ${closestCornerClass}`}>
  //             <ResourceCard key={result.id} item={result} />
  //           </div>
  //         )}

  //         <div className="marker-icon">
  //           <i
  //             className="fa-solid fa-map-pin"
  //             style={{ color: isHovered ? "green" : markerColor || "red" }}
  //           ></i>
  //         </div>
  //       </div>
  //     );
  //   },
  //   (prevProps, nextProps) => prevProps.id === nextProps.id
  // );

  // const Marker = ({ lat, lng, text }) => {
  //   console.log("📌 Marker mounted at:", lat, lng, text);
  //   return (
  //     <div
  //       style={{
  //         fontSize: "30px",
  //         color: "red",
  //         backgroundColor: "white",
  //         border: "2px solid black",
  //         borderRadius: "50%",
  //         padding: "5px",
  //         position: "absolute",
  //         transform: "translate(-50%, -50%)",
  //         zIndex: 10000,
  //       }}
  //     >
  //       📍
  //     </div>
  //   );
  // };

  const Marker = React.memo(
    ({ id, result, markerColor = "red" }) => {
      const [isHovered, setIsHovered] = useState(false);
      const [closestCornerClass, setClosestCornerClass] = useState("");
      const { store, actions } = useContext(Context);

      const handleMouseEnter = (event) => {
        if (result !== store.hoveredItem) {
          setHoveredItem(result);
        }
        setIsHovered(true);

        const cursorX = event.clientX;
        const cursorY = event.clientY;
        const mapRect = document
          .querySelector(".map-container")
          .getBoundingClientRect();

        const isCloserToTop = cursorY < (mapRect.top + mapRect.bottom) / 2;
        const isCloserToLeft = cursorX < (mapRect.left + mapRect.right) / 2;

        const positionClass = isCloserToTop
          ? isCloserToLeft
            ? "corner-top-left"
            : "corner-top-right"
          : isCloserToLeft
          ? "corner-bottom-left"
          : "corner-bottom-right";

        setClosestCornerClass(positionClass);
      };

      const handleMouseLeave = () => {
        setIsHovered(false);
        setHoveredItem(null);
      };

      return (
        <div
          className="marker"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => {
            if (!result) {
              console.error("Error: result is undefined for marker", id);
              return;
            }
            actions.setSelectedResource(result);
            actions.openModal();
          }}
          style={{
            position: "absolute",
            transform: "translate(-50%, -100%)",
            zIndex: 1000,
          }}
        >
          {isHovered && result && (
            <div
              className={`hover-card ${closestCornerClass}`}
              style={{
                opacity: 1,
                pointerEvents: "auto",
                transform: "translateY(0)",
                zIndex: 1001,
              }}
            >
              <ResourceCard key={result.id} item={result} />
            </div>
          )}
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "32px",
              color: isHovered ? "green" : markerColor,
            }}
          >
            location_on
          </span>
        </div>
      );
    },
    (prevProps, nextProps) => prevProps.id === nextProps.id
  );

  const createMapOptions = (maps) => ({
    scrollwheel: false,
  });

  const handleApiLoaded = ({ map, maps }) => {
    console.log("✅ Google Maps API Loaded!");
    mapInstanceRef.current = map;
    mapsInstanceRef.current = maps;

    actions.setMapInstance(map);
    actions.setMapsInstance(maps);

    if (userLocation) {
      console.log("📍 Moving map to user location:", userLocation);
      map.setCenter(new maps.LatLng(userLocation.lat, userLocation.lng));
      map.setZoom(13);
    }
  };

  useEffect(() => {
    if (!mapInstanceRef.current || !mapsInstanceRef.current || !userLocation) {
      console.warn(
        "⚠️ Map instance or user location is missing. Skipping movement."
      );
      return;
    }

    const map = mapInstanceRef.current;
    const maps = mapsInstanceRef.current;
    const currentCenter = map.getCenter();
    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      currentCenter,
      new maps.LatLng(userLocation.lat, userLocation.lng)
    );

    if (distance < 500) {
      console.log(
        "🟢 Map is already close to user location. Skipping movement."
      );
      return;
    }
    console.log("✅ Moving map to user location:", userLocation);
    map.setCenter(new maps.LatLng(userLocation.lat, userLocation.lng));
  }, [userLocation]);

  useEffect(() => {
    if (!mapInstanceRef.current || !mapsInstanceRef.current || !mapCenter) {
      console.warn("⚠️ Map instance or mapCenter is missing. Waiting...");
      return;
    }
    const map = mapInstanceRef.current;
    console.log("✅ Moving map to:", mapCenter);
    const currentZoom = map.getZoom();
    map.setCenter(
      new mapsInstanceRef.current.LatLng(mapCenter.lat, mapCenter.lng)
    );
    map.setZoom(currentZoom);
  }, [mapCenter]);

  const defaultCenter = useMemo(
    () => ({
      lat: city?.center?.lat || 34.0522,
      lng: city?.center?.lng || -118.2437,
    }),
    [city.center]
  );

  return (
    <div className={`map-frame`}>
      <div
        ref={mapContainerRef}
        className={`map-container ${layout}map`}
        style={{ height: "100vh", width: "calc(100vw - 350px)" }}
      >
        <GoogleMapReact
          bootstrapURLKeys={{ key: apiKey }}
          center={mapCenter || defaultCenter}
          zoom={mapZoom}
          defaultZoom={11}
          options={createMapOptions}
          onChange={handleBoundsChange}
          onGoogleApiLoaded={handleApiLoaded}
          yesIWantToUseGoogleMapApiInternals={true}
        >
          {(filteredResults2?.length > 0
            ? filteredResults2
            : store.boundaryResults || []
          ).map((result, i) => (
            <Marker
              lat={result.latitude}
              lng={result.longitude}
              text={result.name}
              key={result.id || i}
              id={result.id}
              result={result}
            />
          ))}

          {userLocation && (
            <Marker
              lat={userLocation.lat}
              lng={userLocation.lng}
              text="You are here!"
              markerColor="maroon"
            />
          )}
        </GoogleMapReact>
      </div>
    </div>
  );
};

export default React.memo(Map);
