import React, { useContext, useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { Context } from "../store/appContext";

const FavoriteButton = ({ type, resource }) => {
  const { store, actions } = useContext(Context);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoritesLoaded, setFavoritesLoaded] = useState(true);

  useEffect(() => {
    const checkIfFavorited = () => {
      let parsedFavorites = [];

      try {
        const sessionFavorites = sessionStorage.getItem("favorites");

        // If sessionFavorites is not null and valid JSON, parse it, otherwise default to an empty array
        parsedFavorites = sessionFavorites ? JSON.parse(sessionFavorites) : [];

        // If parsing failed or the data is malformed, reset favorites in sessionStorage
        if (!Array.isArray(parsedFavorites)) {
          throw new Error("Favorites is not an array");
        }
      } catch (err) {
        console.warn(
          "⚠️ Could not parse session favorites. Resetting to an empty array."
        );
        sessionStorage.setItem("favorites", JSON.stringify([])); // Reset to empty array
        parsedFavorites = [];
        setFavoritesLoaded(false); // Mark favorites as not loaded
      }

      const storeFavorited = store.favorites?.some(
        (fav) => fav.id === resource.id
      );
      const sessionFavorited = parsedFavorites.some(
        (fav) => fav.id === resource.id
      );

      setIsFavorited(storeFavorited || sessionFavorited);
    };

    checkIfFavorited();
  }, [store.favorites, resource.id]);

  const handleToggleFavorite = async (event) => {
    event.stopPropagation();

    if (isFavorited) {
      console.log("💔 Removing favorite:", resource.id);
      await actions.removeFavorite(resource.id);
    } else {
      console.log("🤍 Adding favorite:", resource.id);
      await actions.addFavorite(resource.id);
    }

    setIsFavorited((prev) => !prev);
  };

  // If favorites data is not loaded properly, don't render anything
  if (!favoritesLoaded) {
    return null;
  }

  return (
    <div className={`faveButton-div ${type}`} onClick={handleToggleFavorite}>
      <Tooltip
        title={
          isFavorited
            ? "You follow this resource. Click to unfollow"
            : "Click to follow this resource"
        }
        arrow
      >
        {/* Only the icon is wrapped in the Tooltip */}
        {isFavorited ? (
          <BookmarkIcon fontSize="medium" />
        ) : (
          <BookmarkBorderIcon fontSize="medium" />
        )}
      </Tooltip>
    </div>
  );
};

export default FavoriteButton;
