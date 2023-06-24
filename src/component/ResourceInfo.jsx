import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import imgLogo from "/assets/HDLOGOTRANSP.png";
import { Context } from "../store/appContext";
import AddFave from "./AddFave";
import { SimpleMap2 } from "./SimpleMap2";


export const ResourceInfo = (props) => {
  const { store, actions } = useContext(Context);

  function filterNonNullValues(schedule) {
    const result = {};
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    daysOfWeek.forEach(day => {
      const startKey = `${day}Start`;
      const endKey = `${day}End`;
      if (schedule[startKey] !== null && schedule[endKey] !== null) {
        result[startKey] = schedule[startKey];
        result[endKey] = schedule[endKey];
      } else {
        result[startKey] = 'closed';
        result[endKey] = 'closed';
      }
    });
    return result;
  }

  function formatTime(time) {
    if (time === 'closed') {
      return 'closed';
    }
    if (!time) {
      return '';
    }

    const [hour, minute] = time.split(':');
    let formattedTime = time;

    if (parseInt(hour) > 12) {
      formattedTime = `${parseInt(hour) - 12}:${minute} p.m.`;
    } else {
      formattedTime = `${hour}:${minute} a.m.`;
    }
    return formattedTime;
  }


  const index = props.res.id - 1
  const schedule2 = filterNonNullValues(props.schedule[index]);
  // console.log("schedule 2", schedule2);

  const formattedSchedule = {};

  (schedule2 != undefined) ?
    Object.keys(schedule2).forEach(key => {
      const day = key.replace(/End|Start/g, ''); // Extract the day from the key
      const start = schedule2[`${day}Start`];
      const end = schedule2[`${day}End`];
      const formattedStart = formatTime(start);
      const formattedEnd = formatTime(end);
      formattedSchedule[day] = (start && end) && (formattedStart !== 'closed') ? `${formattedStart} - ${formattedEnd}` : 'Closed';
    }) : "";

  // { console.log("formatted sched", formattedSchedule); }

  return (
    <div className="offering-card m-4">
      <div className="carousel-description-div">

        {/* _______CAROUSEL_______ */}
        <div id="carouselExampleIndicators" className="carousel slide" data-bs-interval="false">
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="1"
              aria-label="Slide 4"
            ></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item carousel-frame active">
              <img
                src={props.res.image}
                className="d-block w-100 carousel-image"
                onError={(e) => {
                  e.target.src = ""
                }}

              />
            </div>
            {props.res.image2 != "" && (
              <div className="carousel-item carousel-frame">
                <img
                  src={props.image2}
                  className="d-block w-100 carousel-image"
                  onError={(e) => {
                    e.target.src = imgLogo
                  }}
                />
              </div>
            )}
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
        {/* DESCRIPTION */}
        <div className="description-div">
          <p className="resource-card-text description">{props.res.description}</p>
        </div>
      </div>

      <div className="info-map-div">

        <div className="details-div d-flex w-50">
          <div className="details-column">
            {/* ADDRESS */}
            <div className="info">
              <i className="fa-solid fa-map-pin me-4"></i>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(props.res.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="resource-card-text"
              >
                {props.res.address}
              </a>
            </div>
            {/* WEBSITE */}
            <div className="info">
              <i className="fa-solid fa-earth-americas me-4"></i>
              <a href={"https://www." + props.res.website} className="resource-card-text">{props.res.website}</a>
            </div>

            {/* SCHEDULE */}
            <div className="d-flex info">
              <i className="fa-solid fa-calendar-check me-4"></i>
              <div className="">
                {Object.entries(formattedSchedule).map(([day, schedule], index) => (
                  <p key={index} className="resource-card-text">{day.charAt(0).toUpperCase() + day.slice(1)}: {schedule}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* MAP */}
        <div className="modal-map">
          <SimpleMap2 latitude={props.res.latitude} longitude={props.res.longitude} />
        </div>
      </div>
    </div>
  );
}
