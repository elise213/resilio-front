// GET https://api.211.org/resources/v1/api/Services/{service_id}/service-area/{service_area_id}

// PUT THIS BACK INTO SIMPLEMAP!
// const createMapOptions = () => {
//     return {
//       styles: [
//         {
//           featureType: "all",
//           elementType: "geometry",
//           stylers: [{ lightness: -5 }, { gamma: 0.8 }, { saturation: -30 }],
//         },
//         {
//           featureType: "poi",
//           elementType: "labels",
//           stylers: [{ visibility: "off" }],
//         },
//         {
//           featureType: "poi.business",
//           stylers: [{ visibility: "off" }],
//         },
//         {
//           featureType: "transit",
//           elementType: "labels.icon",
//           stylers: [{ visibility: "off" }],
//         },
//         {
//           featureType: "road",
//           elementType: "labels.icon",
//           stylers: [{ visibility: "off" }],
//         },
//         {
//           featureType: "road",
//           elementType: "labels.text.fill",
//           stylers: [{ visibility: "off" }],
//         },

//         {
//           featureType: "administrative.locality",
//           elementType: "labels",
//           stylers: [{ visibility: "off" }],
//         },
//         {
//           featureType: "administrative.neighborhood",
//           elementType: "labels.text.stroke",
//           stylers: [{ visibility: "off" }],
//         },
//         {
//           featureType: "administrative.neighborhood",
//           elementType: "labels.text.fill",
//           stylers: [{ visibility: "off" }],
//         },
//         {
//           featureType: "water",
//           elementType: "labels",
//           stylers: [{ visibility: "off" }],
//         },
//       ],
//     };
//   };

// {favorites && favorites.length > 0 && (
//     <DragDropContext
//       onDragEnd={onDragEnd}
//       onDragStart={onDragStart}
//       onDragUpdate={onDragUpdate}
//       onBeforeCapture={onBeforeCapture}
//     >
//       <Droppable droppableId="favoritesDroppable">
//         {(provided) => (
//           <div
//             className="scroll-search-results"
//             ref={provided.innerRef}
//             {...provided.droppableProps}
//           >
//             <ul>
//               {favorites.map((result, index) => (
//                 <Draggable
//                   key={result.id}
//                   draggableId={result.id.toString()}
//                   index={index}
//                 >
//                   {(provided) => (
//                     <li
//                       ref={provided.innerRef}
//                       {...provided.draggableProps}
//                       {...provided.dragHandleProps}
//                     >
//                       <ResourceCard
//                         item={result}
//                         openModal={openModal}
//                         closeModal={closeModal}
//                         modalIsOpen={modalIsOpen}
//                         setModalIsOpen={setModalIsOpen}
//                         selectedResource={selectedResource}
//                         setFavorites={setFavorites}
//                       />
//                     </li>
//                   )}
//                 </Draggable>
//               ))}
//               {provided.placeholder}
//             </ul>
//           </div>
//         )}
//       </Droppable>
//     </DragDropContext>
//   )}

// MapBack

{
  /* <button
className="flip-button"
onClick={() => setBackSide(!backSide)}
>
Flip The Map
</button>

<div className="backside">
{hoveredItem && !backSide && (
  <ResourceCard
    item={hoveredItem}
    openModal={openModal}
    closeModal={closeModal}
    modalIsOpen={modalIsOpen}
    setModalIsOpen={setModalIsOpen}
    selectedResource={selectedResource}
    setFavorites={setFavorites}
  />
)}

{/* favorites goes here from scraps */
}

// {store.boundaryResults && store.boundaryResults.length > 0 && (
//   <DragDropContext
//     onDragEnd={onDragEnd}
//     onDragStart={onDragStart}
//     onDragUpdate={onDragUpdate}
//     onBeforeCapture={onBeforeCapture}
//   >
//     <Droppable droppableId="areaDroppable">
//       {(provided) => (
//         <div
//           className="scroll-search-results"
//           ref={provided.innerRef}
//           {...provided.droppableProps}
//         >
//           <ul>
//             {store.boundaryResults.map((result, index) => (
//               <Draggable
//                 key={result.id}
//                 draggableId={result.id.toString()}
//                 index={index}
//               >
//                 {(provided) => (
//                   <li
//                     ref={provided.innerRef}
//                     {...provided.draggableProps}
//                     {...provided.dragHandleProps}
//                   >
//                     <ResourceCard
//                       item={result}
//                       openModal={openModal}
//                       closeModal={closeModal}
//                       modalIsOpen={modalIsOpen}
//                       setModalIsOpen={setModalIsOpen}
//                       selectedResource={selectedResource}
//                       setFavorites={setFavorites}
//                     />
//                   </li>
//                 )}
//               </Draggable>
//             ))}
//             {provided.placeholder}
//           </ul>
//         </div>
//       )}
//     </Droppable>
//   </DragDropContext>
// )}
// // </div>

// <div className="treasureMapDiv">
// {/* <img className="treasureMap" src="/assets/tmap.png"></img> */}
// <DragDropContext
//   onDragEnd={onDragEnd}
//   onDragStart={onDragStart}
//   onDragUpdate={onDragUpdate}
//   onBeforeCapture={onBeforeCapture}
// >
//   <Droppable droppableId="mapAreaDroppable">
//     {(provided, snapshot) => (
//       <div
//         className={`droppable-map-area ${
//           snapshot.isDragging
//             ? "draggable-item dragging"
//             : "draggable-item"
//         }`} // 'dragging' className when item is being dragged
//     //     ref={provided.innerRef}
//     //     {...provided.droppableProps}
//     //     {...provided.dragHandleProps}
//     //   >
//     //     <img className="treasureMap" src="/assets/tmap.png"></img>
//         {/* Here you can also render the ResourceCards that are currently on the map */}
//         {/* ... possibly mapping over selectedResources that should be on the map ... */}
//         {/* {provided.placeholder}
//       </div>
//     )}
//   </Droppable>
// </DragDropContext>
// <button className="createMyPath">Create my Path</button>
// </div> */}
