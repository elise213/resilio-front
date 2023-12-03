import React, { useRef, useState } from "react";
import Styles from "../styles/buttons.css";
import Button from "@mui/material/Button";

const Buttons = ({
  isDeckOpen,
  isNavOpen,
  isFavoritesOpen,
  isToolBoxOpen,
  setIsToolBoxOpen,
  toggleCardDeck,
  togglefavorites,
  backSide,
  setBackSide,
  toggleFavoritesButtonRef,
  toggleDeckButtonRef,
  toggleToolButtonRef,
  zipInput,
  handleZipInputChange,
}) => {
  return (
    <>
      <div className="function-buttons">
        <Button
          className="customButton"
          variant="contained"
          // startIcon={<i className="material-symbols-outlined">map</i>}
          startIcon={<i class="material-symbols-outlined">content_copy</i>}
          ref={toggleDeckButtonRef}
          onClick={() => toggleCardDeck()}
        >
          List
        </Button>

        <Button
          className="customButton"
          variant="contained"
          startIcon={<i class="material-symbols-outlined">filter_list</i>}
          ref={toggleToolButtonRef}
          onClick={() => {
            setIsToolBoxOpen(!isToolBoxOpen);
            console.log(isToolBoxOpen);
          }}
        >
          Filters
        </Button>
      </div>
    </>
  );
};

export default Buttons;
