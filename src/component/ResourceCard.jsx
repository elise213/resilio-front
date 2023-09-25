import React, { useEffect } from "react";

const ResourceCard = (props) => {
  useEffect(() => {
    if (props.modalIsOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [props.modalIsOpen]);

  const getIconForCategory = (category) => {
    const icons = {
      health: "fa-solid fa-stethoscope",
      food: "fa-solid fa-bowl-rice",
      hygiene: "fa-solid fa-soap",
      bathroom: "fa-solid fa-toilet",
      work: "fa-solid fa-briefcase",
      wifi: "fa-solid fa-wifi",
      crisis: "fa-solid fa-exclamation-triangle",
      substance: "fa-solid fa-pills",
      legal: "fa-solid fa-gavel",
      sex: "fa-solid fa-heart",
      mental: "fa-solid fa-brain",
      women: "fa-solid fa-female",
      youth: "fa-solid fa-child",
      seniors: "fa-solid fa-blind",
      lgbtq: "fa-solid fa-rainbow",
      shelter: "fa-solid fa-person-shelter",
    };

    return icons[category] || "fa-solid fa-question";
  };

  // Convert input to an array of strings
  let categories = props.item.category;
  // If it's a string that contains commas, split and trim
  if (typeof categories === "string" && categories.includes(",")) {
    categories = categories.split(",").map((cat) => cat.trim());
  }
  // If it's just a single string without commas, wrap in an array
  else if (typeof categories === "string") {
    categories = [categories];
  }
  // If it's already an array, do nothing; else set to empty array
  else if (!Array.isArray(categories)) {
    categories = [];
  }

  let icon = "";

  if (categories.includes("health")) {
    icon = "fa-solid fa-stethoscope";
  } else if (categories.includes("food")) {
    icon = "fa-solid fa-bowl-rice";
  } else if (categories.includes("hygiene")) {
    icon = "fa-solid fa-soap";
  } else if (categories.includes("bathroom")) {
    icon = "fa-solid fa-toilet";
  } else if (categories.includes("work")) {
    icon = "fa-solid fa-briefcase";
  } else if (categories.includes("wifi")) {
    icon = "fa-solid fa-wifi";
  } else if (categories.includes("crisis")) {
    icon = "fa-solid fa-exclamation-triangle";
  } else if (categories.includes("substance")) {
    icon = "fa-solid fa-pills";
  } else if (categories.includes("legal")) {
    icon = "fa-solid fa-gavel";
  } else if (categories.includes("sex")) {
    icon = "fa-solid fa-heart";
  } else if (categories.includes("mental")) {
    icon = "fa-solid fa-brain";
  } else if (categories.includes("women")) {
    icon = "fa-solid fa-female";
  } else if (categories.includes("youth")) {
    icon = "fa-solid fa-child";
  } else if (categories.includes("seniors")) {
    icon = "fa-solid fa-blind";
  } else if (categories.includes("lgbtq")) {
    icon = "fa-solid fa-rainbow";
  } else if (categories.includes("shelter")) {
    icon = "fa-solid fa-person-shelter";
  } else {
    icon = "fa-solid fa-question";
  }

  return (
    <div
      className="my-resource-card"
      onClick={() => props.openModal(props.item)}
    >
      <div className="">
        <div className="resource-card-header">
          <div className="card-title-div">
            <p className="resource-title">{props.item.name}</p>
          </div>
        </div>
        {props.item.image && (
          <div className="card-image-container">
            <img
              className="card-img"
              src={props.item.image}
              alt="profile picture"
            />
          </div>
        )}
        <div className="icons-container">
          {categories.map((category, index) => (
            <i
              key={index}
              className={`${getIconForCategory(category)} card-icon`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
