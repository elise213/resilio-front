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

  useEffect(() => {
    // if (
    //   !store.unfilteredMapResults ||
    //   store.unfilteredMapResults.length === 0
    // ) {
    //   console.warn(
    //     "⚠️ No unfiltered map results available. Waiting for data..."
    //   );
    //   return;
    // }

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

    store.unfilteredMapResults.forEach((result) => {
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

    // Update counts in store
    actions.setCategoryCounts(categoryCounts);
    actions.setDayCounts(dayCounts);
  }, [store.unfilteredMapResults, store.schedules]);

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

  // Filter Modal Component
  const applyFilters = () => {
    setCategories(pendingCategories);
    setDays(pendingDays);

    console.log("🔎 Applying filters...");
    actions.setBoundaryResults(
      Object.keys(pendingCategories).filter((key) => pendingCategories[key]), // Get only selected categories
      Object.keys(pendingDays).filter((key) => pendingDays[key]) // Get only selected days
    );

    setIsModalOpen(false);
  };

  const clearFilters = () => {
    setPendingCategories({});
    setPendingDays({});
    setCategories({});
    setDays({});

    console.log("🧹 Clearing filters...");
    actions.setBoundaryResults({}, {}); // Fetch everything again

    setIsModalOpen(false);
  };

  // const FilterModal = ({ isOpen, onClose }) => {
  //   if (!isOpen) return null;

  //   return (
  //     <div className="modal">
  //       <div className="modal-filter-header">
  //         <button className="close-filters" onClick={onClose}>
  //           X
  //         </button>
  //       </div>
  //       <div className="modal-content">
  //         {/* CATEGORIES SECTION */}
  //         <div className="filter-section">
  //           <p className="selection-titles">CATEGORIES</p>

  //           {COMBINED_OPTIONS.filter(
  //             (option) => store.categoryCounts[option.id] > 0
  //           ).map((option) => (
  //             <MyCheckbox
  //               key={option.id}
  //               id={option.id}
  //               label={`${option.label} (${store.categoryCounts[option.id]})`}
  //               isChecked={pendingCategories[option.id] || false}
  //               handleToggle={() =>
  //                 handleToggle(
  //                   setPendingCategories,
  //                   pendingCategories,
  //                   option.id
  //                 )
  //               }
  //             />
  //           ))}
  //         </div>

  //         <div
  //           style={{
  //             display: "flex",
  //             flexDirection: "column",
  //             justifyContent: "space-between",
  //           }}
  //         >
  //           {/* DAYS SECTION */}
  //           <div className="filter-section">
  //             <p className="selection-titles">DAYS</p>
  //             {store.DAY_OPTIONS.filter(
  //               (option) => store.dayCounts[option.id] > 0
  //             ).map((option) => (
  //               <MyCheckbox
  //                 key={option.id}
  //                 id={option.id}
  //                 label={`${option.label} (${store.dayCounts[option.id]})`}
  //                 isChecked={pendingDays[option.id] || false}
  //                 handleToggle={() =>
  //                   handleToggle(setPendingDays, pendingDays, option.id)
  //                 }
  //               />
  //             ))}
  //           </div>

  //           <Button
  //             variant="contained"
  //             color="primary"
  //             type="submit"
  //             className="form-button"
  //             onClick={applyFilters}
  //           >
  //             Apply Filters
  //           </Button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

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
            <div
              style={{ display: "flex", flexDirection: "column", gap: "5px" }}
            >
              <Button
                variant="contained"
                color="primary"
                type="submit"
                className="form-button"
                onClick={applyFilters}
              >
                Apply Filters
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                type="button"
                className="form-button"
                onClick={clearFilters}
                // style={{ marginTop: "10px" }}
              >
                Clear Filters
              </Button>
            </div>
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
