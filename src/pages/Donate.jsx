import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/donate.css";

const Donate = () => {
  return (
    <>
      <div className="donation-page">
        <Link to="/" className="close-modal">
          Back to Search
        </Link>
        <div className="donation">
          <div className="iframe-container">
            <iframe
              title="Donation form powered by Zeffy"
              style={{
                position: "relative",
                overflow: "hidden",
                width: "100%",
                height: "1200px",
              }}
              src="https://www.zeffy.com/en-US/embed/donation-form/cc33bc68-a2e1-4fd3-a1c6-88afd0cae253"
              allowpaymentrequest
              allowtransparency="true"
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
};

export default Donate;
