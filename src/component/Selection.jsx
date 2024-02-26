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

  function Dropdown({ title, children }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    return (
      <div className="dropdown">
        <button onClick={toggleDropdown} className="dropdown-button">
          {title}
        </button>
        {isOpen && <div className="dropdown-content">{children}</div>}
      </div>
    );
  }

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

    return (
      <Dropdown title={title}>
        <MyCheckbox
          key={`all-${type}`}
          id={`all-${type}`}
          label="All"
          isChecked={areAllUnchecked(state, ids)}
          handleToggle={() => handleToggleAll(setState, state, ids)}
        />
        {options.map((option) => {
          const count =
            type === "day"
              ? dayCounts[option.id] || ""
              : categoryCounts[option.id] || "";
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
              <MyCheckbox
                id={id}
                label={`${option.label} (${count})`}
                isChecked={state[id]}
                handleToggle={() => handleToggle(setState, state, id)}
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

  return (
    <div className={"selection"}>
      <Report />
      <div className={"dropdowns-container"}>
        {allCategories.length > 0 &&
          showCategories &&
          renderDropdownColumn("category", categories, setCategories)}
        {visibleGroupCount > 0 &&
          showGroups &&
          renderDropdownColumn("group", groups, setGroups)}
        {Object.values(visibleDaysCounts).some((count) => count > 0) &&
          showDays &&
          renderDropdownColumn("day", days, setDays)}
      </div>
    </div>
  );
};

export default Selection;
