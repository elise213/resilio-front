import React, { useRef } from "react";
import styles from "../styles/mapSettings2.css";
import Buttons from "./Buttons";

const MapSettings = ({
  toggleFavoritesButtonRef,
  toggleToolButtonRef,
  toggleDeckButtonRef,
  handleZipInputChange,
  zipInput,
  geoFindMe,
  backSide,
  setBackSide,
  toggleNav,
  isFavoritesOpen,
  setIsFavoritesOpen,
  isToolBoxOpen,
  setIsToolBoxOpen,
  isNavOpen,
  isDeckOpen,
  setIsDeckOpen,
  togglefavorites,
  toggleCardDeck,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE;

  return (
    <div className="map-settings">
      <div className="map-settings-buttons">
        <Buttons
          zipInput={zipInput}
          handleZipInputChange={handleZipInputChange}
          backSide={backSide}
          setBackSide={setBackSide}
          isDeckOpen={isDeckOpen}
          setIsDeckOpen={setIsDeckOpen}
          isNavOpen={isNavOpen}
          isFavoritesOpen={isFavoritesOpen}
          setIsFavoritesOpen={setIsFavoritesOpen}
          isToolBoxOpen={isToolBoxOpen}
          toggleCardDeck={toggleCardDeck}
          togglefavorites={togglefavorites}
          toggleFavoritesButtonRef={toggleFavoritesButtonRef}
          toggleDeckButtonRef={toggleDeckButtonRef}
          toggleToolButtonRef={toggleToolButtonRef}
          setIsToolBoxOpen={setIsToolBoxOpen}
        />
      </div>
    </div>
  );
};

export default MapSettings;
