import React, { useRef, useState } from "react";
import Styles from "../styles/buttons.css";
import Button from "@mui/material/Button";
import EmailList from "./EmailList";

const Buttons = ({
  setAboutModalIsOpen,
  setShowContactModal,
  setDonationModalIsOpen,
}) => {
  return (
    <div className="footer-container">
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
      </div>
      <div className="foot">
        <p className="all-rights">2024 ©Resilio, All Rights Reserved</p>
      </div>
    </div>
  );
};

export default Buttons;
