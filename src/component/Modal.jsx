import React, { useState, useContext, useRef, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import { ModalInfo } from "./ModalInfo";
import styles from "../styles/resourceModal.css";
import Swal from "sweetalert2";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";

const Modal = ({}) => {
  const { store, actions } = useContext(Context);

  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);

  const [showRating, setShowRating] = useState(false);
  const apiKey = import.meta.env.VITE_GOOGLE;

  const validUserIds = [1, 3, 4]; //Mike, Eugene and Mara
  const userIdFromSession = parseInt(sessionStorage.getItem("user_id"), 10);
  const isAuthorizedUser = validUserIds.includes(userIdFromSession);

  const [hover, setHover] = useState(-1);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    actions.fetchFavorites();
  }, []);

  const resource = store.selectedResource;

  const handleSubmitReview = () => {
    if (!rating || !comment.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "You must include a rating and a comment.",
      });
      return;
    }

    actions
      .submitRatingAndComment(resource.id, comment, rating)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Your review has been submitted!",
        });
        setRating(0);
        setComment("");
        setShowRating(false);

        // Refresh comments and ratings after submission
        if (resource?.id) {
          actions.getAverageRating(
            resource.id,
            setAverageRating,
            setRatingCount
          );
          actions.getComments(resource.id, setComments);
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to submit your review.",
        });
      });
  };

  function toggleRatingModal() {
    setShowRating(!showRating);
  }

  useEffect(() => {
    if (resource?.id) {
      actions.getAverageRating(resource.id, setAverageRating, setRatingCount);
      actions.getComments(resource.id, setComments);
    }
  }, [resource]);

  useEffect(() => {
    console.log("resource", resource);
  }, []);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = sessionStorage.getItem("token") || store.token;
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
  }, [store.token, store.modalIsOpen]);

  useEffect(() => {
    if (store.favorites) {
      const storedFavorites = store.favorites;
      const isItemFavorited = storedFavorites.some(
        (favorite) => favorite.id === resource.id
      );
      setIsFavorited(isItemFavorited);
    }
  }, [store.favorites]);

  const labels = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Exceptional",
  };

  return (
    <>
      <p
        className="close-modal"
        onClick={() => {
          actions.closeModal();
        }}
      >
        <span className="material-symbols-outlined">arrow_back_ios</span>
        Back
      </p>
      <div className="group-1">
        <div className="resource-info">
          <ModalInfo
            schedule={resource.schedule}
            res={resource}
            isFavorited={isFavorited}
            setIsFavorited={setIsFavorited}
            setShowRating={setShowRating}
            averageRating={averageRating}
            setAverageRating={setAverageRating}
            toggleRatingModal={toggleRatingModal}
            ratingCount={ratingCount}
            setRatingCount={setRatingCount}
            comments={comments}
            setComments={setComments}
          />
        </div>
      </div>
      <div className="modal-footer">
        {!isLoggedIn && (
          <div className="please-log" style={{ margin: "30px" }}>
            <span
              role="button"
              tabIndex={0}
              className="log-in"
              onClick={() => {
                actions.openLoginModal();
                actions.closeModal();
              }}
            >
              Log in
            </span>
            to follow this resource
          </div>
        )}
        {isAuthorizedUser && isLoggedIn && (
          <>
            <p className="problem">
              Click {""}
              <Link to="/create">here</Link>
              {""} to create a new resource listing
            </p>

            <p className="problem">
              Click {""}
              <Link to={`/edit/${resource.id}`}>here</Link>
              {""} to edit this resource
            </p>
          </>
        )}
      </div>

      {/* Rating Modal */}
      {showRating && (
        <>
          <div className="rate">
            {!isLoggedIn && (
              <div className="please-log">
                Please
                <span
                  role="button"
                  tabIndex={0} // Make it focusable
                  className="log-in"
                  onClick={() => {
                    actions.openLoginModal();
                    setShowRating(false);
                    actions.closeModal;
                  }}
                >
                  log in
                </span>
                to rate and review resources.
              </div>
            )}

            {isLoggedIn && (
              <>
                <div className="rating-container">
                  <span className="rating-prompt">{resource.name}</span>
                  <Rating
                    className="resource-rating"
                    name="resource-rating"
                    value={rating}
                    precision={1}
                    onChange={(event, newRating) => setRating(newRating)}
                    onChangeActive={(event, newHover) => {
                      setHover(newHover);
                    }}
                    style={{ fontSize: "30px" }}
                  />
                  <div className="rating-label">
                    {rating !== null && labels[hover !== -1 ? hover : rating]}
                  </div>
                  <div className="comment-section">
                    <textarea
                      className="comment-text-area"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={`Please describe your experience at ${resource.name}...`}
                      maxLength="280"
                    ></textarea>

                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmitReview}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Modal;
