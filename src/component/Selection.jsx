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
  fetchBounds,
  handleBoundsChange,
  groups,
}) => {
  const { store, actions } = useContext(Context);
  const groupIds = store.GROUP_OPTIONS.map((option) => option.id);

  // const [localZipInput, setLocalZipInput] = useState("");

  // const handleZipInputChange = (e) => {
  //   const value = e.target.value;
  //   setLocalZipInput(value);
  // };

  useEffect(() => {
    console.log("Selection component mounted");
    return () => {
      console.log("Selection component unmounted");
    };
  }, []);

  const COMBINED_OPTIONS = [
    ...(store.CATEGORY_OPTIONS || []),
    ...(store.GROUP_OPTIONS || []),
  ];

  const [openDropdown, setOpenDropdown] = useState({
    category: false,
    day: false,
  });

  function Dropdown({ id, title, children }) {
    const isOpen = openDropdown[id];

    const toggleDropdown = () => {
      setOpenDropdown((prev) => ({ ...prev, [id]: !prev[id] }));
    };
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

  // const categoryCounts = store.categoryCounts || {};
  const dayCounts = store.dayCounts || {};

  // const handleRemoveFilter = (id, type) => {
  //   const setState = type === "category" ? setCategories : setDays;
  //   const stateObj = type === "category" ? categories : days;
  //   setState({
  //     ...stateObj,
  //     [id]: false,
  //   });
  // };

  const renderDropdownColumn = (type, state, setState) => {
    const options = type === "category" ? COMBINED_OPTIONS : store.DAY_OPTIONS;
    const title = type.charAt(0).toUpperCase() + type.slice(1);

    // Use appropriate counts based on the type
    const counts = type === "day" ? dayCounts : store.categoryCounts || {};

    return (
      <Dropdown id={type} title={`${title}`}>
        {options
          .filter((option) => counts[option.id] && counts[option.id] > 0)
          .map((option) => {
            const count = counts[option.id];
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

  // const handleToggleAll = (setFn, stateObj, ids) => {
  //   if (isAnyChecked(stateObj, ids)) {
  //     const newState = {};
  //     ids.forEach((id) => {
  //       newState[id] = false;
  //     });
  //     setFn(newState);
  //   }
  // };

  // const isAnyChecked = (stateObj, ids) => {
  //   return ids.some((id) => stateObj[id]);
  // };

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
        {renderDropdownColumn("category", categories, setCategories)}
        {Object.values(visibleDaysCounts).some((count) => count > 0) &&
          renderDropdownColumn("day", days, setDays)}
      </div>
    </>
  );
};

export default Selection;
