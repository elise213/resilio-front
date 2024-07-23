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
  // setFavorites,
  setContactModalIsOpen,
  setAboutModalIsOpen,
  setOpenLoginModal,
  openLoginModal,
  showRating,
  setShowRating,
}) => {
  const { store, actions } = useContext(Context);

  const [rating, setRating] = useState(0);

  const validUserIds = [1, 3]; //Mike and Mara

  // const isAuthorizedUser = validUserIds.includes(store.user_id);
  const userIdFromSession = parseInt(sessionStorage.getItem("user_id"), 10);

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

  // const handleSubmitRatingAndComment = () => {
  //   console.log("Submit button clicked");
  //   actions
  //     .submitRatingAndComment(resource.id, comment, rating)
  //     .then((response) => {
  //       console.log("Success", response);
  //       Swal.fire("Success", "Your review has been submitted!", "success");

  //       // Reset form state here if needed
  //       setRating(0);
  //       setComment("");

  //       // Refetch the latest comments and average rating
  //       fetchLatestCommentsAndRatings();
  //     })
  //     .catch((error) => {
  //       console.error("Error submitting review:", error);
  //       Swal.fire("Error", "Failed to submit your review.", "error");
  //     });
  // };

  const fetchLatestCommentsAndRatings = () => {
    actions.getAverageRating(resource.id, setAverageRating);
    actions.getComments(resource.id, setComments);
  };

  useEffect(() => {
    fetchLatestCommentsAndRatings();
  }, [resource.id, actions]);

  // USE EFFECTS
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = sessionStorage.getItem("token") || store.token;
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
  }, [store.token, modalIsOpen]);

  useEffect(() => {
    if (store.favorites) {
      const storedFavorites = store.favorites;
      const isItemFavorited = storedFavorites.some(
        (favorite) => favorite.id === resource.id
      );
      setIsFavorited(isItemFavorited);
    }
  }, [store.favorites]);

  useEffect(() => {
    actions.getAverageRating(resource.id, setAverageRating);
    actions.getComments(resource.id, setComments);
  }, [resource.id, actions]);

  // REFS
  const ratingModalRef = useRef(null);

  const labels = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Exceptional",
  };

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
          title="Click to rate and review this resource"
        >
          <span
            className="resource-title-modal"
            style={{ textAlign: "center" }}
          >
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
          setIsFavorited={setIsFavorited}
          setShowRating={setShowRating}
          addSelectedResource={addSelectedResource}
          removeSelectedResource={removeSelectedResource}
          selectedResource={resource}
          selectedResources={selectedResources}
          setAboutModalIsOpen={setAboutModalIsOpen}
        />
      </div>

      {comments.length > 0 && (
        <div className="comments-display">
          <span className="user-reviews">Reviews</span>
          {comments.map((comment, index) => {
            const date = new Date(comment.created_at);
            const formattedDate = date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });
            return (
              <div key={`${comment.id}-${index}`} className="comment-div">
                <div className="comment-info">
                  <div className="comment-user-info">
                    <span className="material-symbols-outlined account-circle">
                      account_circle
                    </span>
                    {comment.user_id}{" "}
                  </div>
                  <div className="comment-info-date">
                    <Rating
                      style={{ flexDirection: "row" }}
                      name="read-only"
                      value={comment.rating_value}
                      precision={0.5}
                      readOnly
                    />
                    <p className="comment-info-content">{formattedDate}</p>
                  </div>
                  <div className="comment-content-div">
                    <p className="comment-content">{comment.comment_cont}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="modal-footer">
        {/* <p className="problem">
          Click {""}
          <span
            onClick={() => {
              setContactModalIsOpen(true);
              setAboutModalIsOpen(false);
              setDonationModalIsOpen(false);
            }}
            className="here"
          >
            here
          </span>{" "}
          if there is a problem with this information.
        </p> */}

        {isAuthorizedUser && (
          <>
            <p className="problem">
              Click {""}
              <Link to="/create">here</Link>
              {""} to create a new resource listing.
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
          <div className="rate" ref={ratingModalRef}>
            <div className="custom-login-modal-header">
              <span
                className="close-modal"
                onClick={() => setShowRating(false)}
              >
                <span className="material-symbols-outlined">
                  arrow_back_ios
                </span>
                Back to Search
              </span>

              <div className="please-log">
                Please
                <span
                  role="button"
                  tabIndex={0} // Make it focusable
                  className="log-in"
                  onClick={() => {
                    setOpenLoginModal(true);
                    setShowRating(false);
                    setModalIsOpen(false);
                  }}
                >
                  log in
                </span>
                to rate and review resources.
              </div>
            </div>
            {isLoggedIn && (
              <div className="rating-container">
                <span className="">What do You Think of {resource.name} ?</span>
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
                    // Check if rating or comment is missing and show an alert
                    if (!rating || rating <= 0) {
                      Swal.fire({
                        icon: "warning",
                        title: "Oops...",
                        text: "You must include a rating.",
                      });
                      return; // Exit the function early to prevent submission and preserve current input
                    }

                    if (!comment.trim()) {
                      Swal.fire({
                        icon: "warning",
                        title: "Oops...",
                        text: "You must include a comment.",
                      });
                      return;
                    }

                    console.log("Submit button clicked");
                    actions
                      .submitRatingAndComment(resource.id, comment, rating)
                      .then((response) => {
                        console.log("Success", response);
                        Swal.fire({
                          icon: "success",
                          title: "Success",
                          text: "Your review has been submitted!",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            setShowRating(false);
                          }
                        });

                        // Reset form state here if needed
                        setRating(0);
                        setComment("");

                        // Refresh comments and ratings
                        fetchLatestCommentsAndRatings();
                      })
                      .catch((error) => {
                        console.error("Error submitting review:", error);
                        Swal.fire({
                          icon: "error",
                          title: "Error",
                          text: "Failed to submit your review.",
                        });
                      });
                  }}
                >
                  Submit
                </Button>
              </div>
            ) : (
              ""
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Modal;
