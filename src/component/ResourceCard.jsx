import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import AddFave from "./AddFave";
import Modal from "./Modal"

export const ResourceCard = (props) => {
  const { store, actions } = useContext(Context);

  let icon = "";
  if (props.category == "health") {
    icon = "fa-solid fa-stethoscope";
  } else if (props.category == "food") {
    icon = "fa-solid fa-bowl-rice";
  } else if (props.category == "hygiene") {
    icon = "fa-solid fa-soap";
  } else {
    icon = "fa-solid fa-person-shelter";
  }

  return (
    <div className="resource-card row" onClick={() => openModal(props.id)}>
      <div className="">
        <div className="card-header">
          <div className="card-title-div">
            <p className="resource-card-title-name">{props.name}</p>
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <img className="card-img" src={props.image} alt="profile picture" />
        </div>
      </div>
      <div className="favorite-button-container">
        <AddFave
          name={props.name}
          type={props.type}
        />
        <div className="">
          <i className={`${icon} card-icon`} />
        </div>
      </div>
      {/* Button trigger modal */}
      <div className="more-button">
        <button
          type="button"
          className="btn learn-more"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          More
        </button>
      </div>

      <Modal resource={props.item} />
    </div>
  );
}


