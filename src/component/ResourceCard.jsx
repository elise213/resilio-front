import React, { useState, useContext, useRef, useEffect } from "react";
import { Context } from "../store/appContext";
import Styles from "../styles/resourceCard.css";

const ResourceCard = (props) => {
  const { actions, store } = useContext(Context);

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
        <button className="add-favorite">Add to Favorites</button>
      </div>
    </div>
  );
};

export default ResourceCard;
