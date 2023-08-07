import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { SimpleMap2 } from "./SimpleMap2";
import arrow from "/assets/coralarrow.png";


export const ResourceInfo = (props) => {
  const { store, actions } = useContext(Context);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // State to track the current image
  const images = [
    props.res.image,
    props.res.image2,
    props.res.image3,
    props.res.image4,
    props.res.image5
  ].filter(Boolean); // This will remove any undefined or null values, giving us only the existing images

  console.log("IMAGES", images)

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

  function shiftLeft() {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else {
      setCurrentImageIndex(images.length - 1); // wrap around to the last image
    }
  }

  function shiftRight() {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      setCurrentImageIndex(0); // wrap around to the first image
    }
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

  return (
    <div className="offering-card">
      <div className="carousel-description-div">

        {/* _______CAROUSEL_______ */}

        <div className='carousel'>
          {images.length > 1 && (
            <button className="arrow-button" onClick={shiftLeft}>
              <img className="left-arrow" src={arrow}></img>
            </button>
          )}
          <img className="carousel-image" src={images[currentImageIndex]} alt="" />
          {images.length > 1 && (
            <button className="arrow-button" onClick={shiftRight}>
              <img className="right-arrow" src={arrow}></img>
            </button>
          )}
        </div>

        {/* DESCRIPTION */}
        <div className="description-div">
          <p className="resource-card-text description">{props.res.description}</p>
        </div>
      </div>

      <div className="info-map-div">

        <div className="details-div">
          <div className="details-column">
            {/* ADDRESS */}
            <div className="info">
              <i className="fa-solid fa-map-pin"></i>
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
              <i className="fa-solid fa-earth-americas"></i>
              <a href={"https://www." + props.res.website} className="resource-card-text">{props.res.website}</a>
            </div>

            {/* SCHEDULE */}
            <div className="d-flex info">
              <i className="fa-solid fa-calendar-check"></i>
              <div className="sched-div">
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
