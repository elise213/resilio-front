import React from 'react'
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import Layout from "./layout";

window.initMap = function () {
  console.log("Google Maps API loaded");
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <Layout />
)
