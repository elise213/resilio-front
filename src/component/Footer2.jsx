import React, { Component } from "react";
import { Link, useLocation } from "react-router-dom";
import AliveLogo from "/assets/RESILIOO.png";
import Insta from "/assets/insta.png";
import Twitter from "/assets/twitter.png";
import Login from "./Login";
import Styles from "../styles/footer.css";

const Footer2 = () => (
  <footer className="footer">
    {/* <img className="footer-logo" src={AliveLogo} alt="Resilio Logo" /> */}
    {/* <div className="socials">
      <img className="footer-insta" src={Insta} alt="Instagram Logo" />
      <img className="footer-twitter" src={Twitter} alt="Twitter Logo" />
    </div> */}
    <div className="foot">
      <p className="all-rights">©2023 RESILIO All Rights Reserved</p>
    </div>
  </footer>
);
export default Footer2;
