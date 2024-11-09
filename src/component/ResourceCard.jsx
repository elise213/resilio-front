import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import Styles from "../styles/resourceCard.css";
import Rating from "@mui/material/Rating";

const ResourceCard = (props) => {
  const { store, actions } = useContext(Context);
  const [averageRating2, setAverageRating2] = useState(0);

  const CATEGORY_OPTIONS = store.CATEGORY_OPTIONS || [];
  const GROUP_OPTIONS = store.GROUP_OPTIONS || [];
  const COMBINED_OPTIONS = [...CATEGORY_OPTIONS, ...GROUP_OPTIONS];
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    console.log("Fetching average rating for resource ID:", props.item.id);
    actions.getAverageRating(props.item.id, setAverageRating2);
  }, []);

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

  useEffect(() => {
    if (store.modalIsOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => document.body.classList.remove("modal-open");
  }, [store.modalIsOpen]);

  return (
    <div
      className="my-resource-card"
      onClick={() => {
        actions.openModal(props.item);
        actions.setSelectedResource(props.item);
      }}
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
          <Rating
            style={{ flexDirection: "row" }}
            name="read-only"
            value={averageRating2}
            precision={0.5}
            readOnly
          />
        </div>
      )}
    </div>
  );
};

export default ResourceCard;
