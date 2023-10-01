import React from "react";
import Styes from "../styles/loading.css";

const Loading = ({ name }) => {
  return (
    <div className="my-resource-card loading">
      <div className="resource-card-header">
        {name === "locating" ? (
          <p className="loading-text">
            <i className="fa-solid fa-bullseye"></i>
            Finding Your Location...
          </p>
        ) : (
          ""
        )}
        {name === "loading" ? (
          <p className="loading-text">Loading Resources...</p>
        ) : (
          ""
        )}
        {name === "none" ? <p className="loading-text">No Results </p> : ""}
      </div>
    </div>
  );
};

export default Loading;
