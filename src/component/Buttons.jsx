import React, { useRef, useState } from "react";
import Styles from "../styles/buttons.css";
import Button from "@mui/material/Button";
import EmailList from "./EmailList";

const Buttons = ({
  backSide,
  setBackSide,
  setIsNavOpen,
  setAboutModalIsOpen,
  toggleToolButtonRef,
  setIsToolBoxOpen,
  isToolBoxOpen,
  setShowContactModal,
  setDonationModalIsOpen,
}) => {
  return (
    <>
      {/* <div> */}
      <div className="function-buttons">
        <span
          className="nav-item"
          onClick={() => {
            setDonationModalIsOpen(false);
            setAboutModalIsOpen(true);
            setShowContactModal(false);
          }}
        >
          ABOUT
        </span>

        <span
          className="nav-item"
          onClick={() => {
            setDonationModalIsOpen(false);
            setShowContactModal(true);
            setAboutModalIsOpen(false);
          }}
        >
          CONTACT
        </span>

        <span
          className="nav-item"
          onClick={() => {
            setAboutModalIsOpen(false);
            setDonationModalIsOpen(true);
            setShowContactModal(false);
          }}
        >
          DONATE
        </span>

        {/* <EmailList /> */}
        {/* <Button
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
          </Button> */}
      </div>
      {/* <p className={`the-plan`} onClick={() => setBackSide(!backSide)}>
          <span className="material-symbols-outlined">arrow_forward</span>
          {backSide ? "The Map" : "The Plan"}
        </p> */}
      {/* </div> */}
    </>
  );
};

export default Buttons;
