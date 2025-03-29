import React, {
  useState,
  useContext,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { Context } from "../store/appContext";

const Donation = () => {
  const { store, actions } = useContext(Context);
  return (
    <div className="donation-modal">
      {/* <p
        className="close-new-modal"
        onClick={() => actions.closeDonationModal()}
      >
        <span className="material-symbols-outlined">arrow_back_ios</span>
        Back to search
      </p> */}
      <iframe
        title="Donation form powered by Zeffy"
        style={{
          position: "relative",
          overflow: "hidden",
          width: "100%",
          height: "1200px",
          marginTop: "50px",
        }}
        src="https://www.zeffy.com/en-US/embed/donation-form/cc33bc68-a2e1-4fd3-a1c6-88afd0cae253"
        allowpaymentrequest
        allowtransparency="true"
      ></iframe>
    </div>
  );
};

export default Donation;
