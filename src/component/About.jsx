import React from "react";

const About = ({ setAboutModalIsOpen }) => {
  return (
    <>
      <div className="new-modal">
        <p
          className="close-new-modal"
          onClick={() => setAboutModalIsOpen(false)}
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
