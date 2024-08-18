import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import Styles from "../styles/resourceCard.css";
import Rating from "@mui/material/Rating";

const ResourceCard = (props) => {
  const { store, actions } = useContext(Context);
  const [averageRating2, setAverageRating2] = useState(0);

  useEffect(() => {
    actions.getAverageRating(props.item.id, setAverageRating2);
  }, [props.item.id, actions]);

  const CATEGORY_OPTIONS = store.CATEGORY_OPTIONS || [];
  const GROUP_OPTIONS = store.GROUP_OPTIONS || [];

  // Combine CATEGORY_OPTIONS and GROUP_OPTIONS into a single array
  const COMBINED_OPTIONS = [...CATEGORY_OPTIONS, ...GROUP_OPTIONS];

  // Function to normalize categories into an array
  const normalizeCategories = (categories) => {
    if (!categories) return []; // Handle null, undefined, and empty string

    // Check if categories is a string and contains commas
    if (typeof categories === "string") {
      if (categories.includes(",")) {
        // Split the string into an array based on commas and trim whitespace
        return categories.split(",").map((category) => category.trim());
      } else {
        // Handle a single category in a string (no commas)
        return [categories.trim()];
      }
    }

    // Handle the case where categories is already an array
    if (Array.isArray(categories)) return categories;

    // Fallback for unexpected category types
    console.warn("Unexpected category type:", typeof categories);
    return [];
  };

  // Function to get label for a given category ID
  const getLabelForCategory = (catId) => {
    const category = COMBINED_OPTIONS.find((option) => option.id === catId);
    return category ? category.label : catId; // Return the label if found; otherwise, return the ID
  };

  // Process category IDs to labels
  const categoryLabels = React.useMemo(() => {
    const categoryIds = normalizeCategories(props.item.category);
    return categoryIds.map((catId) => {
      const label = getLabelForCategory(catId);
      return label.charAt(0).toUpperCase() + label.slice(1);
    });
  }, [props.item.category, CATEGORY_OPTIONS]);

  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const storedFavorites = JSON.parse(
      sessionStorage.getItem("favorites") || "[]"
    );
    const isItemFavorited = storedFavorites.some(
      (favorite) => favorite.name === props.item.name
    );
    setIsFavorited(isItemFavorited);
  }, [props.item.name]);

  useEffect(() => {
    if (props.modalIsOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => document.body.classList.remove("modal-open");
  }, [props.modalIsOpen]);

  return (
    <div
      className="my-resource-card"
      onClick={() => props.openModal(props.item)}
    >
      <span className="resource-title">{props.item.name}</span>
      {props.item.image && (
        <img
          className="card-img"
          src={props.item.image}
          alt="profile picture"
        />
      )}
      {categoryLabels.length > 0 && (
        <div className="card-description">
          {categoryLabels.map((label, index) => (
            <span key={index} className="category-span">
              {label}
            </span>
          ))}
        </div>
      )}

      <Rating
        style={{ flexDirection: "row" }}
        name="read-only"
        value={averageRating2}
        precision={0.5}
        readOnly
      />
    </div>
  );
};

export default ResourceCard;
