import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
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

  function changeImage(newIndex) {
    setCurrentImageIndex(newIndex);
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
        <img
          className="carousel-image"
          src={images[currentImageIndex]}
          alt=""
        />
      )}
    </>
  );
};

export default Carousel;
