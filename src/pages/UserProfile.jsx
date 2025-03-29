import React, { useContext, useEffect, useState } from "react";
import { Switch, FormControlLabel, Tooltip, Icon } from "@mui/material";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import Rating from "@mui/material/Rating";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Styles from "../styles/profile.css";
import Modal from "../component/Modal.jsx";

const UserProfile = () => {
  const { store, actions } = useContext(Context);
  const { id } = useParams();
  const [userCommentsAndRatings, setUserCommentsAndRatings] = useState([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const loggedInUserId = parseInt(sessionStorage.getItem("user_id"), 10);

  useEffect(() => {
    setLoading(true);

    Promise.all([
      actions.getCommentsAndRatingsForUser(id, setUserCommentsAndRatings),
      actions.getUserInfo(id).then((userInfo) => {
        setUserName(userInfo.name);
      }),
    ]).finally(() => {
      setLoading(false);
    });
  }, [id]);

  const handleDelete = (commentId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to undo this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        actions.deleteComment(commentId).then((response) => {
          if (response.success) {
            Swal.fire("Deleted!", "Your comment has been deleted.", "success");
            setUserCommentsAndRatings((prev) =>
              prev.filter((comment) => comment.comment_id !== commentId)
            );
          } else {
            Swal.fire(
              "Error!",
              "There was an issue deleting your comment.",
              "error"
            );
          }
        });
      }
    });
  };

  const handleOpenModal = async (resourceId) => {
    const fullResource = await actions.getResource(resourceId);
    if (fullResource) {
      actions.setSelectedResource(fullResource);
      setTimeout(() => {
        actions.openModal();
      }, 0);
    }
  };

  return (
    <>
      <div className="profile-container">
        <p className="close-modal">
          <Link to={`/`} style={{ display: "flex", alignItems: "center" }}>
            <span className="material-symbols-outlined">arrow_back_ios</span>
            Back
          </Link>
        </p>
        <div className="heading-bpages">YOUR REVIEWS</div>

        {loading ? (
          <div className="loading-alert">Loading...</div>
        ) : userCommentsAndRatings.length > 0 ? (
          userCommentsAndRatings.map((item, index) => (
            <div key={index} className="user-review-profile">
              <div className="resource-link">
                <div className="comment-date">
                  {new Date(item.created_at).toLocaleDateString()}
                </div>
                <span
                  onClick={() => handleOpenModal(item.resource_id)}
                  className="resource-name"
                >
                  {item.resource_name}
                </span>
              </div>

              <div className="comment-text"> {item.comment_cont}</div>
              <div className="rating-div-profile">
                <Rating
                  name="read-only"
                  value={item.rating_value}
                  precision={0.5}
                  readOnly
                  className="profile-rating"
                />
              </div>

              <div className="group-2">
                <div className="like-icon">
                  {item.likes?.some(
                    (like) => like.user_id === loggedInUserId
                  ) ? (
                    <FavoriteIcon
                      fontSize="small"
                      onClick={() => handleUnlike(item.comment_id)}
                    />
                  ) : (
                    <FavoriteBorderIcon
                      fontSize="small"
                      onClick={() => handleLike(item.comment_id)}
                    />
                  )}
                  {item.like_count > 0 && <span>{item.like_count}</span>}
                </div>
                {parseInt(id) === loggedInUserId && (
                  <Tooltip title="Delte Comment" arrow>
                    <DeleteIcon
                      fontSize="small"
                      onClick={() => handleDelete(item.comment_id)}
                      className="delete-icon"
                    />
                  </Tooltip>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No comments or ratings found.</p>
        )}
      </div>
      {store.modalIsOpen && (
        <div
          className="resilio-overlay"
          onClick={() => {
            actions.closeModal();
            document.body.classList.remove("modal-open");
          }}
        >
          {" "}
          <div className="modal-div">
            <Modal />
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;
