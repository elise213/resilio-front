import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

const About = ({}) => {
  const { store, actions } = useContext(Context);
  return (
    <>
      <div className="new-modal">
        <p
          className="close-new-modal"
          onClick={() => actions.closeAboutModal()}
        >
          <span className="material-symbols-outlined">arrow_back_ios</span>
          Back to search
        </p>
        <div className="about-div">
          <p className="intro">Resilio is a 501(c)3 ...</p>
        </div>
      </div>
    </>
  );
};

export default About;
