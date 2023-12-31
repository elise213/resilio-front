import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import Styles from "../styles/resourceCard.css";
import Button from "@mui/material/Button";

const ResourceCard = (props) => {
  const { actions, store } = useContext(Context);

  const [isFavorited, setIsFavorited] = useState(false);

  const handleSelectResource = (resource) => {
    props.addSelectedResource(resource);
  };

  const handleDeselectResource = (resourceId) => {
    props.removeSelectedResource(resourceId);
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
    setIsFavorited(!isFavorited);

    if (isFavorited) {
      actions.removeFavorite(props.item.name, props.setFavorites);
    } else {
      actions.addFavorite(props.item.name, props.setFavorites);
    }
  };

  const isSelected =
    Array.isArray(props.selectedResources) &&
    props.selectedResources.some((resource) => resource.id === props.item.id);

  const handleToggleSelectResource = (event) => {
    event.stopPropagation();
    console.log("hnadleToggleSelectR");
    if (isSelected) {
      handleDeselectResource(props.item.id);
    } else {
      handleSelectResource(props.item);
    }
  };

  return (
    <div
      className="my-resource-card"
      onClick={() => props.openModal(props.item)}
    >
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
      <div className="resource-card-header">
        <p className="resource-title">{props.item.name}</p>
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
      <div className="button-container">
        {store.token && (
          <button
            className="add-favorite"
            onClick={(event) => toggleFavorite(event)}
          >
            {isFavorited ? (
              <i className="fa-solid fa-heart" style={{ color: "red" }}></i>
            ) : (
              <i className="fa-regular fa-heart"></i>
            )}
          </button>
        )}

        <Button
          variant="contained"
          color="primary"
          // startIcon={
          //   isSelected ? (
          //     <i className="material-symbols-outlined">cancel</i>
          //   ) : (
          //     <i className="material-symbols-outlined">add</i>
          //   )
          // }
          className={isSelected ? "remove-path" : "add-path"}
          onClick={handleToggleSelectResource}
        >
          {isSelected ? "remove from plan" : "add to plan"}
        </Button>
      </div>
    </div>
  );
};

export default ResourceCard;
