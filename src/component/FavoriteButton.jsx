import React, { useState, useContext, useEffect } from "react";
import Tooltip from "@mui/material/Tooltip";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { Context } from "../store/appContext";

const FavoriteButton = ({ type, resource }) => {
  const { store, actions } = useContext(Context);
  const [isFavorited, setIsFavorited] = useState(
    store.favorites?.some((fav) => fav.id === resource?.id)
  );

  useEffect(() => {
    setIsFavorited(store.favorites?.some((fav) => fav.id === resource?.id));
  }, [store.favorites, resource?.id]);

  const handleToggleFavorite = async (event) => {
    event.preventDefault(); // ✅ Prevent weird default actions
    event.stopPropagation(); // ✅ Stop bubbling to parent click events

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

  useEffect(() => {
    console.log("🧪 resource passed to FavoriteButton:", resource);
  }, [resource]);

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
