import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import Styles from "../styles/resourceCard.css";

const ResourceCard = (props) => {
  const { store } = useContext(Context);

  // Assume CATEGORY_OPTIONS and GROUP_OPTIONS are provided through context and are arrays
  const CATEGORY_OPTIONS = store.CATEGORY_OPTIONS || [];

  // Function to get label for a given category ID
  const getLabelForCategory = (catId) => {
    const category = CATEGORY_OPTIONS.find((option) => option.id === catId);
    return category ? category.label : catId; // Return the label if found; otherwise, return the ID
  };

  // Process category IDs to labels
  const categoryLabels = React.useMemo(() => {
    if (!props.item.category) return [];
    // Ensure we're working with an array of category IDs
    const categoryIds = Array.isArray(props.item.category)
      ? props.item.category
      : [props.item.category];
    // Convert each ID to its label, capitalize the first letter of each label
    return categoryIds.map((catId) => {
      const label = getLabelForCategory(catId);
      return label.charAt(0).toUpperCase() + label.slice(1); // Capitalize first letter
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
      <div className="resource-card-header">
        <span className="resource-title">{props.item.name}</span>
      </div>
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
    </div>
  );
};

export default ResourceCard;
