import React, { useState, useContext, useRef, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import { ModalInfo } from "./ModalInfo";
import styles from "../styles/resourceModal.css";
import Swal from "sweetalert2";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DeleteIcon from "@mui/icons-material/Delete";
import { Tooltip, Icon } from "@mui/material";

const Modal = ({}) => {
  const { store, actions } = useContext(Context);

  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [hover, setHover] = useState(-1);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const isLoggedIn = !!store.token;
  const userIdFromSession = sessionStorage.getItem("user_id");

  const isAuthorizedUser = store.authorizedUser;
  const resource = store.selectedResource;

  const handleDelete = async (commentId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this comment? This action cannot be undone."
    );
    if (confirm) {
      await actions.deleteComment(commentId);
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
          text: "Thank you! Your comment is pending approval.",
        });
        setRating(0);
        setComment("");
        setShowRating(false);
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

  const handleLike = (commentId) => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: "info",
        // title: "",
        html: `You need to <a href="#" id="login-link">log in</a> to like this comment.`,
        showConfirmButton: false,
        didOpen: () => {
          document
            .getElementById("login-link")
            .addEventListener("click", (e) => {
              e.preventDefault();
              Swal.close();
              actions.openLoginModal();
              actions.closeModal();
            });
        },
      });
      return;
    }

    actions
      .likeComment(commentId)
      .then(() => {
        setComments((prevComments) =>
          prevComments.map((c) =>
            c.comment_id === commentId
              ? {
                  ...c,
                  like_count: c.like_count + 1,
                  likes: [...(c.likes || []), { user_id: userIdFromSession }],
                }
              : c
          )
        );
      })
      .catch((error) => {
        console.error("Error liking comment:", error);
      });
  };

  const handleUnlike = (commentId) => {
    actions
      .unlikeComment(commentId)
      .then(() => {
        setComments((prevComments) =>
          prevComments.map((c) =>
            c.comment_id === commentId
              ? {
                  ...c,
                  like_count: c.like_count - 1,
                  likes: c.likes.filter(
                    (like) => like.user_id !== userIdFromSession
                  ),
                }
              : c
          )
        );
      })
      .catch((error) => {
        console.error("Error unliking comment:", error);
      });
  };

  const Marker = React.memo(({ result }) => {
    const [isHovered, setIsHovered] = useState(false);
    const openGoogleMaps = () => {
      if (result) {
        const { latitude, longitude } = result;
        const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        window.open(url, "_blank");
      }
    };

    return (
      <div
        className="marker"
        onClick={openGoogleMaps}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="marker-icon">
          <i className="fa-solid fa-map-pin" style={{ color: "red" }}></i>
        </div>
        {isHovered && result && (
          <div className="marker-address">
            {result.address || "Address not available"}
          </div>
        )}
      </div>
    );
  });

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

  const labels = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Exceptional",
  };

  return (
    <>
      {resource.alert && (
        <div className="alert-bar">
          {/* <marquee behavior="scroll" direction="left"> */}
          {/* 🚨 */}
          <div className="alert-text-div">
            <span className="modal-info-title">
              {resource.name} would like you to have the following information:{" "}
              {resource.alert}
            </span>
            {/* </marquee> */}
          </div>
        </div>
      )}

      <div className="resource-info">
        <ModalInfo
          schedule={resource.schedule}
          res={resource}
          setShowRating={setShowRating}
          setComments={setComments}
          averageRating={averageRating}
          setAverageRating={setAverageRating}
          toggleRatingModal={toggleRatingModal}
          ratingCount={ratingCount}
          setRatingCount={setRatingCount}
          isLoggedIn={isLoggedIn}
        />
      </div>

      {comments.length > 0 && (
        <div className="comments-display">
          <span className="user-reviews">User Reviews</span>
          {comments.map((comment) => {
            const date = new Date(comment.created_at);
            const formattedDate = date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            });
            let isLiked = comment.likes?.some(
              (like) => like.user_id === userIdFromSession
            );
            return (
              <div key={comment.comment_id} className="comment-div">
                <div className="comment-info">
                  {parseInt(comment.user_id) === userIdFromSession ? (
                    <Tooltip title="Delete this comment" arrow>
                      <DeleteIcon
                        fontSize="small"
                        onClick={() => handleDelete(comment.comment_id)}
                        style={{
                          cursor: "pointer",
                          color: "gray",
                          alignSelf: "flex-start",
                        }}
                      />
                    </Tooltip>
                  ) : (
                    ""
                  )}
                  <Rating
                    name="read-only"
                    value={comment.rating_value}
                    precision={0.5}
                    readOnly
                  />
                  <p className="comment-content">{comment.comment_cont}</p>
                  <div
                    className="comment-content-div"
                    style={{ marginTop: "15px" }}
                  >
                    <div className="comment-user-info">
                      <div className="name-and-icon">
                        <span className="name-comment">
                          {comment.user_name} {"   "}
                        </span>
                        <span className="date-comment">{formattedDate}</span>
                      </div>
                    </div>

                    <div className="like-icon">
                      {comment.likes?.some(
                        (like) => like.user_id === userIdFromSession
                      ) ? (
                        <FavoriteIcon
                          sx={{ color: "red", cursor: "pointer" }}
                          fontSize="x-small"
                          onClick={() => handleUnlike(comment.comment_id)}
                        />
                      ) : (
                        <FavoriteBorderIcon
                          sx={{ color: "gray", cursor: "pointer" }}
                          fontSize="x-small"
                          onClick={() => handleLike(comment.comment_id)}
                        />
                      )}

                      {comment.like_count > 0 && (
                        <span>{comment.like_count}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
                  tabIndex={0}
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
                      placeholder={`Describe your experience at ${resource.name}...`}
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
      {isAuthorizedUser && isLoggedIn && (
        <div className="modal-footer">
          <Tooltip title="Click here to edit this resource" arrow>
            <Link to={`/edit/${resource.id}`}>
              <Icon>handyman</Icon>
            </Link>
          </Tooltip>
        </div>
      )}
    </>
  );
};

export default Modal;
