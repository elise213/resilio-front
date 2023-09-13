import React, { Component } from "react";
import { Link, useLocation } from "react-router-dom";
import AliveLogo from "/assets/RESILIOO.png"
import Insta from "/assets/insta.png"
import Twitter from "/assets/twitter.png"

export const Footer = () => (
  <footer className="footer">
    <img className="footer-logo" src={AliveLogo} alt="Resilio Logo" />
    {/* <div className="socials">
      <img className="footer-insta" src={Insta} alt="Instagram Logo" />
      <img className="footer-twitter" src={Twitter} alt="Twitter Logo" />
    </div> */}
    <div className="legal">
      {/* <div className="foot">
        <p className="all-rights">
          Privacy Policy
          </p>
          </div> */}
      <div className="foot">
        <p className="all-rights">
          ©2023 Resilio All Rights Reserved</p>
      </div>
    </div>
  </footer >
);
