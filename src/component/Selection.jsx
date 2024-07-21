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
  handleBoundsChange,
  groups,
}) => {
  const { store, actions } = useContext(Context);
  const groupIds = store.GROUP_OPTIONS.map((option) => option.id);

  useEffect(() => {
    console.log("Selection component mounted");
    console.log("store.CATEGORY_OPTIONS:", store.CATEGORY_OPTIONS);
    console.log("store.GROUP_OPTIONS:", store.GROUP_OPTIONS);
    return () => {
      console.log("Selection component unmounted");
    };
  }, []);

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
      console.log("boundaryResults:", store.boundaryResults);
      console.log("schedules:", store.schedules);

      store.boundaryResults.forEach((result) => {
        if (typeof result.category === "string") {
          let categories = result.category.split(",").map((cat) => cat.trim());
          categories.forEach((cat) => {
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
          });
        }
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

      console.log("categoryCounts before filtering:", categoryCounts);

      const validCategories = store.CATEGORY_OPTIONS.map((option) => option.id);

      const filteredCategoryCounts = Object.keys(categoryCounts)
        .filter((key) => validCategories.includes(key.toLowerCase()))
        .reduce((obj, key) => {
          obj[key] = categoryCounts[key];
          return obj;
        }, {});

      console.log(
        "filteredCategoryCounts before action:",
        filteredCategoryCounts
      );

      actions.setCategoryCounts(filteredCategoryCounts);
      actions.setDayCounts(dayCounts);
    } else {
      console.log("No boundaryResults found");
    }
  }, [store?.boundaryResults, store?.schedules]);

  useEffect(() => {
    console.log("Updated store.categoryCounts:", store.categoryCounts);
  }, [store.categoryCounts]);

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

  const dayCounts = store.dayCounts || {};

  const renderDropdownColumn = (type, state, setState) => {
    const options = type === "category" ? COMBINED_OPTIONS : store.DAY_OPTIONS;
    const title = type.charAt(0).toUpperCase() + type.slice(1);

    // Use appropriate counts based on the type
    const counts = type === "day" ? dayCounts : store.categoryCounts || {};

    console.log(`Rendering ${type} dropdown with options:`, options);
    console.log(`Counts for ${type}:`, counts);

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
    if (Array.isArray(store.boundaryResults)) {
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
  }, [store.boundaryResults]);

  useEffect(() => {
    if (allCategories.length > 0) {
      const visibleGroups = groupIds.filter((id) => allCategories.includes(id));
      setVisibleGroupCount(visibleGroups.length);
    }
  }, [allCategories, store.boundaryResults]);

  useEffect(() => {
    const daysOfWeek = store.daysOfWeek;

    const visibleDaysCounts = {
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
      sunday: 0,
    };

    store.boundaryResults.forEach((item) => {
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
  }, [store.boundaryResults, store.schedules]);

  const getUniqueCategoriesFromResults = () => {
    const categorySet = new Set();
    if (Array.isArray(store.boundaryResults)) {
      store.boundaryResults.forEach((item) => {
        if (typeof item.category === "string") {
          item.category
            .split(",")
            .forEach((cat) => categorySet.add(cat.trim()));
        }
      });
    }
    return Array.from(categorySet);
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
        {renderDropdownColumn("category", categories, setCategories)}
        {Object.values(visibleDaysCounts).some((count) => count > 0) &&
          renderDropdownColumn("day", days, setDays)}
      </div>
    </>
  );
};

export default Selection;
