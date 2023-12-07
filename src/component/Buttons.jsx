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
      <div>
        <div className="function-buttons">
          <Button
            className="customButton"
            variant="contained"
            startIcon={
              <i className="material-symbols-outlined">content_copy</i>
            }
            ref={toggleDeckButtonRef}
            onClick={() => toggleCardDeck()}
          >
            List
          </Button>

          <Button
            className="customButton"
            variant="contained"
            startIcon={<i className="material-symbols-outlined">filter_list</i>}
            ref={toggleToolButtonRef}
            onClick={() => {
              setIsToolBoxOpen(!isToolBoxOpen);
              console.log(isToolBoxOpen);
            }}
          >
            Filters
          </Button>
        </div>
        <p className={`the-plan`} onClick={() => setBackSide(!backSide)}>
          <span className="material-symbols-outlined">arrow_forward</span>
          {backSide ? "The Map" : "The Plan"}
        </p>
      </div>
    </>
  );
};

export default Buttons;
