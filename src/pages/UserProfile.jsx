import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import Rating from "@mui/material/Rating";
import Swal from "sweetalert2";
import Styles from "../styles/profile.css";
import { Modal } from "../component";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

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
    <div className="profile-container">
      <p className="close-modal">
        <Link to={`/`}>
          <span className="material-symbols-outlined">arrow_back_ios</span>
          Back to Search
        </Link>
      </p>
      <span className="profile-title">{userName}'s Reviews</span>

      {loading ? (
        <p>Loading...</p>
      ) : userCommentsAndRatings.length > 0 ? (
        userCommentsAndRatings.map((item, index) => (
          <div key={index} className="user-review-profile">
            <div>
              <strong>Resource: </strong>
              <span
                onClick={() => handleOpenModal(item.resource_id)}
                style={{ cursor: "pointer", color: "blue" }}
              >
                {item.resource_name}
              </span>
            </div>
            <p>
              <strong>Comment:</strong> {item.comment_cont}
            </p>
            <Rating
              name="read-only"
              value={item.rating_value}
              precision={0.5}
              readOnly
              className="profile-rating"
            />

            <p>
              <strong>Date:</strong>{" "}
              {new Date(item.created_at).toLocaleDateString()}
            </p>

            <div className="group-2">
              <div className="like-icon">
                {item.likes?.some((like) => like.user_id === loggedInUserId) ? (
                  <FavoriteIcon
                    fontSize="x-small"
                    onClick={() => handleUnlike(item.comment_id)}
                  />
                ) : (
                  <FavoriteBorderIcon
                    fontSize="x-small"
                    onClick={() => handleLike(item.comment_id)}
                  />
                )}

                {item.like_count > 0 && <span>{item.like_count}</span>}
              </div>
              {parseInt(id) === loggedInUserId ? (
                <DeleteIcon
                  fontSize="small"
                  onClick={() => handleDelete(item.comment_id)}
                  style={{ cursor: "pointer", color: "gray" }}
                />
              ) : (
                ""
              )}
            </div>
          </div>
        ))
      ) : (
        <p>No comments or ratings found.</p>
      )}

      {store.modalIsOpen && (
        <div className="modal-div">
          <>
            <div
              className="resilio-overlay"
              onClick={() => {
                actions.closeModal();
                document.body.classList.remove("modal-open");
              }}
            >
              {" "}
            </div>
            <Modal />
          </>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
