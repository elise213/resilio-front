import React, { Component } from "react";
import { Link, useLocation } from "react-router-dom";
import AliveLogo from "/assets/RESILIOO.png"

export const Footer = () => (
  <footer className="footer">
    <div>
      <Link to="/create">
        <span className="footer-create-link" >
          Create a new resource listing
        </span>
      </Link>
    </div>
  </footer>
);
