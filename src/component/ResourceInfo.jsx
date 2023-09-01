import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { SimpleMap2 } from "./SimpleMap2";
import arrow from "/assets/coralarrow.png";

export const ResourceInfo = (props) => {
  const { store, actions } = useContext(Context);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    props.res.image,
    props.res.image2,
    props.res.image3,
    props.res.image4,
    props.res.image5
  ].filter(Boolean);

  const res = props.res || {};

  function filterNonNullValues(schedule) {
    const result = {};
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    daysOfWeek.forEach(day => {
      if (!schedule) return;
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

  function changeImage(newIndex) {
    const imageElement = document.querySelector('.carousel-image');
    imageElement.style.opacity = '0';

    setTimeout(() => {
      setCurrentImageIndex(newIndex);
      imageElement.style.opacity = '1';
    }, 500); // This duration should match the transition duration in the CSS
  }

  function shiftLeft() {
    let newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
    changeImage(newIndex);
  }

  function shiftRight() {
    let newIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
    changeImage(newIndex);
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

  const currentSchedule = store.schedules.find(each => each.resource_id === props.id) || null
  const schedule2 = filterNonNullValues(currentSchedule);
  const formattedSchedule = {};

  (schedule2 != undefined) ?
    Object.keys(schedule2).forEach(key => {
      const day = key.replace(/End|Start/g, '');
      const start = schedule2[`${day}Start`];
      const end = schedule2[`${day}End`];
      const formattedStart = formatTime(start);
      const formattedEnd = formatTime(end);
      formattedSchedule[day] = (start && end) && (formattedStart !== 'closed') ? `${formattedStart} - ${formattedEnd}` : 'Closed';
    }) : "";

  return (
    <div className="">
      <div className='carousel-container'>

        {images.length > 1 && (
          <button className="arrow-button" onClick={shiftLeft}>
            <img className="left-arrow" src={arrow}></img>
          </button>
        )}

        <div className='carousel'>
          <img className="carousel-image" src={images[currentImageIndex]} alt="" />
        </div>

        {images.length > 1 && (
          <button className="arrow-button" onClick={shiftRight}>
            <img className="right-arrow" src={arrow}></img>
          </button>
        )}

      </div>

      {/* DESCRIPTION */}
      {res.description && (
        <div className="description-div">
          <p className="resource-card-text description">{res.description}</p>
        </div>
      )}

      <div className="info-map-div">
        <div className="details-div">
          <div className="details-column">
            {/* ADDRESS */}
            {res.address && (
              <div className="info">
                <i className="fa-solid fa-map-pin"></i>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(res.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resource-card-text"
                >
                  {res.address}
                </a>
              </div>
            )}
            {/* WEBSITE */}
            {res.website && (
              <div className="info">
                <i className="fa-solid fa-earth-americas"></i>
                <a href={`https://www.${res.website}`} className="resource-card-text">{res.website}</a>
              </div>
            )}

            {/* SCHEDULE */}
            {Object.keys(formattedSchedule).length > 0 && (
              <div className="d-flex info">
                <i className="fa-solid fa-calendar-check"></i>
                <div className="sched-div">
                  {Object.entries(formattedSchedule).map(([day, schedule], index) => (
                    <p key={index} className="resource-card-text" style={{ color: schedule !== 'Closed' ? 'green' : 'inherit' }}>
                      {day.charAt(0).toUpperCase() + day.slice(1)}: {schedule}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* MAP */}
        {res.latitude && res.longitude && (
          <div className="modal-map">
            <SimpleMap2 latitude={res.latitude} longitude={res.longitude} />
          </div>
        )}
      </div>
    </div >
  );
}
