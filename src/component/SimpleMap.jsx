import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import GoogleMapReact from "google-map-react";

const SimpleMap = ({
  openModal,
  handleBoundsChange,
  city,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE;
  const { store, actions } = useContext(Context);

  // Marker Component
  const Marker = ({ text, id, result }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        className="marker"
        style={{ cursor: "pointer" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => openModal(result)}
      >
        <div className="marker-icon">
          <i className="fa-solid fa-map-pin"></i>
          {isHovered && text && <span className="marker-text">{text}</span>}
        </div>
      </div>
    );
  };

  return (
    <div className="map-info">
      <div className="map-container" style={{ height: "60vh", width: "95vw" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: apiKey }}
          center={city.center}
          bounds={city.bounds}
          defaultZoom={11}
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
        </GoogleMapReact>
      </div>
    </div>
  );
};

export default SimpleMap;


// const fetchBoundsFromZip = async () => {
//   try {
//     const data = await fetchBounds(zipInput);
//     const location = data.results[0]?.geometry?.location;
//     const bounds = normalizeBounds(data.results[0]?.geometry?.bounds || data.results[0]?.geometry?.viewport);

//     if (location && bounds) {
//       console.log('Before setCity: ', {center: location, bounds});
//       updateCityState({
//         center: location,
//         bounds: bounds,
//       });
//       console.log('After setCity');
//     }
//   } catch (error) {
//     console.error("Error fetching bounds from zip code:", error.message);
//   }
// };

//   const fetchInitialBounds = async () => {
//     const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${city.center.lat},${city.center.lng}&key=${apiKey}`);
//     const data = await response.json();

//     if (data.results[0].geometry) {
//       const bounds = normalizeBounds(data.results[0].geometry.bounds);
//       if (bounds) {
//         setCity(prev => ({
//           ...prev,
//           bounds: {
//             ne: { lat: bounds.ne.lat, lng: bounds.ne.lng },
//             sw: { lat: bounds.sw.lat, lng: bounds.sw.lng },
//           }
//         }));
//         setBoundsData(bounds);
//       }
//     }
//   };
;

//   useEffect(() => {
//     if (zipInput && zipInput.length === 5) {
//       async function fetchBoundsFromZip() {
//         try {
//           const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${zipInput}&key=${apiKey}`);
//           const data = await response.json();
//           if (data.results[0] && data.results[0].geometry) {
//             const location = data.results[0].geometry.location;
//             const bounds = normalizeBounds(data.results[0].geometry.bounds || data.results[0].geometry.viewport);

//             setCity({
//               center: { lat: location.lat, lng: location.lng },
//               bounds: bounds
//             });
//             setBoundsData(bounds);
//           }
//         } catch (error) {
//           console.error("Error fetching bounds from zip code:", error.message);
//         }
//       }
//       fetchBoundsFromZip();
//     }
//   }, [zipInput]);