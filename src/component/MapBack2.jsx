// import React, { useContext, useEffect, useState } from "react";
// import { Context } from "../store/appContext";
// import ResourceCard from "./ResourceCard";
// import Styles from "../styles/mapBack.css";
// import Buttons from "./Buttons";

// const MapBack = ({
//   setIsGeneratedMapModalOpen,
//   isGeneratedMapModalOpen,
//   openModal,
//   closeModal,
//   setHoveredItem,
//   modalIsOpen,
//   setModalIsOpen,
//   addSelectedResource,
//   removeSelectedResource,
//   selectedResources,
//   setSelectedResources,
//   setFavorites,
//   isDeckOpen,
//   setIsDeckOpen,
//   isFavoritesOpen,
//   setIsFavoritesOpen,
//   isNavOpen,
//   isToolBoxOpen,
//   setIsToolBoxOpen,
//   toggleCardDeck,
//   togglefavorites,
//   backSide,
//   setBackSide,
//   toggleFavoritesButtonRef,
//   toggleDeckButtonRef,
// }) => {
//   const apiKey = import.meta.env.VITE_GOOGLE;
//   const { store, actions } = useContext(Context);
//   const [isLargeScreen, setIsLargeScreen] = useState(store.isLargeScreen);

//   useEffect(() => {
//     setIsLargeScreen(store.isLargeScreen);
//   }, [store.isLargeScreen]);

//   // Event listener for selected resources
//   useEffect(() => {
//     const handleSetSelectedResources = () => {
//       const sessionResources = actions.getSessionSelectedResources();
//       setSelectedResources(sessionResources);
//     };
//     document.addEventListener(
//       "setSelectedResources",
//       handleSetSelectedResources
//     );
//     return () => {
//       document.removeEventListener(
//         "setSelectedResources",
//         handleSetSelectedResources
//       );
//     };
//   }, [actions]);

//   const imagePath = "/assets/path1.png";

//   const handleCreateMyPathClick = () => {
//     setIsGeneratedMapModalOpen(true);
//     // Code to generate the PDF
//   };

//   const renderCategoryIcons = (categoryString) => {
//     let categories;
//     if (typeof categoryString === "string") {
//       // Split by comma and trim each category to ensure no extra whitespace
//       categories = categoryString.split(",").map((cat) => cat.trim());
//     } else if (Array.isArray(categoryString)) {
//       categories = categoryString;
//     } else {
//       // If category is neither a string nor an array, return an empty array
//       categories = [];
//     }
//     // Map over categories and create an icon for each
//     return categories.map((category, index) => {
//       const colorStyle = actions.getColorForCategory(category);
//       return (
//         <i
//           key={index}
//           className={`path-icon ${actions.getIconForCategory(category)}`}
//           style={colorStyle ? colorStyle : {}}
//         />
//       );
//     });
//   };

//   // control scrolling when modal is open
//   useEffect(() => {
//     const body = document.body;
//     const grandContainer = document.querySelector(".grand-container");
//     const disableScroll = () => {
//       body.style.overflow = "hidden";
//       if (grandContainer) grandContainer.style.overflow = "hidden";
//     };
//     const enableScroll = () => {
//       body.style.overflow = "auto";
//       if (grandContainer) grandContainer.style.overflow = "auto";
//     };

//     isGeneratedMapModalOpen ? disableScroll() : enableScroll();

//     return () => enableScroll();
//   }, [isGeneratedMapModalOpen]);

//   useEffect(() => {
//     const body = document.body;
//     const grandContainer = document.querySelector(".grand-container");
//     const disableScroll = () => {
//       body.style.overflow = "hidden";
//       if (grandContainer) grandContainer.style.overflow = "hidden";
//     };
//     const enableScroll = () => {
//       body.style.overflow = "auto";
//       if (grandContainer) grandContainer.style.overflow = "auto";
//     };

//     isGeneratedMapModalOpen ? disableScroll() : enableScroll();

//     return () => enableScroll();
//   }, [isGeneratedMapModalOpen]);

//   // Marker component
//   const Marker = ({ text, id, resource, markerColor }) => {
//     const [isHovered, setIsHovered] = useState(false);

//     const color = "red";

//     let icons = <i className="fa-solid fa-map-pin"></i>;

//     let iconClass = "fa-solid fa-map-pin";
//     if (text === "You are here!") {
//       iconClass = "fa-solid fa-location-arrow";
//       color = "blue";
//     }

//     return (
//       <div
//         className="marker"
//         style={{
//           cursor: "pointer",
//           color: "red",
//           position: "relative",
//           zIndex: 996,
//         }}
//         onMouseEnter={() => {
//           setIsHovered(true);
//           setHoveredItem(resource);
//         }}
//         onMouseLeave={() => {
//           setIsHovered(false);
//           setHoveredItem(null);
//         }}
//         onClick={resource ? () => openModal(resource) : undefined}
//       >
//         {isHovered && resource && (
//           <div
//             style={{
//               position: "absolute",
//               bottom: "100%",
//               width: "300px",
//               zIndex: 9999999,
//             }}
//           >
//             <ResourceCard
//               key={resource.name}
//               item={resource}
//               openModal={openModal}
//               closeModal={closeModal}
//               modalIsOpen={modalIsOpen}
//               setModalIsOpen={setModalIsOpen}
//               selectedResources={selectedResources}
//               addSelectedResource={addSelectedResource}
//               removeSelectedResource={removeSelectedResource}
//               setFavorites={setFavorites}
//             />
//           </div>
//         )}
//         <div className="marker-icon">{icons}</div>
//       </div>
//     );
//   };

//   return (
//     <>
//       {/* <p className="the-plan">THE PLAN</p> */}
//       {selectedResources[0] ? (
//         <>
//           <div className="selected-resources">
//             <div className="grid-container">
//               {selectedResources.map((resource, index) => (
//                 <ResourceCard
//                   key={resource.id}
//                   item={resource}
//                   openModal={openModal}
//                   closeModal={closeModal}
//                   modalIsOpen={modalIsOpen}
//                   setModalIsOpen={setModalIsOpen}
//                   selectedResources={selectedResources}
//                   addSelectedResource={addSelectedResource}
//                   removeSelectedResource={removeSelectedResource}
//                   setFavorites={setFavorites}
//                 />
//               ))}
//             </div>
//             <button className="createMyPath" onClick={handleCreateMyPathClick}>
//               Save Your Plan
//             </button>
//           </div>
//         </>
//       ) : (
//         <div className="path-warning-div">
//           <p className="scroll-title">
//             Add Resources <br /> To Your Plan
//           </p>
//         </div>
//       )}
//     </>
//   );
// };

// export default MapBack;
