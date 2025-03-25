import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import MyCheckbox from "./MyCheckbox";
import styles from "../styles/selection.css";

const Selection = ({
  isFilterModalOpen,
  setIsFilterModalOpen,
  handleCategoryChange,
  handleDayChange,
  categories,
  days,
}) => {
  const { store } = useContext(Context);

  const [localCategories, setLocalCategories] = useState({ ...categories });
  const [localDays, setLocalDays] = useState({ ...days });

  useEffect(() => {
    setLocalCategories({ ...categories });
    setLocalDays({ ...days });
  }, [isFilterModalOpen, categories, days]);

  const toggleLocalCategory = (id) => {
    setLocalCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleLocalDay = (id) => {
    setLocalDays((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleApplyLocalFilters = () => {
    Object.entries(localCategories).forEach(([id, value]) => {
      if (categories[id] !== value) handleCategoryChange(id);
    });

    Object.entries(localDays).forEach(([id, value]) => {
      if (days[id] !== value) handleDayChange(id);
    });

    setIsFilterModalOpen(false);
  };

  return (
    <>
      {isFilterModalOpen && (
        <div className="filter-modal">
          <div className="modal-filter-header">
            <button
              className="close-filters"
              onClick={() => setIsFilterModalOpen(false)}
            >
              X
            </button>
          </div>
          <div className="filter-modal-content">
            <div className="filter-section">
              <p className="selection-heading">Categories</p>
              {store.CATEGORY_OPTIONS.map((option) => (
                <MyCheckbox
                  key={option.id}
                  id={option.id}
                  label={`${option.label} (${
                    store.categoryCounts?.[option.id] || 0
                  })`}
                  isChecked={!!localCategories[option.id]}
                  handleToggle={() => toggleLocalCategory(option.id)}
                />
              ))}
            </div>

            <div className="filter-section">
              <div>
                <p className="selection-heading">Days</p>
                {store.DAY_OPTIONS.map((option) => (
                  <MyCheckbox
                    key={option.id}
                    id={option.id}
                    label={`${option.label} (${
                      store.dayCounts?.[option.id] || 0
                    })`}
                    isChecked={!!localDays[option.id]}
                    handleToggle={() => toggleLocalDay(option.id)}
                  />
                ))}
              </div>
              <div className="filter-modal-footer">
                <button
                  className="apply-button"
                  onClick={handleApplyLocalFilters}
                >
                  Apply Filters
                </button>
                <button
                  className="reset-button"
                  onClick={() => {
                    setLocalCategories({});
                    setLocalDays({});
                    resetFilters();
                  }}
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Selection;
