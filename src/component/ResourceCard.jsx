import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import Styles from "../styles/resourceCard.css";
import Rating from "@mui/material/Rating";

const ResourceCard = (props) => {
  const { store, actions } = useContext(Context);
  const [averageRating2, setAverageRating2] = useState(0);
  const [ratingCount2, setRatingCount2] = useState(0);

  const CATEGORY_OPTIONS = store.CATEGORY_OPTIONS || [];
  const GROUP_OPTIONS = store.GROUP_OPTIONS || [];
  const COMBINED_OPTIONS = [...CATEGORY_OPTIONS, ...GROUP_OPTIONS];
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    // console.log("Fetching average rating for resource ID:", props.item.id);
    actions.getAverageRating(
      props.item.id,
      setAverageRating2,
      props.setRatingCount
    );
  }, []);

  useEffect(() => {
    actions.getAverageRating(props.item.id, setAverageRating2, setRatingCount2); // Pass both callbacks
  }, [props.item.id]);

  const normalizeCategories = (categories) => {
    if (!categories) return [];
    if (typeof categories === "string") {
      if (categories.includes(",")) {
        return categories.split(",").map((category) => category.trim());
      } else {
        return [categories.trim()];
      }
    }
    if (Array.isArray(categories)) return categories;
    console.warn("Unexpected category type:", typeof categories);
    return [];
  };

  const getLabelForCategory = (catId) => {
    const category = COMBINED_OPTIONS.find((option) => option.id === catId);
    return category ? category.label : catId;
  };

  const categoryLabels = React.useMemo(() => {
    const categoryIds = normalizeCategories(props.item.category);
    return categoryIds.map((catId) => {
      const label = getLabelForCategory(catId);
      return label.charAt(0).toUpperCase() + label.slice(1);
    });
  }, [props.item.category, CATEGORY_OPTIONS]);

  useEffect(() => {
    const storedFavorites = JSON.parse(
      sessionStorage.getItem("favorites") || "[]"
    );
    const isItemFavorited = storedFavorites.some(
      (favorite) => favorite.name === props.item.name
    );
    setIsFavorited(isItemFavorited);
  }, [props.item.name]);

  return (
    <div
      className="my-resource-card"
      onClick={() => {
        actions.setSelectedResource(props.item);
        actions.openModal();
        console.log("called from resource card - open");
      }}
    >
      <span className="resource-title">{props.item.name}</span>

      {props.item.image && (
        <img
          className="card-img"
          src={props.item.image}
          alt="profile picture"
          onError={(e) => {
            e.target.style.display = "none"; // Hides the broken image completely
          }}
        />
      )}

      {categoryLabels.length > 0 && (
        <div className="card-description">
          <div>
            {categoryLabels.map((label, index) => (
              <span key={index} className="category-span">
                {label}
              </span>
            ))}
          </div>
          <div className="rating-div">
            <Rating
              style={{ flexDirection: "row" }}
              name="read-only"
              value={averageRating2}
              precision={0.5}
              readOnly
              className="star"
            />
            <p className="ratingCount">({ratingCount2})</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceCard;
