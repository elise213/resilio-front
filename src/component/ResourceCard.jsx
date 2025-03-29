import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import Styles from "../styles/resourceCard.css";
import Rating from "@mui/material/Rating";
import FavoriteButton from "./FavoriteButton";

const ResourceCard = (props) => {
  const { store, actions } = useContext(Context);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [ready, setReady] = useState(false);
  const CATEGORY_OPTIONS = store.CATEGORY_OPTIONS || [];
  const isLoggedIn = !!store.token;

  useEffect(() => {
    let isMounted = true;

    const fetchRating = async () => {
      await actions.getAverageRating(
        props.item.id,
        (avg) => {
          if (isMounted) setAverageRating(avg);
        },
        (count) => {
          if (isMounted) setRatingCount(count);
        }
      );
      if (isMounted) setReady(true);
    };

    if (props.item.id) {
      fetchRating();
    }

    return () => {
      isMounted = false;
    };
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
    const category = CATEGORY_OPTIONS.find((option) => option.id === catId);
    return category ? category.label : catId;
  };

  const categoryLabels = React.useMemo(() => {
    const categoryIds = normalizeCategories(props.item.category);
    return categoryIds.map((catId) => {
      const label = getLabelForCategory(catId);
      return label.charAt(0).toUpperCase() + label.slice(1);
    });
  }, [props.item.category, CATEGORY_OPTIONS]);

  if (!ready) return null; // Prevent partial card flashes

  return (
    <div
      className="my-resource-card"
      style={{ zIndex: "99999999" }}
      onClick={() => {
        actions.setSelectedResource(props.item);
        actions.openModal();
        console.log("called from resource card - open");
      }}
    >
      {props.item.image && (
        <img
          className="card-img"
          src={props.item.image}
          alt="profile picture"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      )}

      {categoryLabels.length > 0 && (
        <div className="card-description">
          <span className="resource-title">{props.item.name}</span>
          <div className="rating-div">
            <Rating
              style={{ flexDirection: "row" }}
              name="read-only"
              value={averageRating}
              precision={0.5}
              readOnly
              className="star"
              size="small"
            />
            {ratingCount > 0 && (
              <span style={{ fontSize: "12px", color: "gray" }}>
                ( {ratingCount} )
              </span>
            )}
          </div>
          {isLoggedIn && (
            <FavoriteButton resource={props.item} type={"card-favorite"} />
          )}
        </div>
      )}
    </div>
  );
};

export default ResourceCard;
