import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ResourceCard from "./ResourceCard";

const MapBack = ({
  hoveredItem,
  openModal,
  closeModal,
  modalIsOpen,
  setModalIsOpen,
  selectedResource,
  setFavorites,
  onDragEnd,
  onDragStart,
  onDragUpdate,
  setBackSide,
  backSide,
  setDraggingItem,
  selectedResources,
  setSelectedResources,
}) => {
  const { actions, store } = useContext(Context);

  const onBeforeCapture = (start) => {
    setDraggingItem(start.draggableId);
  };

  return (
    <>
      <button className="flip-button" onClick={() => setBackSide(!backSide)}>
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
            handleSelectResource={handleSelectResource}
            handleDeselectResource={handleDeselectResource}
            selectedResources={selectedResources}
          />
        )}

        {/* favorites goes here from scraps */}

        {store.boundaryResults && store.boundaryResults.length > 0 && (
          <DragDropContext
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
            onDragUpdate={onDragUpdate}
            onBeforeCapture={onBeforeCapture}
          >
            <Droppable droppableId="areaDroppable">
              {(provided) => (
                <div
                  className="scroll-search-results"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <ul>
                    {store.boundaryResults.map((result, index) => {
                      // Check if the id is null, undefined, or not set
                      if (result.id === undefined || result.id === null) {
                        console.error(
                          "Error: result does not have an id",
                          result
                        );
                        return null; // Skip rendering this item
                      }
                      return (
                        <Draggable
                          key={result.id}
                          draggableId={result.id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <ResourceCard
                                item={result}
                                openModal={openModal}
                                closeModal={closeModal}
                                modalIsOpen={modalIsOpen}
                                setModalIsOpen={setModalIsOpen}
                                selectedResource={selectedResource}
                                setFavorites={setFavorites}
                                selectedResources={selectedResources}
                              />
                            </li>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </ul>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>

      <div className="treasureMapDiv">
        {/* <img className="treasureMap" src="/assets/tmap.png"></img> */}
        <DragDropContext
          onDragEnd={onDragEnd}
          onDragStart={onDragStart}
          onDragUpdate={onDragUpdate}
          onBeforeCapture={onBeforeCapture}
        >
          <Droppable droppableId="mapAreaDroppable">
            {(provided, snapshot) => (
              <div
                className={`droppable-map-area ${
                  snapshot.isDragging
                    ? "draggable-item dragging"
                    : "draggable-item"
                }`} // 'dragging' className when item is being dragged
                ref={provided.innerRef}
                {...provided.droppableProps}
                {...provided.dragHandleProps}
              >
                <img className="treasureMap" src="/assets/tmap.png"></img>
                {/* <div> */}
                <ul className="ul">
                  {store.selectedResources.map((result, index) => {
                    if (!result || result.id == null) {
                      console.error(
                        "Error: result is undefined or does not have an id",
                        result
                      );
                      return null;
                    }
                    return (
                      <Draggable
                        key={result.id}
                        draggableId={result.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <ResourceCard
                              item={result}
                              openModal={openModal}
                              closeModal={closeModal}
                              modalIsOpen={modalIsOpen}
                              setModalIsOpen={setModalIsOpen}
                              selectedResource={selectedResource}
                              setFavorites={setFavorites}
                              selectedResources={selectedResources}
                            />
                          </li>
                        )}
                      </Draggable>
                    );
                  })}
                </ul>
                {/* </div> */}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <button className="createMyPath">Create my Path</button>
      </div>
    </>
  );
};

export default MapBack;
