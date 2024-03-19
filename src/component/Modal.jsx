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
  setModalIsOpen,
  removeSelectedResource,
  selectedResources,
  addSelectedResource,
  setFavorites,
  showRating,
  setShowRating,
  setShowContactModal,
}) => {
  const { store, actions } = useContext(Context);

  const [ratingResponse, setRatingResponse] = useState(null);
  const [rating, setRating] = useState(0);

  const resourceId = resource.id;
  const validUserIds = [1, 2, 3, 4];
  // const isAuthorizedUser = validUserIds.includes(store.user_id);
  const userIdFromSession = parseInt(sessionStorage.getItem("user_id"), 10);
  // Get user ID from session storage and convert it to a number
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

  // REFS
  // const modalContentRef = useRef(null);
  const ratingModalRef = useRef(null);

  const labels = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Exceptional",
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

  return (
    <>
      <p className="close-modal" onClick={() => setModalIsOpen(false)}>
        <span className="material-symbols-outlined">arrow_back_ios</span>
        Back to search
      </p>

      <div className="resource-info">
        <div
          className="resource-rating"
          onClick={() => {
            toggleRatingModal();
          }}
        >
          <span className="resource-title" style={{ textAlign: "center" }}>
            {resource.name}
          </span>
          <Rating
            style={{ flexDirection: "row" }}
            name="read-only"
            value={averageRating}
            precision={0.5}
            readOnly
          />
        </div>
        <ModalInfo
          modalIsOpen={modalIsOpen}
          id={resource.id}
          schedule={resource.schedule}
          res={resource}
          isFavorited={isFavorited}
          setShowRating={setShowRating}
          toggleFavorite={toggleFavorite}
          // isGeneratedMapModalOpen={isGeneratedMapModalOpen}
          addSelectedResource={addSelectedResource}
          removeSelectedResource={removeSelectedResource}
          selectedResource={resource}
          selectedResources={selectedResources}
        />
        {/* <div className="full-comments-section"> */}
      </div>

      {comments.length > 0 && (
        <div className="comments-display">
          <span className="user-reviews">Reviews</span>
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
                  <div className="comment-info">
                    <div className="comment-user-info">
                      <span class="material-symbols-outlined account-circle">
                        account_circle
                      </span>
                      {comment.user_id}{" "}
                    </div>
                    <div className="comment-info-date">
                      <p className="comment-info-content">{formattedDate}</p>
                    </div>
                    <div className="comment-content-div">
                      <Rating
                        style={{ flexDirection: "row" }}
                        name="read-only"
                        value={comment.rating_value}
                        precision={0.5}
                        readOnly
                      />
                      <p className="comment-content">{comment.comment_cont}</p>
                    </div>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      )}

      <div className="modal-footer">
        <p className="problem">
          Click {""}
          <span
            onClick={() => {
              setShowContactModal(true);
            }}
            className="here"
          >
            here
          </span>{" "}
          if there is a problem with this information.
        </p>

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
              {isLoggedIn && (
                <div className="rating-container">
                  <span className="">
                    What do You Think of {resource.name} ?
                  </span>
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
                </div>
              )}
              {isLoggedIn ? (
                <div className="comment-section">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={`Please say something about ${resource.name}...`}
                    maxLength="280"
                  ></textarea>

                  <Button
                    variant="contained"
                    color="primary"
                    className="submit"
                    onClick={() => {
                      console.log("Submit button clicked"); // Debug log
                      actions
                        .submitRatingAndComment(resource.id, comment, rating)
                        .then((response) => {
                          // Handle successful submission
                          console.log("Success", response);
                          Swal.fire(
                            "Success",
                            "Your review has been submitted!",
                            "success"
                          );
                          // Reset form state here if needed
                          setRating(0);
                          setComment("");
                        })
                        .catch((error) => {
                          // Handle error case
                          console.error("Error submitting review:", error);
                          Swal.fire(
                            "Error",
                            "Failed to submit your review.",
                            "error"
                          );
                        });
                    }}
                  >
                    Submit
                  </Button>
                </div>
              ) : (
                <div>Please log in to rate and review resources.</div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Modal;
