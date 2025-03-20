// import React, { useContext, useEffect, useState, useRef, useMemo } from "react";
// import { Context } from "../store/appContext";
// import GoogleMapReact from "google-map-react";
// import Styles from "../styles/map.css";
// import ResourceCard from "./ResourceCard";

// const Map = ({
//   layout,
//   handleBoundsChange,
//   city,
//   userLocation,
//   setHoveredItem,
//   setMapCenter,
//   mapCenter,
//   setMapZoom,
//   mapZoom,
//   filteredResults2,
//   mapInstance,
//   setMapInstance,
//   mapsInstance,
//   setMapsInstance,
// }) => {
//   const apiKey = import.meta.env.VITE_GOOGLE;
//   const { store, actions } = useContext(Context);
//   const [isGoogleMapsLoaded, setGoogleMapsLoaded] = useState(true); //didn't finish this

//   const mapContainerRef = useRef(null);

//   const createMapOptions = (maps) => {
//     return {
//       scrollwheel: false,
//     };
//   };

//   useEffect(() => {
//     const fetchMarkers = async () => {};
//     if (city && city.bounds) {
//       fetchMarkers();
//     }
//   }, [city.bounds]);

//   useEffect(() => {
//     console.log("🚀 userLocation useEffect triggered!");
//     console.log("🔎 Checking dependencies:");
//     console.log("🗺 mapInstance:", mapInstance);
//     console.log("🗺 mapsInstance:", mapsInstance);
//     console.log("📍 userLocation:", userLocation);

//     if (!mapInstance || !mapsInstance || !userLocation) {
//       console.warn(
//         "⚠️ One or more dependencies are missing. Map movement aborted."
//       );
//       return;
//     }

//     console.log("✅ Moving map to user location:", userLocation);

//     try {
//       mapInstance.setCenter(
//         new mapsInstance.LatLng(userLocation.lat, userLocation.lng)
//       );
//       mapInstance.setZoom(13);
//       console.log("🎯 Map successfully moved!");
//     } catch (error) {
//       console.error("❌ Error setting map center:", error);
//     }
//   }, [userLocation, mapInstance, mapsInstance]);

//   const defaultCenter = useMemo(
//     () => ({
//       lat: city?.center?.lat || 34.0522, // Default to Los Angeles if undefined
//       lng: city?.center?.lng || -118.2437,
//     }),
//     [city.center]
//   );

//   const calculateClosestCorner = (cursorX, cursorY) => {
//     const mapRect = mapContainerRef.current.getBoundingClientRect();
//     const isCloserToTop = cursorY < (mapRect.top + mapRect.bottom) / 2;
//     const isCloserToLeft = cursorX < (mapRect.left + mapRect.right) / 2;

//     if (isCloserToTop && isCloserToLeft) {
//       console.log("top left");
//       return "corner-top-left";
//     } else if (isCloserToTop && !isCloserToLeft) {
//       console.log("top right");
//       return "corner-top-right";
//     } else if (!isCloserToTop && isCloserToLeft) {
//       console.log("bottom left");
//       return "corner-bottom-left";
//     } else {
//       console.log("bottom right");
//       return "corner-bottom-right";
//     }
//   };
//   const Marker = React.memo(
//     ({ text, id, result, markerColor }) => {
//       const [isHovered, setIsHovered] = useState(false);
//       const [closestCornerClass, setClosestCornerClass] = useState("");

//       const handleMouseEnter = (event) => {
//         if (result !== store.hoveredItem) {
//           setHoveredItem(result);
//         }
//       };

//       const handleMouseLeave = () => {
//         setIsHovered(false);
//         setHoveredItem(null);
//       };

//       return (
//         <div
//           className="marker"
//           onMouseEnter={handleMouseEnter}
//           onMouseLeave={handleMouseLeave}
//           onClick={() => {
//             if (!result) {
//               console.error("Error: result is undefined for marker", id);
//               return;
//             }
//             actions.setSelectedResource(result);
//             actions.openModal();
//           }}
//         >
//           {isHovered && result && (
//             <div className={`hover-card ${closestCornerClass}`}>
//               <ResourceCard key={result.id} item={result} />
//             </div>
//           )}

//           <div className="marker-icon">
//             <i
//               className="fa-solid fa-map-pin"
//               style={{ color: isHovered ? "green" : markerColor || "red" }}
//             ></i>
//           </div>
//         </div>
//       );
//     },
//     (prevProps, nextProps) => prevProps.id === nextProps.id
//   );

//   useEffect(() => {
//     console.log("🛠 Checking map instances...");
//     console.log("🗺 mapInstance:", mapInstance);
//     console.log("🗺 mapsInstance:", mapsInstance);
//   }, [mapInstance, mapsInstance]);

//   useEffect(() => {
//     console.log("🚀 mapCenter useEffect triggered!");
//     console.log("🔎 Checking dependencies:");
//     console.log("🗺 mapInstance:", mapInstance);
//     console.log("🗺 mapsInstance:", mapsInstance);
//     console.log("📍 mapCenter:", mapCenter);

//     if (!mapInstance || !mapsInstance || !mapCenter) {
//       console.warn("⚠️ One or more dependencies are missing. Waiting...");
//       return;
//     }

//     console.log("✅ Moving map to:", mapCenter);
//     mapInstance.setCenter(
//       new mapsInstance.LatLng(mapCenter.lat, mapCenter.lng)
//     );
//     mapInstance.setZoom(13);
//   }, [mapCenter, mapInstance, mapsInstance]);

//   // Force re-center when city.center updates
//   useEffect(() => {
//     if (!mapInstance) {
//       console.warn("⚠️ mapInstance is not yet available. Retrying...");
//       return;
//     }

//     if (mapInstance && city?.center) {
//       console.log("🏙 Moving map to city center:", city.center);
//       mapInstance.setCenter(city.center);
//     }
//   }, [city.center, mapInstance]);

//   return (
//     <>
//       <div className={`map-frame`}>
//         <div
//           ref={mapContainerRef}
//           className={`map-container ${layout}map`}
//           style={{ height: "100vh", width: "calc(100vw - 350px)" }}
//         >
//           {isGoogleMapsLoaded && (
//             <GoogleMapReact
//               key={`${mapCenter?.lat}-${mapCenter?.lng}`} //  Forces re-render when mapCenter changes
//               bootstrapURLKeys={{ key: apiKey }}
//               center={mapCenter || defaultCenter}
//               zoom={mapZoom}
//               defaultZoom={11}
//               options={createMapOptions}
//               onChange={handleBoundsChange}
//             >
//               {/* <GoogleMapReact
//             bootstrapURLKeys={{ key: apiKey }}
//                center={mapCenter || defaultCenter}
//              zoom={mapZoom}
//                defaultZoom={11}
//               options={createMapOptions}
//             onChange={handleBoundsChange}
//            > */}
//               {/* Use filteredResults2 first, then fallback to boundaryResults */}
//               {(filteredResults2?.length > 0
//                 ? filteredResults2
//                 : store.boundaryResults || []
//               ).map((result, i) => (
//                 <Marker
//                   lat={result.latitude}
//                   lng={result.longitude}
//                   text={result.name}
//                   key={result.id || i}
//                   id={result.id}
//                   result={result}
//                 />
//               ))}

//               {/* User Location Marker */}
//               {userLocation && (
//                 <Marker
//                   lat={userLocation.lat}
//                   lng={userLocation.lng}
//                   text="You are here!"
//                   color="maroon"
//                 />
//               )}
//             </GoogleMapReact>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default React.memo(Map);import React, { useContext, useEffect, useRef, useMemo, useState } from "react";

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
  setMapCenter,
  mapCenter,
  setMapZoom,
  mapZoom,
  filteredResults2,
  setMapsInstance,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE;
  const { store, actions } = useContext(Context);
  const mapContainerRef = useRef(null);

  // ✅ Persist Google Map instances using useRef
  const mapInstanceRef = useRef(null);
  const mapsInstanceRef = useRef(null);

  // ✅ Marker component with hover effect and ResourceCard display
  const Marker = React.memo(
    ({ text, id, result, markerColor }) => {
      const [isHovered, setIsHovered] = useState(false);
      const [closestCornerClass, setClosestCornerClass] = useState("");

      const handleMouseEnter = (event) => {
        if (result !== store.hoveredItem) {
          setHoveredItem(result);
        }
        setIsHovered(true);

        // 📌 Determine closest corner for tooltip positioning
        const cursorX = event.clientX;
        const cursorY = event.clientY;
        const mapRect = mapContainerRef.current.getBoundingClientRect();
        const isCloserToTop = cursorY < (mapRect.top + mapRect.bottom) / 2;
        const isCloserToLeft = cursorX < (mapRect.left + mapRect.right) / 2;

        if (isCloserToTop && isCloserToLeft) {
          setClosestCornerClass("corner-top-left");
        } else if (isCloserToTop && !isCloserToLeft) {
          setClosestCornerClass("corner-top-right");
        } else if (!isCloserToTop && isCloserToLeft) {
          setClosestCornerClass("corner-bottom-left");
        } else {
          setClosestCornerClass("corner-bottom-right");
        }
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
        >
          {isHovered && result && (
            <div className={`hover-card ${closestCornerClass}`}>
              <ResourceCard key={result.id} item={result} />
            </div>
          )}

          <div className="marker-icon">
            <i
              className="fa-solid fa-map-pin"
              style={{ color: isHovered ? "green" : markerColor || "red" }}
            ></i>
          </div>
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

    // Store map instances in refs
    mapInstanceRef.current = map;
    mapsInstanceRef.current = maps;

    actions.setMapInstance(map);
    actions.setMapsInstance(maps);

    // Move map to userLocation if available
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

    // ✅ Prevent unnecessary movements
    if (distance < 500) {
      console.log(
        "🟢 Map is already close to user location. Skipping movement."
      );
      return;
    }

    console.log("✅ Moving map to user location:", userLocation);
    map.setCenter(new maps.LatLng(userLocation.lat, userLocation.lng));
  }, [userLocation]); // 🔥 No `mapZoom` to avoid resetting zoom

  useEffect(() => {
    if (!mapInstanceRef.current || !mapsInstanceRef.current || !mapCenter) {
      console.warn("⚠️ Map instance or mapCenter is missing. Waiting...");
      return;
    }

    const map = mapInstanceRef.current;
    console.log("✅ Moving map to:", mapCenter);

    // ✅ Preserve zoom level instead of resetting
    const currentZoom = map.getZoom();
    map.setCenter(
      new mapsInstanceRef.current.LatLng(mapCenter.lat, mapCenter.lng)
    );
    map.setZoom(currentZoom); // Keeps user-selected zoom level
  }, [mapCenter]); // 🔥 No `mapZoom` dependency to prevent auto zoom resets

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
          yesIWantToUseGoogleMapApiInternals={true} // ✅ Removes Google Maps warning
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
