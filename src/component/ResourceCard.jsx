import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import AddFave from "./AddFave";

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

  // let image = "";
  // if (props.image == "") {
  //   image = { AliveLogo };
  // } else {
  //   image = props.image;
  // }

  return (
    <div className="resource-card row">
      <div className="">
        <Link to={props.link} className="text-decoration-none">
          <div className="card-header">
            <div className="card-title-div">
              <p className="resource-card-title-name">{props.name}</p>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <img className="card-img" src={props.image} alt="profile picture" />
          </div>
        </Link>
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
    </div>
  );
}


