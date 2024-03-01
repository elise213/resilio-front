import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
// import arrow from "/assets/coralarrow.png";
import arrow from "/assets/coralarrow.png";
import styles from "../styles/resourceModal.css";

const Carousel = ({ res }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    res.image,
    res.image2,
    res.image3,
    res.image4,
    res.image5,
  ].filter(Boolean);

  // function changeImage(newIndex) {
  //   const imageElement = document.querySelector(".carousel-image");
  //   imageElement.style.opacity = "0";

  //   setTimeout(() => {
  //     setCurrentImageIndex(newIndex);
  //     imageElement.style.opacity = "1";
  //   }, 300);
  // }

  function changeImage(newIndex) {
    // const imageElement = document.querySelector(".carousel-image");
    // imageElement.style.opacity = "0";

    // setTimeout(() => {
    setCurrentImageIndex(newIndex);
    // imageElement.style.opacity = "1";
    // }, 300);
  }

  function shiftLeft() {
    let newIndex =
      currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
    changeImage(newIndex);
  }

  function shiftRight() {
    let newIndex =
      currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
    changeImage(newIndex);
  }

  return (
    <>
      {images.length > 0 && (
        <div className="carousel-container">
          {images.length > 1 && (
            <button
              className="arrow-button"
              onClick={() => {
                shiftLeft;
              }}
            >
              <img className="left-arrow" src={arrow}></img>
            </button>
          )}

          <div className="carousel">
            <img
              className="carousel-image"
              src={images[currentImageIndex]}
              alt=""
            />
          </div>

          {images.length > 1 && (
            <button
              className="arrow-button"
              onClick={() => {
                shiftRight;
              }}
            >
              <img className="right-arrow" src={arrow}></img>
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default Carousel;
