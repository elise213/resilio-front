import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import imgLogo from "../assets/HDLOGOTRANSP.png";
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


  const index = props.id - 1
  const schedule2 = filterNonNullValues(props.schedule[index]);
  console.log("schedule 2", schedule2);

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

  { console.log("formatted sched", formattedSchedule); }

  return (
    <div className="offering-card m-4">
      <div className="map-carousel-column">

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
                src={props.image}
                className="d-block w-100 carousel-image"
                onError={(e) => {
                  e.target.src = ""
                }}

              />
            </div>
            {props.image2 != "" && (
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
          <SimpleMap2 latitude={props.latitude} longitude={props.longitude} />
        </div>


        <div className="details-column">
          {/* DESCRIPTION */}
          <div className="description-div fifty">
            <p className="resource-card-text description mt-3">{props.description}</p>
          </div>
          {/* ADDRESS */}
          <div className="fifty">
            <div className="info">
              <i className="fa-solid fa-map-location-dot me-4"></i>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(props.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="resource-card-text"
              >
                {props.address}
              </a>
            </div>
            {/* WEBSITE */}
            <div className="info">
              <i className="fa-solid fa-wifi me-4"></i>
              <a href={"https://www." + props.website} className="resource-card-text">{props.website}</a>
            </div>

            {/* SCHEDULE */}
            <div className="d-flex info">
              <i className="fa-solid fa-calendar-days me-4"></i>
              <div className="">
                {Object.entries(formattedSchedule).map(([day, schedule], index) => (
                  <p className="resource-card-text">{day.charAt(0).toUpperCase() + day.slice(1)}: {schedule}</p>
                ))}
              </div>
            </div>
            <p>
              Is there a problem with this information?
              <Link href="/contact">
                {" "}Let us know! </Link>
            </p>
          </div>
        </div>
      </div>
    </div >

  );
}
