import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ResourceCard from "./ResourceCard";
import GeneratedTreasureMap from "./GeneratedTreasureMap";

const DRAGGABLE_ITEM_CLASS = "draggable-item";

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
  isGeneratedMapModalOpen,
  setIsGeneratedMapModalOpen,
}) => {
  const {
    actions,
    store: { boundaryResults },
  } = useContext(Context);

  const [selectedResources, setSelectedResources] = useState(() => {
    // Get the initial state from sessionStorage or default to an empty array
    const storedResources = sessionStorage.getItem("selectedResources");
    return storedResources ? JSON.parse(storedResources) : [];
  });

  const onBeforeCapture = (start) => {
    setDraggingItem(start.draggableId);
  };

  const handleCreateMyPathClick = () => {
    setIsGeneratedMapModalOpen(true);
  };

  const setSelectedResourcesEvent = new Event("setSelectedResources");

  const addSelectedResource = (resource) => {
    setSelectedResources((prevResources) => {
      if (!prevResources.find((r) => r.id === resource.id)) {
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

  // Function to remove a resource from the selected resources
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

  useEffect(() => {
    const handleSetSelectedResources = () => {
      const storedResources = actions.getSessionSelectedResources();
      setSelectedResources(storedResources);
    };

    document.addEventListener(
      "setSelectedResources",
      handleSetSelectedResources
    );

    // Don't forget to remove the event listener on component unmount
    return () => {
      document.removeEventListener(
        "setSelectedResources",
        handleSetSelectedResources
      );
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

  const renderDraggable = (result, index) => {
    if (!result || result.id == null) {
      console.error(
        "Error: result is undefined or does not have an id",
        result
      );
      return null;
    }
    return (
      <Draggable
        key={`draggable-${result.id}`}
        draggableId={`draggable-${result.id.toString()}`}
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
              addSelectedResource={addSelectedResource}
            />
          </li>
        )}
      </Draggable>
    );
  };

  useEffect(() => {
    console.log(selectedResources);
  }, [selectedResources]);

  useEffect(() => {
    const storedResources = actions.getSessionSelectedResources();
    if (JSON.stringify(storedResources) !== JSON.stringify(selectedResources)) {
      // If they are not equal, update the context
      setSelectedResources(storedResources);
    }
  }, []);

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
            selectedResources={selectedResources}
          />
        )}

        {boundaryResults && boundaryResults.length > 0 && (
          <DragDropContext
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
            onDragUpdate={onDragUpdate}
            onBeforeCapture={onBeforeCapture}
          >
            <Droppable droppableId="areaDroppable">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  className="scroll-search-results"
                  {...provided.droppableProps}
                  {...provided.droppableProps}
                >
                  <ul>{boundaryResults.map(renderDraggable)}</ul>

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>

      <div className="treasureMapDiv">
        <DragDropContext
          onDragEnd={onDragEnd}
          onDragStart={onDragStart}
          onDragUpdate={onDragUpdate}
          onBeforeCapture={onBeforeCapture}
        >
          <Droppable droppableId="mapAreaDroppable">
            {(provided, snapshot) => (
              <div
                className={`${DRAGGABLE_ITEM_CLASS} ${
                  snapshot.isDragging ? "dragging" : ""
                }`}
                ref={provided.innerRef}
                {...provided.droppableProps}
                {...provided.dragHandleProps}
              >
                <img className="treasureMap" src="/assets/tmap.png"></img>
                <ul className="ul">{selectedResources.map(renderDraggable)}</ul>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <button className="createMyPath" onClick={handleCreateMyPathClick}>
          Create my Path
        </button>
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
