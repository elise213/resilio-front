import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import MyCheckbox from "./MyCheckbox";
import styles from "../styles/selection.css";

const Selection = ({
  categories,
  setCategories,
  days,
  setDays,
  isFilterModalOpen,
  setIsFilterModalOpen,
}) => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    let categoryCounts = {};

    if (!store.boundaryResults?.length) return;

    store.boundaryResults.forEach((resource) => {
      if (typeof resource.category === "string") {
        let resourceCategories = resource.category
          .split(",")
          .map((cat) => cat.trim().toLowerCase());

        resourceCategories.forEach((cat) => {
          if (store.CATEGORY_OPTIONS.some((option) => option.id === cat)) {
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
          }
        });
      }
    });
    actions.setCategoryCounts(categoryCounts);
  }, [store.boundaryResults]);

  // ---- DAY COUNTS ---- //
  useEffect(() => {
    let dayCounts = store.DAY_OPTIONS.reduce((acc, day) => {
      acc[day.id] = 0;
      return acc;
    }, {});
    if (!store.boundaryResults?.length) {
      console.log("⚠️ No boundaryResults available.");
      return;
    }
    store.boundaryResults.forEach((resource) => {
      if (!resource.schedule) {
        return;
      }
      store.DAY_OPTIONS.forEach((day) => {
        const daySchedule = resource.schedule[day.id];
        if (!daySchedule) {
          return;
        }
        if (
          daySchedule.start &&
          daySchedule.start !== "closed" &&
          daySchedule.start !== "" &&
          daySchedule.end &&
          daySchedule.end !== "closed" &&
          daySchedule.end !== ""
        ) {
          dayCounts[day.id]++;
        } else {
        }
      });
    });

    actions.setDayCounts({ ...dayCounts });
  }, [store.boundaryResults]);

  const COMBINED_OPTIONS = [...(store.CATEGORY_OPTIONS || [])];

  const handleToggle = (setFn, stateObj, id) => {
    setFn({
      ...stateObj,
      [id]: !stateObj[id],
    });
  };

  const FilterModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="filter-modal">
        <div className="modal-filter-header">
          <button className="close-filters" onClick={onClose}>
            X
          </button>
        </div>
        <div className="filter-modal-content">
          <div className="filter-section">
            <p className="selection-heading">Categories</p>
            {COMBINED_OPTIONS.map((option) => (
              <MyCheckbox
                key={option.id}
                id={option.id}
                label={`${option.label} (${
                  store.categoryCounts[option.id] || 0
                })`}
                isChecked={categories[option.id]}
                handleToggle={() =>
                  handleToggle(setCategories, categories, option.id)
                }
              />
            ))}
          </div>
          <div className="filter-section">
            <p className="selection-heading">Days</p>
            {store.DAY_OPTIONS.map((option) => (
              <MyCheckbox
                key={option.id}
                id={option.id}
                label={`${option.label} (${store.dayCounts[option.id] || 0})`}
                isChecked={days[option.id]}
                handleToggle={() => handleToggle(setDays, days, option.id)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
    </>
  );
};

export default Selection;
