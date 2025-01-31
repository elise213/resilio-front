import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import MyCheckbox from "./MyCheckbox";
import { Button } from "@mui/material";

const Selection = ({
  categories,
  setCategories,
  days,
  setDays,
  setIsModalOpen,
  isModalOpen,
}) => {
  const { store, actions } = useContext(Context);

  // Temporary states for pending selections
  const [pendingCategories, setPendingCategories] = useState(categories);
  const [pendingDays, setPendingDays] = useState(days);

  useEffect(() => {
    setPendingCategories(categories);
    setPendingDays(days);
  }, [categories, days]);

  // Debugging: Log Initial Store Data
  useEffect(() => {
    console.log("🟢 Store Schedules:", store.schedules);
    console.log("🔍 Unfiltered Map Results:", store.unfilteredMapResults);
    console.log("📊 Category Counts:", store.categoryCounts);
    console.log("📅 Day Counts:", store.dayCounts);
  }, [
    store.schedules,
    store.unfilteredMapResults,
    store.categoryCounts,
    store.dayCounts,
  ]);

  useEffect(() => {
    console.log("🚀 Running category/day count update...");

    if (!store.unfilteredMapResults) {
      console.log("⚠️ No unfilteredMapResults available yet, exiting...");
      return;
    }

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

    if (
      Array.isArray(store.unfilteredMapResults) &&
      store.unfilteredMapResults.length > 0
    ) {
      store.unfilteredMapResults.forEach((result) => {
        if (typeof result.category === "string") {
          let categories = result.category.split(",").map((cat) => cat.trim());
          categories.forEach((cat) => {
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
          });
        }

        const schedule = store.schedules?.[result.id];
        if (schedule) {
          Object.keys(dayCounts).forEach((day) => {
            const daySchedule = schedule[day];

            if (
              daySchedule &&
              daySchedule.start &&
              daySchedule.end &&
              daySchedule.start !== "closed" &&
              daySchedule.end !== "closed" &&
              daySchedule.start.trim() !== "" &&
              daySchedule.end.trim() !== ""
            ) {
              dayCounts[day]++;
            }
          });
        }
      });

      const validCategories =
        store.CATEGORY_OPTIONS?.map((option) => option.id) || [];
      const filteredCategoryCounts = Object.keys(categoryCounts)
        .filter((key) => validCategories.includes(key.toLowerCase()))
        .reduce((obj, key) => {
          obj[key] = categoryCounts[key];
          return obj;
        }, {});

      console.log("✅ New categoryCounts:", filteredCategoryCounts);
      console.log("✅ New dayCounts:", dayCounts);

      actions.setCategoryCounts(filteredCategoryCounts);
      actions.setDayCounts(dayCounts);
    } else {
      console.log("⚠️ No valid unfilteredMapResults detected.");
    }
  }, [store.unfilteredMapResults, store.schedules]);

  const COMBINED_OPTIONS = [
    ...(store.CATEGORY_OPTIONS || []),
    ...(store.GROUP_OPTIONS || []),
  ];

  const handleToggle = (setFn, stateObj, id) => {
    setFn((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const applyFilters = () => {
    console.log("🔹 Applying filters...");
    console.log("🔹 Pending Categories:", pendingCategories);
    console.log("🔹 Pending Days:", pendingDays);
    console.log(
      "🔹 Unfiltered Map Results Before Filtering:",
      store.unfilteredMapResults
    );

    const filteredResults = store.unfilteredMapResults.filter((result) => {
      const categoryMatch = Object.keys(pendingCategories).some(
        (cat) => pendingCategories[cat] && result.category.includes(cat)
      );

      const schedule = store.schedules?.[result.id];
      const dayMatch = Object.keys(pendingDays).some(
        (day) => pendingDays[day] && schedule?.[day]?.start !== "closed"
      );

      return (
        (categoryMatch ||
          Object.keys(pendingCategories).every((k) => !pendingCategories[k])) &&
        (dayMatch || Object.keys(pendingDays).every((k) => !pendingDays[k]))
      );
    });

    console.log("✅ Filtered Results:", filteredResults);

    setCategories(pendingCategories);
    setDays(pendingDays);
    actions.setBoundaryResults(filteredResults);
    setIsModalOpen(false);
  };

  const FilterModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="modal">
        <div className="modal-filter-header">
          <button className="close-filters" onClick={onClose}>
            x
          </button>
        </div>
        <div className="modal-content">
          <div className="filter-section">
            <p className="selection-titles">CATEGORIES</p>
            {COMBINED_OPTIONS.filter(
              (option) => store.categoryCounts?.[option.id] > 0
            ).map((option) => (
              <MyCheckbox
                key={option.id}
                id={option.id}
                label={`${option.label} (${store.categoryCounts[option.id]})`}
                isChecked={pendingCategories[option.id] || false}
                handleToggle={() =>
                  handleToggle(
                    setPendingCategories,
                    pendingCategories,
                    option.id
                  )
                }
              />
            ))}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div className="filter-section">
              <p className="selection-titles">DAYS</p>
              {store.DAY_OPTIONS.filter(
                (option) => store.dayCounts?.[option.id] > 0
              ).map((option) => (
                <MyCheckbox
                  key={option.id}
                  id={option.id}
                  label={`${option.label} (${store.dayCounts[option.id]})`}
                  isChecked={pendingDays[option.id] || false}
                  handleToggle={() =>
                    handleToggle(setPendingDays, pendingDays, option.id)
                  }
                />
              ))}
            </div>

            <Button
              variant="contained"
              color="primary"
              type="submit"
              className="form-button"
              onClick={applyFilters}
            >
              Apply Filters
            </Button>
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
