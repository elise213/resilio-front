import React, { useContext, useState, useEffect } from "react";
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
    <div className="resource-card row" >
      <div className="">
        <div className="card-header">
          <div className="card-title-div">
            <p className="resource-card-title-name">{props.name}</p>
            <div className="">
              <i className={`${icon} card-icon m-2`} />
            </div>
          </div>
        </div>
        <div className="card-image-container">
          <img className="card-img" src={props.image} alt="profile picture" />
        </div>

      </div>
      <div className="favorite-button-container">
        {/* <AddFave
          name={props.name}
          type={props.type}
        /> */}
        <div className="more-button">
          <button
            type="button"
            className="btn learn-more"
            data-bs-toggle="modal"
            data-bs-target={"#exampleModal" + props.id}
          >
            Learn More
          </button>
        </div>
      </div>
      {/* Button trigger modal */}
      <Modal resource={props.item} id={props.id} />
    </div>
  );
}


