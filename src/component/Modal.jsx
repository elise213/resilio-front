import React, { useState, useContext, useRef, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import { ModalInfo } from "./ModalInfo";
import styles from "../styles/resourceModal.css";

const Modal = (props) => {
  const { actions, store } = useContext(Context);
  const modalContentRef = useRef(null);
  const tokenExists = sessionStorage.getItem("token");

  let categories = props.resource.category;
  if (typeof categories === "string" && categories.includes(",")) {
    categories = categories.split(",").map((cat) => cat.trim());
  } else if (typeof categories === "string") {
    categories = [categories];
  } else if (!Array.isArray(categories)) {
    categories = [];
  }

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
              <div className="icon-box">
                {categories.map((category, index) => {
                  const colorStyle = actions.getColorForCategory(category);
                  return (
                    <i
                      key={index}
                      className={`${actions.getIconForCategory(
                        category
                      )} card-icon`}
                      style={colorStyle ? colorStyle : {}}
                    />
                  );
                })}
              </div>
              <div className="title-box">
                <span>{props.resource.name}</span>
              </div>
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
              <p className="problem">
                Is there a problem with this information? {""}
                <Link to="/Contact">Let us know</Link>
              </p>
              <p className="create">
                Click {""}
                <Link to="/create">here</Link>
                {""} to create a new resource listing.
              </p>

              {tokenExists && (
                <p className="edit-text">
                  Click {""}
                  <Link to={`/edit/${resourceId}`}>here</Link>
                  {""} to edit this resource
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
