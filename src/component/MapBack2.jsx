import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import ResourceCard from "./ResourceCard";
import GeneratedTreasureMap from "./GeneratedTreasureMap";
import GoogleMapReact from "google-map-react";
import Styles from "../styles/mapBack.css";

const MapBack = ({
  setBackSide,
  backSide,
  setIsGeneratedMapModalOpen,
  isGeneratedMapModalOpen,
  openModal,
  closeModal,
  hoveredItem,
  modalIsOpen,
  setModalIsOpen,
  setFavorites,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE;

  const defaultMapCenter = { lat: 34.0522, lng: -118.2437 };

  const [selectedResources, setSelectedResources] = useState(() => {
    const storedResources = sessionStorage.getItem("selectedResources");
    return storedResources ? JSON.parse(storedResources) : [];
  });
  const { store, actions } = useContext(Context);
  const handleCreateMyPathClick = () => {
    setIsGeneratedMapModalOpen(true);
  };

  // Here's the new function to get the icon for a resource
  const getIconForResource = (resourceType) => {
    const processedCategories = actions.processCategory(resourceType);
    return processedCategories?.map((category, index) => {
      const iconClassName = actions.getIconForCategory(category);
      const colorStyle = actions.getColorForCategory(category);
      // ... debugging logs
      return (
        <i
          key={index}
          className={`${iconClassName} card-icon`}
          style={colorStyle || {}}
        />
      );
    });
  };

  useEffect(() => {
    const body = document.body;
    const grandContainer = document.querySelector(".grand-container");
    const disableScroll = () => {
      body.style.overflow = "hidden";
      if (grandContainer) grandContainer.style.overflow = "hidden";
    };
    const enableScroll = () => {
      body.style.overflow = "auto";
      if (grandContainer) grandContainer.style.overflow = "auto";
    };

    isGeneratedMapModalOpen ? disableScroll() : enableScroll();

    return () => enableScroll();
  }, [isGeneratedMapModalOpen]);

  useEffect(() => {
    const handleSetSelectedResources = () => {
      setSelectedResources(actions.getSessionSelectedResources());
    };

    document.addEventListener(
      "setSelectedResources",
      handleSetSelectedResources
    );

    return () => {
      document.removeEventListener(
        "setSelectedResources",
        handleSetSelectedResources
      );
    };
  }, [actions]);

  useEffect(() => {
    const storedResources = actions.getSessionSelectedResources();
    if (JSON.stringify(storedResources) !== JSON.stringify(selectedResources)) {
      setSelectedResources(storedResources);
    }
  }, [actions, selectedResources]);

  const addSelectedResource = (resource) => {
    setSelectedResources((prevResources) => {
      if (!prevResources.some((r) => r.id === resource.id)) {
        const updatedResources = [...prevResources, resource];
        sessionStorage.setItem(
          "selectedResources",
          JSON.stringify(updatedResources)
        );
        return updatedResources;
      }
      return prevResources;
    });
  };

  const removeSelectedResource = (resourceId) => {
    setSelectedResources((prevResources) => {
      const updatedResources = prevResources.filter((r) => r.id !== resourceId);
      sessionStorage.setItem(
        "selectedResources",
        JSON.stringify(updatedResources)
      );
      return updatedResources;
    });
  };

  const Marker = ({ text, id, result, markerColor }) => {
    const [isHovered, setIsHovered] = useState(false);

    const color = result
      ? markerColor || actions.getColorForCategory(result.category).color
      : markerColor || "red";

    let icons = [];
    let iconClass = "default-icon-class";

    // Process category icons if result is defined
    if (result) {
      const categories = actions.processCategory(result.category);
      icons = categories.map((category, index) => {
        const iconClass = actions.getIconForCategory(category);
        const color = actions.getColorForCategory(category).color;
        return <i key={index} className={iconClass} style={{ color }}></i>;
      });

      const singleCategory = categories[0];
      iconClass = actions.getIconForCategory(singleCategory);
    }

    return (
      <div
        className="marker"
        style={{ cursor: "pointer", color, position: "relative" }}
        onMouseEnter={() => {
          setIsHovered(true);
          setHoveredItem(result);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setHoveredItem(null);
        }}
        onClick={result ? () => openModal(result) : undefined}
      >
        {isHovered && result && (
          <div
            style={{
              position: "absolute",
              bottom: "100%",
              width: "300px",
              zIndex: 99999,
            }}
          >
            <ResourceCard
              key={result.id}
              item={result}
              openModal={openModal}
              closeModal={closeModal}
              modalIsOpen={modalIsOpen}
              setModalIsOpen={setModalIsOpen}
              selectedResources={selectedResources}
              addSelectedResource={addSelectedResource}
              removeSelectedResource={removeSelectedResource}
            />
          </div>
        )}

        <div className="marker-icon">
          <i className={iconClass} style={{ color }}></i>
        </div>
      </div>
    );
  };

  return (
    <>
      <button className="flip-button" onClick={() => setBackSide(!backSide)}>
        Flip The Map
      </button>
      <button className="createMyPath" onClick={handleCreateMyPathClick}>
        Create my Path
      </button>
      <div>
        {selectedResources.map((resource, index) => (
          <div key={resource.id} className="selected-item">
            <div className="selected-item-content">
              <span>{resource.name}</span>
            </div>
          </div>
        ))}
      </div>
      {/* 
      <div className="map-container" style={{ height: "80vh", width: "60vw" }}>
        <div
          className="map-container"
          style={{ height: "80vh", width: "60vw" }}
        >
          <GoogleMapReact
            bootstrapURLKeys={{ key: apiKey }}
            defaultZoom={11}
            defaultCenter={store.bodhGaya.center || defaultMapCenter} // Provide a fallback in case store.bodhGaya.center is undefined
            // ... other properties you might need
          >
            {selectedResources.map((resource, index) => (
              <Marker
                lat={resource.latitude}
                lng={resource.longitude}
                text={resource.name}
                key={resource.id}
                id={resource.id}
              />
            ))}
            {/* Include other markers such as user location etc */}
      {/* </GoogleMapReact>
        </div>
      </div> */}

      <div className="back-container">
        {store.boundaryResults && store.boundaryResults.length > 0 && (
          <div className="list-container">
            <div className="scroll-title">
              <span>In your Area</span>
            </div>
            <ul>
              {store.boundaryResults.map((resource, index) => (
                <ResourceCard
                  key={resource.id}
                  item={resource}
                  openModal={openModal}
                  closeModal={closeModal}
                  modalIsOpen={modalIsOpen}
                  setModalIsOpen={setModalIsOpen}
                  selectedResources={selectedResources}
                  addSelectedResource={addSelectedResource}
                  removeSelectedResource={removeSelectedResource}
                />
              ))}
            </ul>
          </div>
        )}
        {store.favorites && store.favorites.length > 0 && (
          <div className="list-container">
            <div className="scroll-title">
              <span>Your Favorites</span>
            </div>
            <ul>
              {store.favorites.map((resource, index) => (
                <ResourceCard
                  key={resource.id}
                  item={resource}
                  openModal={openModal}
                  closeModal={closeModal}
                  modalIsOpen={modalIsOpen}
                  setModalIsOpen={setModalIsOpen}
                  selectedResources={selectedResources}
                  addSelectedResource={addSelectedResource}
                  removeSelectedResource={removeSelectedResource}
                />
              ))}
            </ul>
          </div>
        )}
      </div>

      {isGeneratedMapModalOpen && (
        <GeneratedTreasureMap
          closeModal={() => setIsGeneratedMapModalOpen(false)}
          selectedResources={selectedResources}
        />
      )}
    </>
  );
};

export default MapBack;

// import React, { useContext, useEffect, useState } from "react";
// import { Context } from "../store/appContext";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import ResourceCard from "./ResourceCard";
// import GeneratedTreasureMap from "./GeneratedTreasureMap";

// const DRAGGABLE_ITEM_CLASS = "draggable-item";

// const MapBack = ({
//   hoveredItem,
//   openModal,
//   closeModal,
//   modalIsOpen,
//   setModalIsOpen,
//   selectedResource,
//   setFavorites,
//   onDragEnd,
//   onDragStart,
//   onDragUpdate,
//   setBackSide,
//   backSide,
//   setDraggingItem,
//   isGeneratedMapModalOpen,
//   setIsGeneratedMapModalOpen,
// }) => {
//   const {
//     actions,
//     store: { boundaryResults, favorites },
//   } = useContext(Context);

//   // Function to render placeholder

//   const [selectedResources, setSelectedResources] = useState(() => {
//     // Get the initial state from sessionStorage or default to an empty array
//     const storedResources = sessionStorage.getItem("selectedResources");
//     return storedResources ? JSON.parse(storedResources) : [];
//   });

//   const handleCreateMyPathClick = () => {
//     setIsGeneratedMapModalOpen(true);
//   };

//   const setSelectedResourcesEvent = new Event("setSelectedResources");

//   useEffect(() => {
//     const body = document.body;
//     const grandContainer = document.querySelector(".grand-container");

//     const disableScroll = () => {
//       body.style.overflow = "hidden";
//       if (grandContainer) {
//         grandContainer.style.overflow = "hidden";
//       }
//     };
//     const enableScroll = () => {
//       body.style.overflow = "auto";
//       if (grandContainer) {
//         grandContainer.style.overflow = "auto";
//       }
//     };
//     if (isGeneratedMapModalOpen) {
//       disableScroll();
//     } else {
//       enableScroll();
//     }
//     // Cleanup function to re-enable scrolling when the component unmounts
//     return () => {
//       enableScroll();
//     };
//   }, [isGeneratedMapModalOpen]);

//   // Here's the new function to get the icon for a resource
//   const getIconForResource = (resourceType) => {
//     const processedCategories = actions.processCategory(resourceType);
//     return processedCategories?.map((category, index) => {
//       const iconClassName = actions.getIconForCategory(category);
//       const colorStyle = actions.getColorForCategory(category);
//       // ... debugging logs
//       return (
//         <i
//           key={index}
//           className={`${iconClassName} card-icon`}
//           style={colorStyle || {}}
//         />
//       );
//     });
//   };

//   const addSelectedResource = (resource) => {
//     setSelectedResources((prevResources) => {
//       if (!prevResources.find((r) => r.id === resource.id)) {
//         const updatedResources = [...prevResources, resource];
//         sessionStorage.setItem(
//           "selectedResources",
//           JSON.stringify(updatedResources)
//         );
//         return updatedResources;
//       }
//       return prevResources;
//     });
//   };

//   const removeSelectedResource = (resourceId) => {
//     setSelectedResources((prevResources) => {
//       const updatedResources = prevResources.filter((r) => r.id !== resourceId);
//       sessionStorage.setItem(
//         "selectedResources",
//         JSON.stringify(updatedResources)
//       );
//       return updatedResources;
//     });
//   };

//   useEffect(() => {
//     const handleSetSelectedResources = () => {
//       const storedResources = actions.getSessionSelectedResources();
//       setSelectedResources(storedResources);
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
//   }, []);

//   useEffect(() => {
//     console.log(selectedResources);
//   }, [selectedResources]);

//   useEffect(() => {
//     const storedResources = actions.getSessionSelectedResources();
//     if (JSON.stringify(storedResources) !== JSON.stringify(selectedResources)) {
//       setSelectedResources(storedResources);
//     }
//   }, []);

//   return (
//     <>
//       <button className="flip-button" onClick={() => setBackSide(!backSide)}>
//         Flip The Map
//       </button>
//       <div className="treasure-map-container">
//         {selectedResources.map((resource, index) => (
//           <div key={resource.id} className="selected-item">
//             <div className="selected-item-content">
//               <span>{resource.name}</span>
//               {/* Render the icon next to the resource's name */}
//               {getIconForResource(resource.type)}
//             </div>
//           </div>
//         ))}

//         <div className="treasureMapDiv">
//           {/* Rest of the treasure map content */}
//           <button className="createMyPath" onClick={handleCreateMyPathClick}>
//             Create my Path
//           </button>
//         </div>
//       </div>

//       <div className="backside">
//         {/* Content for boundaryResults and favorites */}
//         {boundaryResults && boundaryResults.length > 0 && (
//           <div>
//             <div className="scroll-title">
//               <span>In your Area</span>
//             </div>
//             <div>
//                     <ul>
//                       {boundaryResults.map((resource, index) => (
//                         <ResourceCard
//                           key={resource.id}
//                           resource={resource}
//                           index={index}
//                         />
//                       ))}
//                     </ul>
//                     </div>
//                   </div>
//                 )};
//         )}

//         {favorites && favorites[0] && (
//               <div>
//               <ul>
//                 {favorites.map((resource, index) => (
//                   <ResourceCard
//                     key={resource.id}
//                     resource={resource}
//                     index={index}
//                   />
//                 ))}
//               </ul>
//               </div>)}

//       {isGeneratedMapModalOpen && (
//         <GeneratedTreasureMap
//           closeModal={() => setIsGeneratedMapModalOpen(false)}
//           selectedResources={selectedResources}
//         />
//       )}
//     </>
//   );
// };

// export default MapBack;

// import React, { useContext, useEffect, useState } from "react";
// import { Context } from "../store/appContext";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import ResourceCard from "./ResourceCard";
// import GeneratedTreasureMap from "./GeneratedTreasureMap";

// const DRAGGABLE_ITEM_CLASS = "draggable-item";

// const MapBack = ({
//   hoveredItem,
//   openModal,
//   closeModal,
//   modalIsOpen,
//   setModalIsOpen,
//   selectedResource,
//   setFavorites,
//   onDragEnd,
//   onDragStart,
//   onDragUpdate,
//   setBackSide,
//   backSide,
//   setDraggingItem,
//   isGeneratedMapModalOpen,
//   setIsGeneratedMapModalOpen,
// }) => {
//   const {
//     actions,
//     store: { boundaryResults, favorites },
//   } = useContext(Context);

//   // Function to render placeholder

//   const [selectedResources, setSelectedResources] = useState(() => {
//     // Get the initial state from sessionStorage or default to an empty array
//     const storedResources = sessionStorage.getItem("selectedResources");
//     return storedResources ? JSON.parse(storedResources) : [];
//   });

//   const handleCreateMyPathClick = () => {
//     setIsGeneratedMapModalOpen(true);
//   };

//   const setSelectedResourcesEvent = new Event("setSelectedResources");

//   useEffect(() => {
//     const body = document.body;
//     const grandContainer = document.querySelector(".grand-container");

//     const disableScroll = () => {
//       body.style.overflow = "hidden";
//       if (grandContainer) {
//         grandContainer.style.overflow = "hidden";
//       }
//     };

//     const enableScroll = () => {
//       body.style.overflow = "auto";
//       if (grandContainer) {
//         grandContainer.style.overflow = "auto";
//       }
//     };

//     if (isGeneratedMapModalOpen) {
//       disableScroll();
//     } else {
//       enableScroll();
//     }

//     // Cleanup function to re-enable scrolling when the component unmounts
//     return () => {
//       enableScroll();
//     };
//   }, [isGeneratedMapModalOpen]);

//   const addSelectedResource = (resource) => {
//     setSelectedResources((prevResources) => {
//       if (!prevResources.find((r) => r.id === resource.id)) {
//         const updatedResources = [...prevResources, resource];
//         sessionStorage.setItem(
//           "selectedResources",
//           JSON.stringify(updatedResources)
//         );
//         return updatedResources;
//       }
//       return prevResources;
//     });
//   };

//   const removeSelectedResource = (resourceId) => {
//     setSelectedResources((prevResources) => {
//       const updatedResources = prevResources.filter((r) => r.id !== resourceId);
//       sessionStorage.setItem(
//         "selectedResources",
//         JSON.stringify(updatedResources)
//       );
//       return updatedResources;
//     });
//   };

//   useEffect(() => {
//     const handleSetSelectedResources = () => {
//       const storedResources = actions.getSessionSelectedResources();
//       setSelectedResources(storedResources);
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
//   }, []);

//   useEffect(() => {
//     console.log(selectedResources);
//   }, [selectedResources]);

//   useEffect(() => {
//     const storedResources = actions.getSessionSelectedResources();
//     if (JSON.stringify(storedResources) !== JSON.stringify(selectedResources)) {
//       setSelectedResources(storedResources);
//     }
//   }, []);

//   return (
//     <>
//       <button className="flip-button" onClick={() => setBackSide(!backSide)}>
//         Flip The Map
//       </button>
//       <div className="treasure-map-container">
//         <div className="selected-resources-container">
//           <DragDropContext
//             onDragEnd={onDragEnd}
//             onDragStart={onDragStart}
//             onDragUpdate={onDragUpdate}
//             onBeforeCapture={onBeforeCapture}
//           >
//             <Droppable
//               droppableId="selectedResourcesDroppable"
//               direction="vertical"
//             >
//               {(provided, snapshot) => (
//                 <div ref={provided.innerRef} {...provided.droppableProps}>
//                   {/* <ul>{selectedResources.map(renderDraggable)}</ul> */}

//                   {provided.placeholder}
//                 </div>
//               )}
//             </Droppable>
//           </DragDropContext>
//         </div>

//         <div className="treasureMapDiv">
//           <DragDropContext
//             onDragEnd={onDragEnd}
//             onDragStart={onDragStart}
//             onDragUpdate={onDragUpdate}
//             onBeforeCapture={onBeforeCapture}
//           >
//             <Droppable droppableId="mapAreaDroppable">
//               {(provided, snapshot) => (
//                 <div
//                   className={`${DRAGGABLE_ITEM_CLASS} ${
//                     snapshot.isDraggingOver ? "dragging" : ""
//                   }`}
//                   ref={provided.innerRef}
//                   {...provided.droppableProps}
//                 >
//                   {/* <img className="treasureMap" src="/assets/tmap.png"></img> */}
//                   {/* Create four droppable placeholders within the map area */}
//                   {[...Array(4)].map((_, index) => (
//                     <Droppable droppableId={`droppable-placeholder-${index}`}>
//                       {(provided, snapshot) => (
//                         <div
//                           ref={provided.innerRef}
//                           {...provided.droppableProps}
//                           className="droppable-placeholder"
//                         >
//                           {provided.placeholder}
//                         </div>
//                       )}
//                     </Droppable>
//                   ))}
//                   {provided.placeholder}
//                 </div>
//               )}
//             </Droppable>
//           </DragDropContext>
//           <button className="createMyPath" onClick={handleCreateMyPathClick}>
//             Create my Path
//           </button>
//         </div>
//       </div>

//       <div className="backside">
//         {boundaryResults && boundaryResults.length > 0 && (
//           <div>
//             <div className="scroll-title">
//               <span>In your Area</span>
//             </div>
//             <DragDropContext
//               onDragEnd={onDragEnd}
//               onDragStart={onDragStart}
//               onDragUpdate={onDragUpdate}
//               onBeforeCapture={onBeforeCapture}
//             >
//               <Droppable droppableId="areaDroppable">
//                 {(provided, snapshot) => (
//                   <div
//                     ref={provided.innerRef}
//                     className="scroll-search-results"
//                     {...provided.droppableProps}
//                     {...provided.droppableProps}
//                   >
//                     {/* <ul>{boundaryResults.map(renderDraggable)}</ul> */}
//                     <ul>
//                       {boundaryResults.map((resource, index) => (
//                         <ResourceCard
//                           key={resource.id}
//                           resource={resource}
//                           index={index}
//                         />
//                       ))}
//                     </ul>

//                     {provided.placeholder}
//                   </div>
//                 )}
//               </Droppable>
//             </DragDropContext>
//           </div>
//         )}

//         {favorites && favorites[0] && (
//           <div>
//             <div className="scroll-title">
//               <span>Favorites</span>
//             </div>
//             <DragDropContext
//               onDragEnd={onDragEnd}
//               onDragStart={onDragStart}
//               onDragUpdate={onDragUpdate}
//               onBeforeCapture={onBeforeCapture}
//             >
//               <Droppable
//                 droppableId="selectedResourcesDroppable"
//                 direction="vertical"
//               >
//                 {(provided, snapshot) => (
//                   <div ref={provided.innerRef} {...provided.droppableProps}>
//                     <div
//                       className={`selected-resources ${
//                         snapshot.isDraggingOver ? "draggingOver" : ""
//                       }`}
//                     >
//                       {selectedResources.map((resource, index) =>
//                         renderSelectedResource(resource, index)
//                       )}
//                       {provided.placeholder}
//                     </div>
//                   </div>
//                 )}
//               </Droppable>
//             </DragDropContext>
//           </div>
//         )}
//       </div>

//       {isGeneratedMapModalOpen && (
//         <GeneratedTreasureMap
//           closeModal={() => setIsGeneratedMapModalOpen(false)}
//           selectedResources={selectedResources}
//         />
//       )}
//     </>
//   );
// };

// export default MapBack;
