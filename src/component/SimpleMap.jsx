import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import GoogleMapReact from "google-map-react";
import Styles from "../styles/simple_map.css";
import MapSettings from "./MapSettings";

const SimpleMap = ({ openModal, handleBoundsChange, city }) => {
  const apiKey = import.meta.env.VITE_GOOGLE;
  const { store, actions } = useContext(Context);

  const createMapOptions = () => {
    return {
      styles: [
        {
          featureType: "all",
          elementType: "geometry",
          stylers: [{ lightness: -5 }, { gamma: 0.8 }, { saturation: -30 }],
        },
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "poi.business",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "road",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [{ visibility: "off" }],
        },
        // {
        //   featureType: "road",
        //   elementType: "labels.text.stroke",
        //   stylers: [{ visibility: "off" }],
        // },
        {
          featureType: "administrative.locality",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "administrative.neighborhood",
          elementType: "labels.text.stroke",
          // stylers: [{ color: "lightGray" }, { weight: 0.01 }],
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "administrative.neighborhood",
          elementType: "labels.text.fill",
          // stylers: [{ color: "white" }],
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "water",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    };
  };

  const Marker = ({ text, id, result }) => {
    const [isHovered, setIsHovered] = useState(false);
    const categories = actions.processCategory(result.category);

    const icons = categories.map((category, index) => {
      const iconClass = actions.getIconForCategory(category);
      const color = actions.getColorForCategory(category).color; // Updated to get color for each category
      return <i key={index} className={iconClass} style={{ color }}></i>;
    });

    const color = actions.getColorForCategory(result.category).color;
    const singleCategory = categories[0];
    const iconClass = actions.getIconForCategory(singleCategory);

    return (
      <div
        className="marker"
        style={{ cursor: "pointer" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => openModal(result)}
      >
        <div className="marker-icon">
          <i className={iconClass} style={{ color }}></i>
          {isHovered && text && (
            <span className="marker-text">
              {text}
              <span className="marker-hover-icons">
                {icons} {/* Place icons next to the text */}
              </span>
            </span>
          )}
        </div>
      </div>
    );

    // return (
    //   <div
    //     className="marker"
    //     style={{ cursor: "pointer" }}
    //     onMouseEnter={() => setIsHovered(true)}
    //     onMouseLeave={() => setIsHovered(false)}
    //     onClick={() => openModal(result)}
    //   >
    //     <div className="marker-icon">
    //       <i className={iconClass} style={{ color }}></i>
    //       {isHovered && (
    //         <span className="marker-hover-icons">
    //           {icons} {/* Updated this to directly insert the icons elements */}
    //         </span>
    //       )}
    //       {isHovered && text && (
    //         <span className="marker-text">
    //           {text} {/* Removed icons from here */}
    //         </span>
    //       )}
    //     </div>
    //   </div>
    // );
  };

  // const Marker = ({ text, id, result }) => {
  //   const [isHovered, setIsHovered] = useState(false);
  //   // const singleCategory = actions.processCategory(result.category)[0];

  //   const categories = actions.processCategory(result.category);
  //   const icons = categories.map((category) =>
  //     actions.getIconForCategory(category)
  //   );

  //   // const iconClass = actions.getIconForCategory(singleCategory);
  //   const color = actions.getColorForCategory(result.category).color;
  //   return (
  //     <div
  //       className="marker"
  //       style={{ cursor: "pointer" }}
  //       onMouseEnter={() => setIsHovered(true)}
  //       onMouseLeave={() => setIsHovered(false)}
  //       onClick={() => openModal(result)}
  //     >
  //       <div className="marker-icon">
  //         <i className={iconClass} style={{ color: color }}></i>{" "}
  //         {isHovered && text && <span className="marker-text">{text}</span>}
  //       </div>
  //     </div>
  //   );
  // };

  return (
    <div className="map-container" style={{ height: "90vh", width: "90vw" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: apiKey }}
        center={city.center}
        bounds={city.bounds}
        defaultZoom={11}
        onChange={(e) => handleBoundsChange(e)}
        options={createMapOptions}
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
  );
};

export default SimpleMap;
