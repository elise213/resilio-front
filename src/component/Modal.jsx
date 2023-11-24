import React, { useState, useContext, useRef, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import { ModalInfo } from "./ModalInfo";
import styles from "../styles/resourceModal.css";
import Swal from "sweetalert2";
import Rating from "@mui/material/Rating";

const Modal = (props) => {
  const { actions } = useContext(Context);

  const [ratingResponse, setRatingResponse] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const modalContentRef = useRef(null);

  const toggleRatingModal = () => {
    setShowRating(!showRating);
  };

  const handleRatingSubmit = () => {
    console.log("handle rating submit!");
    let resourceId = props.resource.id;
    actions.createRating(resourceId, rating, (response) => {
      setRatingResponse(response);
      if (response && response.status === "true") {
        Swal.fire({
          title: "Success!",
          text: "Your rating has been submitted.",
          icon: "success",
          confirmButtonText: "Ok",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text:
            response.message || "There was an issue submitting your rating.",
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    });
  };

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
  const tokenExists = sessionStorage.getItem("token");
  let categories = actions.processCategory(props.resource.category);

  return (
    <>
      <div className="modal-content" ref={modalContentRef}>
        {/* Modal Header */}
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

          <div className="rate-this-resource">
            <div className="modal-close-div">
              <p className="x-close btn-close" onClick={handleCloseClick}></p>
            </div>
          </div>

          {/* Rating Section Toggle */}
          <div className="rate-this-resource-toggle">
            <button onClick={toggleRatingModal}>Rate this resource</button>
          </div>

          {/* Rating Section */}
          {showRating && (
            <div className="rate-this-resource">
              <Rating
                name="resource-rating"
                value={rating}
                onChange={(event, newRating) => setRating(newRating)}
              />
              <button
                onClick={handleRatingSubmit}
                className="submit-rating-button"
              >
                Submit
              </button>
            </div>
          )}
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
    </>
  );
};

export default Modal;
