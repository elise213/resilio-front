import React, { useRef, useState } from "react";
import Styles from "../styles/buttons.css";
import Button from "@mui/material/Button";
import EmailList from "./EmailList";

const Buttons = ({
  setAboutModalIsOpen,
  setContactModalIsOpen,
  setDonationModalIsOpen,
  setModalIsOpen,
}) => {
  return (
    <div className="footer-container">
      <div className="function-buttons">
        <span
          className="nav-item"
          onClick={() => {
            setDonationModalIsOpen(false);
            setContactModalIsOpen(true);
            setAboutModalIsOpen(false);
          }}
        >
          CONTACT
        </span>

        <span
          className="nav-item"
          onClick={() => {
            console.log("donate called");
            setAboutModalIsOpen(false);
            setDonationModalIsOpen(true);
            setContactModalIsOpen(false);
            setModalIsOpen(false);
          }}
        >
          DONATE
        </span>
      </div>
    </div>
  );
};

export default Buttons;
