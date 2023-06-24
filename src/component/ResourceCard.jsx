import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import AddFave from "./AddFave";
import Modal from "./Modal"

export const ResourceCard = (props) => {
  const { store, actions } = useContext(Context);

  let icon = "";
  if (props.item.category == "health") {
    icon = "fa-solid fa-stethoscope";
  } else if (props.item.category == "food") {
    icon = "fa-solid fa-bowl-rice";
  } else if (props.item.category == "hygiene") {
    icon = "fa-solid fa-soap";
  } else {
    icon = "fa-solid fa-person-shelter";
  }

  return (
    <div className="resource-card row"
      data-bs-toggle="modal"
      data-bs-target={"#exampleModal" + props.item.id} >
      <div className="">
        <div className="card-header">
          <div className="card-title-div">
            <p className="resource-card-title-name">{props.item.name}</p>
            <div className="">
              <i className={`${icon} card-icon m-2`} />
            </div>
          </div>
        </div>
        <div className="card-image-container">
          <img className="card-img" src={props.item.image} alt="profile picture" />
        </div>
      </div>

      {/* Button trigger modal */}
      <Modal resource={props.item} id={props.item.id} />
    </div>
  );
}


