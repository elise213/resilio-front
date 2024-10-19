import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import MyCheckbox from "./MyCheckbox";

const Selection = ({
  categories,
  setCategories,
  days,
  setDays,
  setIsModalOpen,
  isModalOpen,
}) => {
  const { store, actions } = useContext(Context);

  // Calculate the category and day counts on boundaryResults
  useEffect(() => {
    let categoryCounts = {};
    let dayCounts = {
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
      sunday: 0,
    };

    if (store?.boundaryResults?.length > 0) {
      store.boundaryResults.forEach((result) => {
        // Count the categories
        if (typeof result.category === "string") {
          let categories = result.category.split(",").map((cat) => cat.trim());
          categories.forEach((cat) => {
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
          });
        }
        // Count the days based on schedule
        const schedule = store.schedules.find(
          (sched) => sched.resource_id === result.id
        );

        if (schedule) {
          Object.keys(dayCounts).forEach((day) => {
            if (
              schedule[`${day}Start`] !== "closed" &&
              schedule[`${day}End`] !== "closed"
            ) {
              dayCounts[day]++;
            }
          });
        }
      });

      // Filter valid categories from CATEGORY_OPTIONS
      const validCategories = store.CATEGORY_OPTIONS.map((option) => option.id);
      const filteredCategoryCounts = Object.keys(categoryCounts)
        .filter((key) => validCategories.includes(key.toLowerCase()))
        .reduce((obj, key) => {
          obj[key] = categoryCounts[key];
          return obj;
        }, {});

      // Update the global store with counts
      actions.setCategoryCounts(filteredCategoryCounts);
      actions.setDayCounts(dayCounts);
    }
  }, [store?.boundaryResults, store?.schedules]);

  const COMBINED_OPTIONS = [
    ...(store.CATEGORY_OPTIONS || []),
    ...(store.GROUP_OPTIONS || []),
  ];

  const handleToggle = (setFn, stateObj, id) => {
    setFn({
      ...stateObj,
      [id]: !stateObj[id],
    });
  };

  // Modal component to display filters
  const FilterModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="modal">
        <div className="modal-filter-header">
          <p>Filters</p>
          <button className="close-filters" onClick={onClose}>
            X
          </button>
        </div>
        <div className="modal-content">
          <div className="filter-section">
            <h3>Categories</h3>
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
            <h3>Days</h3>
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
      <FilterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Selection;
