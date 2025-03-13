import React from "react";
import Tooltip from "@mui/material/Tooltip";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

const FavoriteButton = ({ isFavorited, toggleFavorite }) => {
  return (
    <span
      style={{
        display: "inline-block",
        position: "relative",
        zIndex: "999",
        color: "black",
      }}
    >
      {" "}
      <Tooltip
        title={
          isFavorited
            ? "You follow this resource. Click to unfollow"
            : "Click to follow this resource"
        }
        arrow
      >
        <div className="modal-favorite-icon" onClick={toggleFavorite}>
          {isFavorited ? (
            <BookmarkIcon style={{ color: "green", cursor: "pointer" }} />
          ) : (
            <BookmarkBorderIcon style={{ cursor: "pointer" }} />
          )}
        </div>
      </Tooltip>
    </span>
  );
};

export default FavoriteButton;
