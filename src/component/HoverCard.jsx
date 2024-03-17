import React from "react";
import Styles from "../styles/hoverCard.css";

const HoverCard = (props) => {
  return (
    <div className="hover-card" onClick={() => props.openModal(props.item)}>
      {/* <div className="hover-card-header"> */}
      <p className="hover-title">{props.item.name}</p>
      {/* </div> */}
    </div>
  );
};

export default HoverCard;
