import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import MyCheckbox from "./MyCheckbox";
import { Avatar, Menu, MenuItem, IconButton, Button } from "@mui/material";

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

  // Debugging: Log schedules
  useEffect(() => {
    console.log("📢 Store Schedules:", store.schedules);
  }, [store.schedules]);

  console.log("🟢 CATEGORY_OPTIONS:", store.CATEGORY_OPTIONS);
  console.log("🟢 DAY_OPTIONS:", store.DAY_OPTIONS);
  console.log("🟢 categoryCounts:", store.categoryCounts);
  console.log("🟢 dayCounts:", store.dayCounts);

  useEffect(() => {
    console.log("📍 Updated map results:", store.boundaryResults);
  }, [store.boundaryResults]);

  // useEffect(() => {
  //   console.log(
  //     "🔍 Unfiltered Map Results BEFORE processing:",
  //     store.unfilteredMapResults
  //   );

  //   let categoryCounts = {};
  //   let dayCounts = {
  //     monday: 0,
  //     tuesday: 0,
  //     wednesday: 0,
  //     thursday: 0,
  //     friday: 0,
  //     saturday: 0,
  //     sunday: 0,
  //   };

  //   if (store?.unfilteredMapResults?.length > 0) {
  //     store.unfilteredMapResults.forEach((result) => {
  //       // Count categories correctly
  //       if (typeof result.category === "string") {
  //         let categories = result.category.split(",").map((cat) => cat.trim());
  //         categories.forEach((cat) => {
  //           categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  //         });
  //       }

  //       // Count open days
  //       const schedule = store.schedules[result.id];
  //       if (schedule) {
  //         Object.keys(dayCounts).forEach((day) => {
  //           const daySchedule = schedule[day];

  //           if (
  //             daySchedule &&
  //             daySchedule.start &&
  //             daySchedule.end &&
  //             daySchedule.start !== "closed" &&
  //             daySchedule.end !== "closed" &&
  //             daySchedule.start.trim() !== "" &&
  //             daySchedule.end.trim() !== ""
  //           ) {
  //             dayCounts[day]++;
  //           }
  //         });
  //       }
  //     });

  //     console.log(" Before Filtering - Raw categoryCounts:", categoryCounts);
  //     console.log("Before Filtering - Raw dayCounts:", dayCounts);
  //     console.log(" CATEGORY_OPTIONS in store:", store.CATEGORY_OPTIONS);

  //     // Filter out invalid categories (categories not in CATEGORY_OPTIONS)
  //     const validCategories = store.CATEGORY_OPTIONS.map((option) => option.id);
  //     const filteredCategoryCounts = Object.keys(categoryCounts)
  //       .filter((key) => validCategories.includes(key.toLowerCase()))
  //       .reduce((obj, key) => {
  //         obj[key] = categoryCounts[key];
  //         return obj;
  //       }, {});

  //     console.log("After Filtering - categoryCounts:", filteredCategoryCounts);
  //     console.log("After Filtering - dayCounts:", dayCounts);

  //     // ✅ Save the counts **once** when unfiltered data is set
  //     actions.setCategoryCounts(filteredCategoryCounts);
  //     actions.setDayCounts(dayCounts);
  //   }
  // }, [store?.unfilteredMapResults, store?.schedules]);

  useEffect(() => {
    console.log(
      "🟡 Before setting unfilteredMapResults:",
      store.unfilteredMapResults
    );
  }, [store.unfilteredMapResults]);

  // useEffect(() => {
  //   if (
  //     !store.unfilteredMapResults ||
  //     store.unfilteredMapResults.length === 0
  //   ) {
  //     console.warn("⚠️ No unfiltered results available. Waiting for data...");
  //     return;
  //   }

  //   let categoryCounts = {};
  //   let dayCounts = {
  //     monday: 0,
  //     tuesday: 0,
  //     wednesday: 0,
  //     thursday: 0,
  //     friday: 0,
  //     saturday: 0,
  //     sunday: 0,
  //   };

  //   console.log(
  //     "🔍 Processing unfilteredMapResults:",
  //     store.unfilteredMapResults
  //   );

  //   store.unfilteredMapResults.forEach((result) => {
  //     // Count categories
  //     if (typeof result.category === "string") {
  //       let categories = result.category.split(",").map((cat) => cat.trim());
  //       categories.forEach((cat) => {
  //         categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  //       });
  //     }

  //     // Count open days
  //     const schedule = store.schedules[result.id];
  //     if (schedule) {
  //       Object.keys(dayCounts).forEach((day) => {
  //         const daySchedule = schedule[day];

  //         if (
  //           daySchedule &&
  //           daySchedule.start &&
  //           daySchedule.end &&
  //           daySchedule.start !== "closed" &&
  //           daySchedule.end !== "closed" &&
  //           daySchedule.start.trim() !== "" &&
  //           daySchedule.end.trim() !== ""
  //         ) {
  //           dayCounts[day]++;
  //         }
  //       });
  //     }
  //   });

  //   console.log(
  //     "✅ Final categoryCounts before updating store:",
  //     categoryCounts
  //   );
  //   console.log("✅ Final dayCounts before updating store:", dayCounts);

  //   // Update counts in store
  //   actions.setCategoryCounts(categoryCounts);
  //   actions.setDayCounts(dayCounts);
  // }, [store.unfilteredMapResults, store.schedules]);

  useEffect(() => {
    if (!store.mapResults || store.mapResults.length === 0) {
      console.warn("⚠️ No map results available. Waiting for data...");
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

    console.log("🔍 Processing mapResults:", store.mapResults);

    store.mapResults.forEach((result) => {
      // Count categories
      if (typeof result.category === "string") {
        let categories = result.category.split(",").map((cat) => cat.trim());
        categories.forEach((cat) => {
          categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        });
      }

      // Count open days
      const schedule = store.schedules[result.id];
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

    console.log(
      "✅ Final categoryCounts before updating store:",
      categoryCounts
    );
    console.log("✅ Final dayCounts before updating store:", dayCounts);

    // Update counts in store
    actions.setCategoryCounts(categoryCounts);
    actions.setDayCounts(dayCounts);
  }, [store.mapResults, store.schedules]); // Ensure counts update when `mapResults` changes

  const COMBINED_OPTIONS = [
    ...(store.CATEGORY_OPTIONS || []),
    ...(store.GROUP_OPTIONS || []),
  ];

  // Handle checkbox changes in temporary state
  const handleToggle = (setFn, stateObj, id) => {
    setFn((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Apply filters when the button is clicked
  // const applyFilters = () => {
  //   console.log(
  //     "🔍 Applying filters with pendingCategories:",
  //     pendingCategories
  //   );
  //   console.log("🔍 Applying filters with pendingDays:", pendingDays);

  //   const filteredResults = store.unfilteredMapResults.filter((result) => {
  //     console.log("result:", result);

  //     const categoryMatch = Object.keys(pendingCategories).some(
  //       (cat) => pendingCategories[cat] && result.category.includes(cat)
  //     );

  //     const schedule = store.schedules[result.id];
  //     const dayMatch = Object.keys(pendingDays).some(
  //       (day) => pendingDays[day] && schedule?.[day]?.start !== "closed"
  //     );

  //     console.log(
  //       "👉 Category match:",
  //       categoryMatch,
  //       "👉 Day match:",
  //       dayMatch
  //     );

  //     return (
  //       (categoryMatch ||
  //         Object.keys(pendingCategories).every((k) => !pendingCategories[k])) &&
  //       (dayMatch || Object.keys(pendingDays).every((k) => !pendingDays[k]))
  //     );
  //   });

  //   console.log("Final Filtered Results:", filteredResults);

  //   // ✅ Do NOT update categoryCounts or dayCounts here!
  //   setCategories(pendingCategories);
  //   setDays(pendingDays);
  //   actions.setBoundaryResults(filteredResults); // Only updates results
  //   setIsModalOpen(false);

  // };
  const applyFilters = () => {
    console.log(
      "🔍 Applying filters with pendingCategories:",
      pendingCategories
    );
    console.log("🔍 Applying filters with pendingDays:", pendingDays);

    setCategories(pendingCategories);
    setDays(pendingDays);

    // Fetch fresh results from backend instead of filtering locally
    actions.setBoundaryResults(
      store.bounds,
      pendingCategories,
      pendingDays,
      store.groups
    );

    setIsModalOpen(false);
  };

  // Filter Modal Component
  const FilterModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="modal">
        <div className="modal-filter-header">
          <button className="close-filters" onClick={onClose}>
            X
          </button>
        </div>
        <div className="modal-content">
          {/* CATEGORIES SECTION */}
          <div className="filter-section">
            <p className="selection-titles">CATEGORIES</p>

            {COMBINED_OPTIONS.filter(
              (option) => store.categoryCounts[option.id] > 0
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
            {/* DAYS SECTION */}
            <div className="filter-section">
              <p className="selection-titles">DAYS</p>
              {store.DAY_OPTIONS.filter(
                (option) => store.dayCounts[option.id] > 0
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
