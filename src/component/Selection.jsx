import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import styles from "../styles/selection.css";
import MyCheckbox from "./MyCheckbox";
import Report from "./Report";

const Selection = ({
  groups,
  setGroups,
  categories,
  setCategories,
  days,
  setDays,
  searchingToday,
  setSearchingToday,
  INITIAL_DAY_STATE,
}) => {
  const { store, actions } = useContext(Context);
  const categoryIds = store.CATEGORY_OPTIONS.map((option) => option.id);
  const groupIds = store.GROUP_OPTIONS.map((option) => option.id);
  const dayIds = store.DAY_OPTIONS.map((option) => option.id);

  const [showCategories, setShowCategories] = useState(true);
  const [showGroups, setShowGroups] = useState(true);
  const [showDays, setShowDays] = useState(true);
  const [activeCategoryIds, setActiveCategoryIds] = useState([]);
  const [visibleGroupCount, setVisibleGroupCount] = useState(0);
  const [visibleDaysCounts, setVisibleDaysCounts] = useState({
    monday: 0,
    tuesday: 0,
    wednesday: 0,
    thursday: 0,
    friday: 0,
    saturday: 0,
    sunday: 0,
  });
  const [allCategories, setAllCategories] = useState([]);

  const categoryCounts = store.categoryCounts || {};
  const dayCounts = store.dayCounts || {};

  useEffect(() => {
    if (searchingToday) {
      const today = new Date().getDay(); // get today's day as a number (0 = Sunday, 1 = Monday, etc.)
      const updatedDays = { ...INITIAL_DAY_STATE(store.DAY_OPTIONS) }; // reset all days to false
      switch (today) {
        case 0:
          updatedDays.sunday = true;
          break;
        case 1:
          updatedDays.monday = true;
          break;
        case 2:
          updatedDays.tuesday = true;
          break;
        case 3:
          updatedDays.wednesday = true;
          break;
        case 4:
          updatedDays.thursday = true;
          break;
        case 5:
          updatedDays.friday = true;
          break;
        case 6:
          updatedDays.saturday = true;
          break;
        default:
          break;
      }
      setDays(updatedDays);
    } else {
      const updatedDays = { ...INITIAL_DAY_STATE(store.DAY_OPTIONS) };
      setDays(updatedDays);
    }
  }, [searchingToday]);

  useEffect(() => {
    const today = new Date().getDay();
    let todayKey = "";

    switch (today) {
      case 0:
        todayKey = "sunday";
        break;
      case 1:
        todayKey = "monday";
        break;
      case 2:
        todayKey = "tuesday";
        break;
      case 3:
        todayKey = "wednesday";
        break;
      case 4:
        todayKey = "thursday";
        break;
      case 5:
        todayKey = "friday";
        break;
      case 6:
        todayKey = "saturday";
        break;
      default:
        break;
    }

    if (!days[todayKey]) {
      setSearchingToday(false);
    }
  }, [days]);

  useEffect(() => {
    if (Array.isArray(store.mapResults)) {
      const uniqueCategories = getUniqueCategoriesFromResults();
      setActiveCategoryIds(uniqueCategories);
      const allCats = uniqueCategories.flatMap((category) => {
        if (typeof category === "string") {
          return category.split(",").map((c) => c.trim());
        }
        return [];
      });
      setAllCategories(allCats);
    }
  }, [store.mapResults]);

  useEffect(() => {
    if (allCategories.length > 0) {
      const visibleGroups = groupIds.filter((id) => allCategories.includes(id));
      setVisibleGroupCount(visibleGroups.length);
    }
  }, [allCategories, store.mapResults]);

  useEffect(() => {
    const daysOfWeek = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    const visibleDaysCounts = {
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
      sunday: 0,
    };

    store.mapResults.forEach((item) => {
      const schedule = store.schedules.find(
        (schedule) => schedule.resource_id === item.id
      );
      if (schedule) {
        daysOfWeek.forEach((day) => {
          if (
            schedule[`${day}Start`] !== null &&
            schedule[`${day}End`] !== null &&
            schedule[`${day}Start`] !== "closed" &&
            schedule[`${day}End`] !== "closed"
          ) {
            visibleDaysCounts[day]++;
          }
        });
      }
    });

    setVisibleDaysCounts(visibleDaysCounts);
    actions.setDayCounts(visibleDaysCounts);
  }, [store.mapResults, store.schedules]);

  const getUniqueCategoriesFromResults = () => {
    const categorySet = new Set();
    if (Array.isArray(store.mapResults)) {
      store.mapResults.forEach((item) => categorySet.add(item.category));
    }
    return Array.from(categorySet);
  };

  const renderCenterColumn = (type, state, setState) => {
    const ids =
      type === "category" ? categoryIds : type === "group" ? groupIds : dayIds;
    const options =
      type === "category"
        ? store.CATEGORY_OPTIONS
        : type === "group"
        ? store.GROUP_OPTIONS
        : store.DAY_OPTIONS;

    return (
      <div className="center">
        <MyCheckbox
          key={`all-${type}`}
          id={`all-${type}`}
          label="All"
          isChecked={areAllUnchecked(state, ids)}
          handleToggle={() => handleToggleAll(setState, state, ids)}
        />
        {ids.map((id) => {
          const option = options.find((o) => o.id === id);
          const colorStyle =
            type !== "day" ? actions.getColorForCategory(id) : null;
          const count =
            type === "day"
              ? dayCounts[id] || ""
              : categoryCounts || ""
              ? categoryCounts[id] || ""
              : 0;

          return option &&
            (type !== "category" || allCategories.includes(id)) &&
            (type !== "group" || allCategories.includes(id)) ? (
            <div className="day-row2" key={id}>
              {type !== "day" && (
                <span
                  className={actions.getIconForCategory(id)}
                  style={colorStyle ? colorStyle : {}}
                ></span>
              )}
              {/* <MyCheckbox
                id={id}
                label={`${option.label} — ${count}`}
                isChecked={state[id]}
                handleToggle={() => handleToggle(setState, state, id)}
              /> */}
              <MyCheckbox
                id={id}
                label={`${option.label} — ${count}`}
                isChecked={categories[id]} // This should reflect the current state
                handleToggle={() => handleToggle(setCategories, categories, id)}
              />
            </div>
          ) : null;
        })}
      </div>
    );
  };

  const handleToggleAll = (setFn, stateObj, ids) => {
    if (isAnyChecked(stateObj, ids)) {
      const newState = {};
      ids.forEach((id) => {
        newState[id] = false;
      });
      setFn(newState);
    }
  };

  const isAnyChecked = (stateObj, ids) => {
    return ids.some((id) => stateObj[id]);
  };

  const areAllUnchecked = (stateObj, ids) => {
    return ids.every((id) => !stateObj[id]);
  };

  const handleToggle = (setFn, stateObj, id) => {
    setFn({
      ...stateObj,
      [id]: !stateObj[id],
    });
  };

  const toggleAllCheckboxes = (setFn, stateObj, ids) => {
    if (isAnyChecked(stateObj, ids)) {
      const newState = {};
      ids.forEach((id) => {
        newState[id] = false;
      });
      setFn(newState);
    }
  };

  useEffect(() => {
    console.log("Groups state:", groups);
    console.log("Days state:", days);
  }, [groups, days]);

  const getCheckedFiltersDisplay = () => {
    const checkedCategories = Object.entries(categories)
      .filter(([key, value]) => value)
      .map(
        ([key]) => store.CATEGORY_OPTIONS.find((opt) => opt.id === key)?.label
      )
      .filter((label) => label)
      .join(", ");
    const categoriesString = checkedCategories
      ? `Categories: ${checkedCategories}`
      : "";

    const checkedGroups = Object.entries(groups)
      .filter(([key, value]) => value)
      .map(([key]) => store.GROUP_OPTIONS.find((opt) => opt.id === key)?.label)
      .filter((label) => label) // Filter out any undefined labels
      .join(", ");
    const groupsString = checkedGroups ? `Groups: ${checkedGroups}` : "";

    const checkedDays = Object.entries(days)
      .filter(([key, value]) => value)
      .map(([key]) => store.DAY_OPTIONS.find((opt) => opt.id === key)?.label)
      .filter((label) => label) // Filter out any undefined labels
      .join(", ");
    const daysString = checkedDays ? `Days: ${checkedDays}` : "";

    const filterStrings = [categoriesString, groupsString, daysString].filter(
      (str) => str
    );
    return filterStrings.join(", ") || "No filters selected";
  };

  // Function to clear all filters
  const clearAllFilters = () => {
    const resetCategories = {};
    store.CATEGORY_OPTIONS.forEach((option) => {
      resetCategories[option.id] = false;
    });

    console.log(resetCategories);

    const resetGroups = {};
    store.GROUP_OPTIONS.forEach((option) => {
      resetGroups[option.id] = false;
    });

    const resetDays = {};
    store.DAY_OPTIONS.forEach((option) => {
      resetDays[option.id] = false;
    });

    setCategories(resetCategories);
    setGroups(resetGroups);
    setDays(resetDays);
    setSearchingToday(false);
  };

  return (
    <div className={"selection"}>
      <div className="checked-filters">
        {/* <p>Selected Filters: {getCheckedFiltersDisplay()}</p> */}
        <button onClick={clearAllFilters}>Clear All Filters</button>
      </div>
      <Report />

      {allCategories.length > 0 && (
        <div className={"cent"}>
          <div
            className={`select-header ${showCategories ? "header-open" : ""}`}
          >
            {showCategories && <p>Categories</p>}
          </div>

          {showCategories &&
            renderCenterColumn("category", categories, setCategories)}
        </div>
      )}

      {visibleGroupCount > 0 && (
        <div className={"cent"}>
          <div className={`select-header ${showGroups ? "header-open" : ""}`}>
            {showGroups && <p>Groups</p>}
          </div>
          {showGroups && renderCenterColumn("group", groups, setGroups)}
        </div>
      )}

      {Object.values(visibleDaysCounts).some((count) => count > 0) && (
        <div className={"cent"}>
          {!searchingToday && (
            <div style={{ width: "100%" }}>
              <div className={`select-header ${showDays ? "header-open" : ""}`}>
                {showDays && <p>Schedule</p>}
              </div>
              {showDays && renderCenterColumn("day", days, setDays)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Selection;
