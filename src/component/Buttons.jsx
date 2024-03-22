import React, { useRef, useState } from "react";
import Styles from "../styles/buttons.css";
import Button from "@mui/material/Button";
import EmailList from "./EmailList";

const Buttons = ({
  setAboutModalIsOpen,
  setContactModalIsOpen,
  setDonationModalIsOpen,
  // donationModalIsOpen,
  // aboutModalIsOpen,
  // contactModalIsOpen,
  setModalIsOpen,
}) => {
  return (
    <div className="footer-container">
      <div className="function-buttons">
        {/* <span
          className="nav-item"
          onClick={() => {
            setDonationModalIsOpen(false);
            setAboutModalIsOpen(true);
            setContactModalIsOpen(false);
          }}
        >
          ABOUT
        </span> */}

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
          {/* {String(aboutModalIsOpen)}
          {String(contactModalIsOpen)}
          {String(donationModalIsOpen)} */}
        </span>
      </div>
    </div>
  );
};

export default Buttons;
