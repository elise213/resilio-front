import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import Styles from "../styles/resourceCard.css";

const ResourceCard = (props) => {
  const { actions, store } = useContext(Context);
  const selectedResources = props.selectedResources || [];
  const [isFavorited, setIsFavorited] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    const sessionSelectedResources = actions.getSessionSelectedResources();
    setIsSelected(sessionSelectedResources.some((r) => r.id === props.item.id));
  }, [props.item.id, actions]);

  const handleSelectResource = (resource) => {
    actions.addSelectedResource(resource);
    setIsSelected(true); // Update state to reflect the new selection
  };

  const handleDeselectResource = (resourceId) => {
    actions.removeSelectedResource(resourceId);
    setIsSelected(false); // Update state to reflect the item removal
  };

  const handleToggleSelectResource = (event) => {
    event.stopPropagation(); // Prevent the card's onClick from firing
    if (isSelected) {
      handleDeselectResource(props.item.id);
    } else {
      handleSelectResource(props.item);
    }
  };

  useEffect(() => {
    const storedFavorites = JSON.parse(
      sessionStorage.getItem("favorites") || "[]"
    );
    const isItemFavorited = storedFavorites.some(
      (favorite) => favorite.name === props.item.name
    );
    setIsFavorited(isItemFavorited);
  }, []);

  useEffect(() => {
    if (props.modalIsOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [props.modalIsOpen]);

  let categories = props.item.category;
  if (typeof categories === "string" && categories.includes(",")) {
    categories = categories.split(",").map((cat) => cat.trim());
  } else if (typeof categories === "string") {
    categories = [categories];
  } else if (!Array.isArray(categories)) {
    categories = [];
  }

  const toggleFavorite = (event) => {
    event.stopPropagation();

    // Toggle the isFavorited state immediately
    setIsFavorited(!isFavorited);

    if (isFavorited) {
      actions.removeFavorite(props.item.name, props.setFavorites);
    } else {
      actions.addFavorite(props.item.name, props.setFavorites);
    }
  };

  return (
    <div
      className="my-resource-card"
      onClick={() => props.openModal(props.item)}
    >
      <div className="">
        <div className="resource-card-header">
          <div className="card-title-div">
            <p className="resource-title">{props.item.name}</p>
          </div>
        </div>
        {props.item.image && (
          <div className="card-image-container">
            <img
              className="card-img"
              src={props.item.image}
              alt="profile picture"
            />
          </div>
        )}
        <div className="icons-container">
          {categories.map((category, index) => {
            const colorStyle = actions.getColorForCategory(category);
            return (
              <i
                key={index}
                className={`card-icon ${actions.getIconForCategory(category)}`}
                style={colorStyle ? colorStyle : {}}
              />
            );
          })}
        </div>
        <button
          className="add-favorite"
          onClick={(event) => toggleFavorite(event)}
        >
          {isFavorited ? "Remove from Favorites" : "Add to Favorites"}
        </button>

        <button
          className="toggle-selected"
          onClick={handleToggleSelectResource}
        >
          {isSelected ? "Remove from Selected" : "Add to Selected"}
        </button>
      </div>
    </div>
  );
};

export default ResourceCard;
