import React, { useState, useContext, useRef, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import { ModalInfo } from "./ModalInfo";
import styles from "../styles/resourceModal.css";
import Swal from "sweetalert2";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"; // Hollow plus sign
import AddCircleIcon from "@mui/icons-material/AddCircle"; // Solid plus sign

import GoogleMapReact from "google-map-react"; // Import GoogleMapReact

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

  // const handleDelete = async (commentId) => {
  //   console.log("Deleting comment ID:", commentId);
  //   const confirm = window.confirm(
  //     "Are you sure you want to delete this comment? This action cannot be undone."
  //   );
  //   if (confirm) {
  //     try {
  //       await actions.deleteComment(commentId);
  //       console.log("Comment deleted successfully");
  //     } catch (error) {
  //       console.error("Error deleting comment:", error);
  //     }
  //   }
  // };

  const handleDelete = async (commentId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this comment? This action cannot be undone."
    );

    if (confirm) {
      const result = await actions.deleteComment(commentId);
      if (result.success) {
        // Update the UI to reflect the deleted comment
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.comment_id !== commentId)
        );
        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Comment deleted successfully.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message || "Failed to delete the comment.",
        });
      }
    }
  };

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
  //   actions
  //     .likeComment(commentId)
  //     .then(() => {
  //       setComments((prevComments) =>
  //         prevComments.map((c) =>
  //           c.comment_id === commentId
  //             ? {
  //                 ...c,
  //                 like_count: c.like_count + 1,
  //                 likes: [...(c.likes || []), { user_id: userIdFromSession }],
  //               }
  //             : c
  //         )
  //       );
  //     })
  //     .catch((error) => {
  //       console.error("Error liking comment:", error);
  //     });
  // };

  // const handleUnlike = (commentId) => {
  //   actions
  //     .unlikeComment(commentId)
  //     .then(() => {
  //       setComments((prevComments) =>
  //         prevComments.map((c) =>
  //           c.comment_id === commentId
  //             ? {
  //                 ...c,
  //                 like_count: c.like_count - 1,
  //                 likes: c.likes.filter(
  //                   (like) => like.user_id !== userIdFromSession
  //                 ),
  //               }
  //             : c
  //         )
  //       );
  //     })
  //     .catch((error) => {
  //       console.error("Error unliking comment:", error);
  //     });
  // };

  function toggleRatingModal() {
    setShowRating(!showRating);
  }

  const toggleLikeComment = async (commentId) => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      Swal.fire({
        icon: "info",
        title: "Not Logged In",
        text: "Please log in to like a comment.",
        confirmButtonText: "Log In",
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          actions.closeModal();
          actions.openLoginModal();
        }
      });
      return;
    }

    const current_back_url = store.current_back_url;
    const comment = comments.find((c) => c.comment_id === commentId);

    if (!comment) {
      console.error("Comment not found.");
      return;
    }

    const isLiked = comment.likes?.some(
      (like) => like.user_id === userIdFromSession
    );

    try {
      setComments((prevComments) =>
        prevComments.map((c) =>
          c.comment_id === commentId ? { ...c, isLoading: true } : c
        )
      );

      const response = await fetch(
        `${current_back_url}/api/likeComment/${commentId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setComments((prevComments) =>
          prevComments.map((c) =>
            c.comment_id === commentId
              ? {
                  ...c,
                  like_count:
                    data.action === "like"
                      ? c.like_count + 1
                      : c.like_count - 1,
                  likes:
                    data.action === "like"
                      ? [...(c.likes || []), { user_id: userIdFromSession }]
                      : c.likes.filter(
                          (like) => like.user_id !== userIdFromSession
                        ),
                }
              : c
          )
        );
      } else {
        console.error("Failed to toggle like:", data.message);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Unable to process your request.",
        });
      }
    } catch (error) {
      console.error("Error toggling like on comment:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to process your request at this time.",
      });
    } finally {
      setComments((prevComments) =>
        prevComments.map((c) =>
          c.comment_id === commentId ? { ...c, isLoading: false } : c
        )
      );
    }
  };

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
            setComments={setComments}
            averageRating={averageRating}
            setAverageRating={setAverageRating}
            toggleRatingModal={toggleRatingModal}
            ratingCount={ratingCount}
            setRatingCount={setRatingCount}
          />
        </div>
      </div>
      <div className="group-1">
        <div className="reviews-div">
          {comments.length > 0 && (
            <>
              <span className="user-reviews">User Reviews</span>
              <div className="comment-container">
                {comments.map((comment) => {
                  const date = new Date(comment.created_at);
                  const formattedDate = date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });
                  let isLiked = comment.likes?.some(
                    (like) => like.user_id === userIdFromSession
                  );
                  console.log("isliked", isLiked);
                  return (
                    <div key={comment.comment_id} className="comment-div">
                      <div className="comment-info">
                        <div className="comment-label">
                          <Rating
                            name="read-only"
                            value={comment.rating_value}
                            precision={0.5}
                            readOnly
                          />
                          <p className="comment-content">
                            {comment.comment_cont}
                          </p>
                          <div
                            style={{ display: "flex", alignSelf: "flex-end" }}
                          >
                            <div className="like-icon">
                              {comment.isLoading ? (
                                <span>Loading...</span>
                              ) : comment.likes?.some(
                                  (like) => like.user_id === userIdFromSession
                                ) ? (
                                <AddCircleIcon
                                  fontSize="small"
                                  onClick={() =>
                                    toggleLikeComment(comment.comment_id)
                                  }
                                  titleAccess="Unlike this comment"
                                />
                              ) : (
                                <AddCircleOutlineIcon
                                  fontSize="small"
                                  onClick={() =>
                                    toggleLikeComment(comment.comment_id)
                                  }
                                  titleAccess="Like this comment"
                                />
                              )}
                            </div>
                            {comment.like_count}
                          </div>
                        </div>
                        <div className="comment-content-div">
                          {parseInt(comment.user_id) === userIdFromSession && (
                            <button
                              onClick={() => handleDelete(comment.comment_id)}
                              className="delete-button"
                            >
                              Delete
                            </button>
                          )}
                          <div className="comment-user-info">
                            <div className="user-info ">
                              <span className="material-symbols-outlined account-circle">
                                account_circle
                              </span>
                              {comment.user_name} {"   "}
                            </div>
                            {formattedDate}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
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
            to add this resource to your favorites
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
            <span className="close-modal" onClick={() => setShowRating(false)}>
              <span className="material-symbols-outlined">arrow_back_ios</span>
              Back
            </span>

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
            {/* </div> */}
            {isLoggedIn && (
              <>
                <div className="rating-container">
                  <span className="rating-prompt">
                    {/* What did You Think of */}
                    {resource.name}
                  </span>
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
