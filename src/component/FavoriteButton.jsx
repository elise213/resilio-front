import React, { useState, useContext, useEffect } from "react";
import Tooltip from "@mui/material/Tooltip";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { Context } from "../store/appContext";

const FavoriteButton = ({ type, resource }) => {
  const { store, actions } = useContext(Context);
  const [isFavorited, setIsFavorited] = useState(null);

  useEffect(() => {
    if (resource?.id && Array.isArray(store.favorites)) {
      const favStatus = store.favorites.some((fav) => fav.id === resource.id);
      setIsFavorited(favStatus);
    }
  }, [store.favorites, resource?.id]);

  const handleToggleFavorite = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (isFavorited === null) return;

    if (isFavorited) {
      console.log("💔 Removing favorite:", resource.id);
      await actions.removeFavorite(resource.id);
      setIsFavorited(false);
    } else {
      console.log("🤍 Adding favorite:", resource.id);
      await actions.addFavorite(resource.id);
      setIsFavorited(true);
    }
  };

  if (isFavorited === null) return null; // 👈 Don't render until known

  return (
    <button
      type="button"
      className={`faveButton-div ${type}`}
      onClick={handleToggleFavorite}
      style={{ border: "none", backgroundColor: "transparent" }}
    >
      <Tooltip
        title={
          isFavorited
            ? "You follow this resource. Click to unfollow"
            : "Click to follow this resource"
        }
        arrow
      >
        {isFavorited ? (
          <BookmarkIcon fontSize="medium" />
        ) : (
          <BookmarkBorderIcon fontSize="medium" />
        )}
      </Tooltip>
    </button>
  );
};

export default FavoriteButton;
