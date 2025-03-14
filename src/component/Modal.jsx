import React, { useState, useContext, useRef, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import { ModalInfo } from "./ModalInfo";
import styles from "../styles/resourceModal.css";
import Swal from "sweetalert2";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

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

  const mapCenter = {
    lat: resource?.latitude || 0, // Default to 0 if no latitude
    lng: resource?.longitude || 0, // Default to 0 if no longitude
  };
  const mapZoom = 13;

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

  const handleLike = (commentId) => {
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

    // Function to open Google Maps directions
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

  // const toggleLikeComment = (commentId) => {
  //   setComments((prevComments) =>
  //     prevComments.map((comment) => {
  //       if (comment.comment_id === commentId) {
  //         const isLiked = comment.likes?.some(
  //           (like) => like.user_id === userIdFromSession
  //         );

  //         if (isLiked) {

  //           actions
  //             .unlikeComment(commentId)
  //             .then(() => {
  //               setComments((currentComments) =>
  //                 currentComments.map((c) =>
  //                   c.comment_id === commentId
  //                     ? {
  //                         ...c,
  //                         like_count: c.like_count - 1,
  //                         likes: c.likes.filter(
  //                           (like) => like.user_id !== userIdFromSession
  //                         ),
  //                       }
  //                     : c
  //                 )
  //               );
  //             })
  //             .catch((error) => {
  //               Swal.fire("Error", "Unable to unlike comment.", "error");
  //             });
  //         } else {
  //           // If not liked, like it
  //           actions
  //             .likeComment(commentId)
  //             .then(() => {
  //               setComments((currentComments) =>
  //                 currentComments.map((c) =>
  //                   c.comment_id === commentId
  //                     ? {
  //                         ...c,
  //                         like_count: c.like_count + 1,
  //                         likes: [
  //                           ...(c.likes || []),
  //                           { user_id: userIdFromSession },
  //                         ],
  //                       }
  //                     : c
  //                 )
  //               );
  //             })
  //             .catch((error) => {
  //               Swal.fire("Error", "Unable to like comment.", "error");
  //             });
  //         }
  //       }
  //       return comment;
  //     })
  //   );
  // };

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
        <div
          className="map-container-modal"
          style={{ height: "300px", width: "500px", justifySelf: "center" }}
        >
          <GoogleMapReact
            bootstrapURLKeys={{ key: apiKey }}
            defaultCenter={mapCenter}
            defaultZoom={mapZoom}
          >
            {/* Add a Marker for the resource */}
            <Marker
              lat={resource.latitude}
              lng={resource.longitude}
              text={resource.name}
              id={resource.id}
              result={resource}
            />
          </GoogleMapReact>
        </div>
      </div>

      {comments.length > 0 && (
        <div className="comments-display">
          <span className="user-reviews">User Reviews</span>
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
                  <Rating
                    name="read-only"
                    value={comment.rating_value}
                    precision={0.5}
                    readOnly
                  />
                  <p className="comment-content">{comment.comment_cont}</p>
                  <div className="comment-content-div">
                    <div className="comment-user-info">
                      <div>
                        <span className="material-symbols-outlined account-circle">
                          account_circle
                        </span>
                        {comment.user_name} {"   "}
                      </div>
                      {formattedDate}
                    </div>
                    {parseInt(comment.user_id) === userIdFromSession && (
                      <button
                        onClick={() => handleDelete(comment.comment_id)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    )}
                    <div className="like-icon">
                      {comment.likes?.some(
                        (like) => like.user_id === userIdFromSession
                      ) ? (
                        <FavoriteIcon
                          fontSize="small"
                          onClick={() => handleUnlike(comment.comment_id)}
                        />
                      ) : (
                        <FavoriteBorderIcon
                          fontSize="small"
                          onClick={() => handleLike(comment.comment_id)}
                        />
                      )}
                      {comment.like_count}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
                  {/* <span className="rating-prompt">
                    What did You Think of {resource.name}?
                  </span> */}
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
    </>
  );
};

export default Modal;
