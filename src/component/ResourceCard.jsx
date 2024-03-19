import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import Styles from "../styles/resourceCard.css";
import Button from "@mui/material/Button";

const ResourceCard = (props) => {
  // const { actions, store } = useContext(Context);

  const [isFavorited, setIsFavorited] = useState(false);

  // const handleSelectResource = (resource) => {
  //   props.addSelectedResource(resource);
  // };

  // const handleDeselectResource = (resourceId) => {
  //   props.removeSelectedResource(resourceId);
  // };

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

  return (
    <div
      className="my-resource-card"
      onClick={() => props.openModal(props.item)}
    >
      <div className="resource-card-header">
        <p className="resource-title">{props.item.name}</p>
      </div>
      {props.item.image && (
        <img
          className="card-img"
          src={props.item.image}
          alt="profile picture"
        />
      )}
      <div className="card-description">
        <span>
          {(props.item.description || "").length > 80
            ? `${(props.item.description || "").slice(0, 80)}...`
            : props.item.description}
        </span>
      </div>
    </div>
  );
};

export default ResourceCard;
