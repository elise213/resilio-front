import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Context } from "../store/appContext";
import Rating from "@mui/material/Rating";
import Swal from "sweetalert2";
import "../styles/profile.css";
import { Modal } from "../component";
import ResourceCard from "../component/ResourceCard";

const UserProfile = () => {
  const { store, actions } = useContext(Context);
  const { id } = useParams();
  const [userCommentsAndRatings, setUserCommentsAndRatings] = useState([]);
  const [userName, setUserName] = useState("");
  const [activeTab, setActiveTab] = useState("reviews"); // Default to "reviews"
  const loggedInUserId = parseInt(sessionStorage.getItem("user_id"), 10);

  useEffect(() => {
    actions.getCommentsAndRatingsForUser(id, setUserCommentsAndRatings);
    actions.getUserInfo(id).then((userInfo) => setUserName(userInfo.name));
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
      setTimeout(() => actions.openModal(), 0);
    }
  };

  return (
    <>
      <p className="close-modal">
        <Link to={`/`}>
          <span className="material-symbols-outlined">arrow_back_ios</span>
          Back to Search
        </Link>
      </p>
      <div className="profile-container">
        {/* Back Button */}

        {/* Toggle Switch */}
        <div className="toggle-container">
          <button
            className={
              activeTab === "reviews" ? "toggle-button active" : "toggle-button"
            }
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </button>
          <button
            className={
              activeTab === "favorites"
                ? "toggle-button active"
                : "toggle-button"
            }
            onClick={() => setActiveTab("favorites")}
          >
            Following
          </button>
        </div>

        {/* Content Switcher */}
        <div className="content-container">
          {activeTab === "reviews" ? (
            <div className="reviews-section">
              <span className="reviews-heading">My Reviews</span>
              {userCommentsAndRatings.length > 0 ? (
                userCommentsAndRatings.map((item, index) => (
                  <div key={index} className="user-review-profile">
                    <div className="review-header">
                      <p
                        onClick={() => handleOpenModal(item.resource_id)}
                        className="resource-link"
                      >
                        {item.resource_name}
                      </p>
                    </div>
                    <p className="review-text">{item.comment_cont}</p>
                    <Rating
                      name="read-only"
                      value={item.rating_value}
                      precision={0.5}
                      readOnly
                    />
                    <div className="review-footer">
                      <p>{new Date(item.created_at).toLocaleDateString()}</p>
                      {parseInt(id) === loggedInUserId && (
                        <button
                          onClick={() => handleDelete(item.comment_id)}
                          className="delete-button"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p>No reviews found.</p>
              )}
            </div>
          ) : (
            <div className="favorites-section">
              <span className="reviews-heading">Resources I'm Following </span>
              <ul className="favorites-list">
                {Array.isArray(store.favorites) &&
                store.favorites.length > 0 ? (
                  store.favorites.map((resource, index) => (
                    <ResourceCard
                      key={`${resource.id}-${index}`}
                      item={resource}
                    />
                  ))
                ) : (
                  <p>No favorite resources found.</p>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Modal */}
        {store.modalIsOpen && (
          <div className="modal-div">
            <Modal />
          </div>
        )}
      </div>
    </>
  );
};

export default UserProfile;
