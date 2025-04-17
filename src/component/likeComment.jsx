import React, { useContext } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Swal from "sweetalert2";
import { Context } from "../store/appContext";

const LikeComment = ({
  comment,
  setComments,
  userIdFromSession,
  isLoggedIn,
}) => {
  const { actions } = useContext(Context);
  const isLiked = comment.likes?.some(
    (like) => Number(like.user_id) === Number(userIdFromSession)
  );
  const likeCount = comment.like_count || 0;

  const handleLike = () => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: "info",
        html: `You need to <a href="#" id="login-link" style="color: #4A90E2; text-decoration: underline; font-weight: 500;">log in</a> to like this comment.`,
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
      .likeComment(comment.comment_id)
      .then(() => {
        setComments((prev) =>
          prev.map((c) =>
            c.comment_id === comment.comment_id
              ? {
                  ...c,
                  like_count: c.like_count + 1,
                  likes: [
                    ...(c.likes || []),
                    { user_id: Number(userIdFromSession) },
                  ],
                }
              : c
          )
        );
      })
      .catch((err) => console.error("Error liking comment:", err));
  };

  const handleUnlike = () => {
    actions
      .unlikeComment(comment.comment_id)
      .then(() => {
        setComments((prev) =>
          prev.map((c) =>
            c.comment_id === comment.comment_id
              ? {
                  ...c,
                  like_count: Math.max(c.like_count - 1, 0),
                  likes: c.likes.filter(
                    (like) => Number(like.user_id) !== Number(userIdFromSession)
                  ),
                }
              : c
          )
        );
      })
      .catch((err) => console.error("Error unliking comment:", err));
  };

  const handleClick = () => {
    if (isLiked) {
      handleUnlike();
    } else {
      handleLike();
    }
  };

  return (
    <div className="like-icon" onClick={handleClick}>
      {isLiked ? (
        <FavoriteIcon
          sx={{ color: "red", cursor: "pointer" }}
          fontSize="x-small"
        />
      ) : (
        <FavoriteBorderIcon
          sx={{ color: "gray", cursor: "pointer" }}
          fontSize="x-small"
        />
      )}
      {likeCount > 0 && <span>{likeCount}</span>}
    </div>
  );
};

export default LikeComment;
