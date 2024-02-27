import React, { useState, useContext, useRef, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import { ModalInfo } from "./ModalInfo";
import styles from "../styles/resourceModal.css";
import Swal from "sweetalert2";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";

const Modal = ({
  resource,
  modalIsOpen,
  closeModal,
  setModalIsOpen,
  isGeneratedMapModalOpen,
  removeSelectedResource,
  selectedResources,
  addSelectedResource,
  setFavorites,
  showRating,
  setShowRating,
  setAboutModalIsOpen,
  setDonationModalIsOpen,
}) => {
  const { store, actions } = useContext(Context);

  const [ratingResponse, setRatingResponse] = useState(null);
  const [rating, setRating] = useState(0);

  const resourceId = resource.id;
  const tokenExists = sessionStorage.getItem("token");

  const validUserIds = [1, 2, 3, 4];
  // const isAuthorizedUser = validUserIds.includes(store.user_id);
  const userIdFromSession = parseInt(sessionStorage.getItem("user_id"), 10); // Get user ID from session storage and convert it to a number
  const isAuthorizedUser = validUserIds.includes(userIdFromSession);

  const [hover, setHover] = useState(-1);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  function toggleRatingModal() {
    setShowRating(!showRating);
  }

  // USE EFFECTS
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = sessionStorage.getItem("token") || store.token;
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
  }, [store.token, modalIsOpen]);

  useEffect(() => {
    const storedFavorites = JSON.parse(
      sessionStorage.getItem("favorites") || "[]"
    );
    const isItemFavorited = storedFavorites.some(
      (favorite) => favorite.name === resource.name
    );
    setIsFavorited(isItemFavorited);
  }, []);

  const toggleFavorite = (event) => {
    event.stopPropagation();
    setIsFavorited(!isFavorited);

    if (isFavorited) {
      actions.removeFavorite(resource.name, setFavorites);
    } else {
      actions.addFavorite(resource.name, setFavorites);
    }
  };

  useEffect(() => {
    actions.getAverageRating(resource.id, setAverageRating);
    actions.getComments(resource.id, setComments);
  }, [resource.id, actions]);

  const handleCommentSubmit = () => {
    if (comment.length > 280) {
      Swal.fire({
        icon: "error",
        title: "Comment Too Long",
        text: "Your comment must be less than 280 characters.",
      });
      return;
    }

    actions.createComment(resource.id, comment, (response) => {
      if (response && response.status === "true") {
        Swal.fire({
          icon: "success",
          title: "Comment Submitted",
          text: "Your comment has been successfully submitted.",
        });
        setComment("");
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to Submit Comment",
          text:
            response.message || "There was an issue submitting your comment.",
        });
      }
    });
  };

  // REFS
  const modalContentRef = useRef(null);
  const ratingModalRef = useRef(null);

  const labels = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Exceptional",
  };

  const handleRatingSubmit = () => {
    console.log("handle rating submit!");
    let resourceId = resource.id;
    actions.createRating(resourceId, rating, (response) => {
      setRatingResponse(response);
      if (response && response.status === "true") {
        Swal.fire({
          title: "Success!",
          text: "Your rating has been submitted.",
          // icon: "success",
          confirmButtonText: "Ok",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text:
            response.message || "There was an issue submitting your rating.",
          // icon: "error",
          confirmButtonText: "Ok",
        });
      }
    });
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        showRating &&
        ratingModalRef.current &&
        !ratingModalRef.current.contains(event.target)
      ) {
        console.log("Clicked outside the rating modal!");
        toggleRatingModal();
      }
    };

    // Attaching the event listener
    document.addEventListener("mousedown", handleOutsideClick);

    // Cleanup  event listener
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showRating]);

  // const resourceId = resource.id;
  // const tokenExists = sessionStorage.getItem("token");
  // let categories = actions.processCategory(resource.category);

  return (
    <>
      <p className="close-modal" onClick={() => setModalIsOpen(false)}>
        <span class="material-symbols-outlined">arrow_back_ios</span>
        Back to search
      </p>

      <div>
        <div
          className="resource-rating"
          onClick={() => {
            toggleRatingModal();
          }}
        >
          <span className="resource-title">{resource.name}</span>
          <Rating
            name="read-only"
            value={averageRating}
            precision={0.5}
            readOnly
          />
        </div>
        {/* {isLoggedIn && !averageRating && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowRating(true)}
          className="submit"
        >
          Rate
        </Button>
      )} */}

        {/* KEEP THIS!  */}

        {/* <div className="icon-box">
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
          </div> */}
        {/* </div> */}
        {/* </div> */}
        {/* <div className="modal-tools"></div> */}
        {/* <div className="modal-body"> */}
        <ModalInfo
          modalIsOpen={modalIsOpen}
          id={resource.id}
          schedule={resource.schedule}
          res={resource}
          isFavorited={isFavorited}
          setShowRating={setShowRating}
          toggleFavorite={toggleFavorite}
          isGeneratedMapModalOpen={isGeneratedMapModalOpen}
          addSelectedResource={addSelectedResource}
          removeSelectedResource={removeSelectedResource}
          selectedResource={resource}
          selectedResources={selectedResources}
        />
        {/* <div className="full-comments-section"> */}
      </div>
      <div className="modal-footer">
        <p className="problem">
          Is there a problem with this information? {""}
          <span
            onClick={() => {
              setDonationModalIsOpen(false);
              setShowContactModal(true);
              setAboutModalIsOpen(false);
            }}
          >
            Let us know
          </span>
        </p>

        {/* <p className="problem">
          Click {""}
          <Link to="/create">here</Link>
          {""} to create a new resource listing.
        </p>

        {isLoggedIn && (
          <p className="problem">
            Click {""}
            <Link to={`/edit/${resourceId}`}>here</Link>
            {""} to edit this resource
          </p>
        )} */}

        {isAuthorizedUser && (
          <>
            <p className="problem">
              Click {""}
              <Link to="/create">here</Link>
              {""} to create a new resource listing.
            </p>

            <p className="problem">
              Click {""}
              <Link to={`/edit/${resourceId}`}>here</Link>
              {""} to edit this resource
            </p>
          </>
        )}
      </div>

      {/* Rating Modal */}
      {showRating && (
        <>
          <div className="donation-modal" ref={ratingModalRef}>
            <div>
              <p className="close-rating" onClick={() => setShowRating(false)}>
                <i className="fa-solid fa-x"></i>
              </p>

              <span className="">What do You Think of {resource.name} ?</span>
              <div className="rating-container">
                <div className="rating-label">
                  {rating !== null && labels[hover !== -1 ? hover : rating]}
                </div>
                <Rating
                  className="resource-rating"
                  name="resource-rating"
                  value={rating}
                  precision={1}
                  onChange={(event, newRating) => setRating(newRating)}
                  onChangeActive={(event, newHover) => {
                    setHover(newHover);
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleRatingSubmit}
                  className="submit"
                >
                  Submit
                </Button>
              </div>
              {isLoggedIn && (
                <div className="comment-section">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={`Write a review of ${resource.name}...`}
                    maxLength="280"
                  ></textarea>
                  <Button
                    variant="contained"
                    color="primary"
                    className="submit"
                    onClick={handleCommentSubmit}
                  >
                    Submit
                  </Button>
                </div>
              )}
            </div>
            {comments.length > 0 && (
              <div className="comments-display">
                <div className="intro">User Reviews</div>
                {comments.map((comment, index) => {
                  const date = new Date(comment.created_at);
                  const formattedDate =
                    date.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }) +
                    ", " +
                    date.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    });

                  return (
                    <>
                      <div key={comment.id} className="comment-div">
                        <div className="comment-content-div">
                          <p className="comment-content">
                            "{comment.comment_cont}"
                          </p>
                        </div>
                        <div className="comment-info">
                          <div className="comment-user-info">
                            <p className="comment-info-username">
                              <i className="fa-solid fa-user"></i>{" "}
                              {comment.user_id}{" "}
                            </p>
                          </div>
                          <div className="comment-info-date">
                            <p className="comment-info-content">
                              {formattedDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Modal;
