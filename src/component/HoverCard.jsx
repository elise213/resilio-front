import React from "react";
import Styles from "../styles/hoverCard.css";

const HoverCard = (props) => {
  return (
    <div className="hover-card" onClick={() => props.openModal(props.item)}>
      <p className="hover-title">{props.item.name}</p>
    </div>
  );
};

export default HoverCard;
