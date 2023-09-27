import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import styles from "../styles/selection.css";
import MyCheckbox from "./MyCheckbox";

const Selection = (props) => {
  const { store, actions } = useContext(Context);
  const categoryIds = store.CATEGORY_OPTIONS.map((option) => option.id);
  const groupIds = store.GROUP_OPTIONS.map((option) => option.id);
  const dayIds = store.DAY_OPTIONS.map((option) => option.id);

  const [showCategories, setShowCategories] = useState(false);
  const [showGroups, setShowGroups] = useState(false);
  const [showDays, setShowDays] = useState(false);

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
          return option ? (
            <MyCheckbox
              key={id}
              id={id}
              label={option.label}
              isChecked={state[id]}
              handleToggle={() => handleToggle(setState, state, id)}
            />
          ) : null;
        })}
      </div>
    );
  };
  const isAnyChecked = (stateObj, ids) => {
    return ids.some((id) => stateObj[id]);
  };

  const handleToggleAll = (setFn, stateObj, ids) => {
    console.log(
      "handleToggleAll called with stateObj:",
      stateObj,
      "and ids:",
      ids
    );

    if (isAnyChecked(stateObj, ids)) {
      const newState = {};
      ids.forEach((id) => {
        newState[id] = false;
      });
      setFn(newState);
    }
  };

  const areAllUnchecked = (stateObj, ids) => {
    console.log(
      "areAllUnchecked called with stateObj:",
      stateObj,
      "and ids:",
      ids
    );
    return ids.every((id) => !stateObj[id]);
  };

  const handleToggle = (setFn, stateObj, id) => {
    setFn({
      ...stateObj,
      [id]: !stateObj[id],
    });
  };

  useEffect(() => {
    console.log("Categories", props.categories);
    console.log("Days", props.days);
    console.log("Groups", props.groups);
  }, [props.categories, props.days, props.groups]);

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
    <div className="selection">
      <div className="cent">
        <button
          onClick={() => {
            setShowCategories(!showCategories);
            if (showCategories) {
              toggleAllCheckboxes(
                props.setCategories,
                props.categories,
                categoryIds
              );
            }
          }}
          className={showCategories ? "open2" : "closed2"}
        >
          {showCategories ? "X" : "Filter By Category"}
        </button>
        {showCategories &&
          renderCenterColumn("category", props.categories, props.setCategories)}
      </div>

      <div className="cent">
        <button
          onClick={() => {
            setShowGroups(!showGroups);
            if (showGroups) {
              toggleAllCheckboxes(props.setGroups, props.groups, groupIds);
            }
          }}
          className={showGroups ? "open2" : "closed2"}
        >
          {showGroups ? "X" : "Filter By Group"}
        </button>
        {showGroups &&
          renderCenterColumn("group", props.groups, props.setGroups)}
      </div>

      <div className="cent">
        <button
          onClick={() => {
            setShowDays(!showDays);
            if (showDays) {
              toggleAllCheckboxes(props.setDays, props.days, dayIds);
            }
          }}
          className={showDays ? "open2" : "closed2"}
        >
          {showDays ? "X" : "Filter By Day"}
        </button>
        {showDays && renderCenterColumn("day", props.days, props.setDays)}
      </div>
    </div>
  );
};

export default Selection;
