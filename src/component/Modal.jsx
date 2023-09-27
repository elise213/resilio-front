import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ModalInfo } from "./ModalInfo";
import styles from "../styles/resourceModal.css";

const Modal = (props) => {
  const modalContentRef = useRef(null);
  const tokenExists = sessionStorage.getItem("token");

  const getIconForCategory = (category) => {
    switch (category) {
      case "health":
        return "fa-solid fa-stethoscope";
      case "food":
        return "fa-solid fa-bowl-rice";
      case "hygiene":
        return "fa-solid fa-soap";
      case "bathroom":
        return "fa-solid fa-toilet";
      case "work":
        return "fa-solid fa-briefcase";
      case "wifi":
        return "fa-solid fa-wifi";
      case "crisis":
        return "fa-solid fa-exclamation-triangle";
      case "substance":
        return "fa-solid fa-capsules";
      case "legal":
        return "fa-solid fa-gavel";
      case "sex":
        return "fa-solid fa-heart";
      case "mental":
        return "fa-solid fa-brain";
      case "women":
        return "fa-solid fa-female";
      case "youth":
        return "fa-solid fa-child";
      case "seniors":
        return "fa-solid fa-blind";
      case "lgbtq":
        return "fa-solid fa-rainbow";
      case "shelter":
        return "fa-solid fa-person-shelter";
      default:
        return "fa-solid fa-question";
    }
  };

  let categories = props.resource.category;
  if (typeof categories === "string" && categories.includes(",")) {
    categories = categories.split(",").map((cat) => cat.trim());
  } else if (typeof categories === "string") {
    categories = [categories];
  } else if (!Array.isArray(categories)) {
    categories = [];
  }

  const icons = categories.map(getIconForCategory);

  const handleCloseClick = (event) => {
    event.stopPropagation();
    props.closeModal();
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        modalContentRef.current &&
        !modalContentRef.current.contains(event.target)
      ) {
        console.log("Clicked outside the modal!");
        props.closeModal();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const resourceId = props.resource.id;

  return (
    <div>
      <div className="modal-div">
        <div className="modal-content" ref={modalContentRef}>
          <div className="modal-header">
            <div className="modal-title-div">
              {icons.map((icon, index) => (
                <i key={index} className={`${icon} card-icon-2`} />
              ))}
              <span>{props.resource.name}</span>
            </div>
            <div className="modal-close-div">
              <p className="x-close btn-close" onClick={handleCloseClick}></p>
            </div>
          </div>
          <div className="modal-body">
            <ModalInfo
              id={props.resource.id}
              schedule={props.resource.schedule}
              res={props.resource}
            />
            <div className="modal-footer">
              <p className="">
                Is there a problem with this information? {""}
                <Link to="/Contact">Let us know</Link>
              </p>
              <p className="">
                Click {""}
                <Link to="/create">here</Link>
                {""} to create a new resource listing.
              </p>
              <p>
                {tokenExists && (
                  <Link to={`/edit/${resourceId}`}>Edit This Resource</Link>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
