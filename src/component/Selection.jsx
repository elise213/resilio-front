import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import styles from "../styles/selection.css";
import MyCheckbox from "./MyCheckbox";
import Report from "./Report";

const Selection = ({
  categories,
  setCategories,
  days,
  setDays,
  areAllUnchecked,
  isLocationDropdownOpen,
  setIsLocationDropdownOpen,
  zipInput,
  handleZipInputChange,
}) => {
  const { store, actions } = useContext(Context);
  const categoryIds = store.CATEGORY_OPTIONS.map((option) => option.id);
  const groupIds = store.GROUP_OPTIONS.map((option) => option.id);
  const dayIds = store.DAY_OPTIONS.map((option) => option.id);

  const [openDropdown, setOpenDropdown] = useState({
    category: false,
    day: false,
  });

  function LocationDropdown() {
    const toggleLocationDropdown = () => {
      setIsLocationDropdownOpen(!isLocationDropdownOpen);
    };

    const locationDropdownIcon = isLocationDropdownOpen
      ? "expand_more"
      : "chevron_right";

    return (
      <div className="dropdown">
        <button className="dropdown-button" onClick={toggleLocationDropdown}>
          Location{" "}
          <span className="material-symbols-outlined">
            {locationDropdownIcon}
          </span>
        </button>
        {isLocationDropdownOpen && (
          <div className="dropdown-content">
            <input
              type="text"
              id="zipcode"
              value={zipInput}
              onChange={handleZipInputChange}
              maxLength="5"
              placeholder="Zip Code"
            />
          </div>
        )}
      </div>
    );
  }

  function Dropdown({ id, title, children }) {
    const isOpen = openDropdown[id];

    const toggleDropdown = () => {
      setOpenDropdown((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    // Conditionally set the icon based on the isOpen state
    const icon = isOpen ? "expand_more" : "chevron_right";

    return (
      <div className="dropdown">
        <button onClick={toggleDropdown} className="dropdown-button">
          {title} <span className="material-symbols-outlined">{icon}</span>
        </button>
        {isOpen && <div className="dropdown-content">{children}</div>}
      </div>
    );
  }

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

  const handleRemoveFilter = (id, type) => {
    const setState = type === "category" ? setCategories : setDays;
    const stateObj = type === "category" ? categories : days;
    setState({
      ...stateObj,
      [id]: false,
    });
  };

  const renderSelectedFilters = (state, type) => {
    return Object.entries(state)
      .filter(([, isSelected]) => isSelected)
      .map(([id]) => {
        const label =
          type === "category"
            ? store.CATEGORY_OPTIONS.find((option) => option.id === id)?.label
            : store.DAY_OPTIONS.find((option) => option.id === id)?.label;
        if (!label) return null; // If no label is found, don't render anything
        return (
          <div key={id} className="selected-filter">
            {label}{" "}
            <span
              className="material-symbols-outlined"
              onClick={() => handleRemoveFilter(id, type)}
            >
              close
            </span>
          </div>
        );
      });
  };

  const renderDropdownColumn = (type, state, setState) => {
    const ids =
      type === "category" ? categoryIds : type === "group" ? groupIds : dayIds;
    const options =
      type === "category"
        ? store.CATEGORY_OPTIONS
        : type === "group"
        ? store.GROUP_OPTIONS
        : store.DAY_OPTIONS;
    const title = type.charAt(0).toUpperCase() + type.slice(1); // Capitalize the first letter
    const counts = type === "day" ? dayCounts : categoryCounts; // Use dayCounts for "day" type, categoryCounts otherwise

    return (
      <Dropdown id={type} title={`${title}`}>
        <MyCheckbox
          key={`all-${type}`}
          id={`all-${type}`}
          label="All"
          isChecked={areAllUnchecked(state, ids)}
          handleToggle={() => handleToggleAll(setState, state, ids)}
        />
        {options
          .filter((option) => counts[option.id] && counts[option.id] > 0)
          .map((option) => {
            // Filter options based on their count
            const count = counts[option.id] || "";
            return (
              <MyCheckbox
                key={option.id}
                id={option.id}
                label={`${option.label} (${count})`}
                isChecked={state[option.id]}
                handleToggle={() => handleToggle(setState, state, option.id)}
              />
            );
          })}
      </Dropdown>
    );
  };

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

  const handleToggle = (setFn, stateObj, id) => {
    setFn({
      ...stateObj,
      [id]: !stateObj[id],
    });
  };

  return (
    <>
      <Report />
      <div className={"dropdowns-container"}>
        <LocationDropdown />

        {allCategories.length > 0 &&
          renderDropdownColumn("category", categories, setCategories)}
        {/* {visibleGroupCount > 0 &&
          renderDropdownColumn("group", groups, setGroups)} */}
        {Object.values(visibleDaysCounts).some((count) => count > 0) &&
          renderDropdownColumn("day", days, setDays)}
      </div>
    </>
  );
};

export default Selection;
