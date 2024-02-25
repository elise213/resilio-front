import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import Styles from "../styles/report.css";

const Report = () => {
  const { actions, store } = useContext(Context);
  const [report, setReport] = useState({});

  const getLabelForCategory = (categoryId) => {
    const category = store.CATEGORY_OPTIONS.find(
      (cat) => cat.id === categoryId
    );
    return category ? category.label : categoryId; // Return ID as fallback if no label is found
  };

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

    if (store?.mapResults?.length > 0) {
      // map results is all of the resources, without the filters

      store.mapResults.forEach((result) => {
        if (typeof result.category === "string") {
          // init categories
          let categories = result.category.split(",").map((cat) => cat.trim());
          categories.forEach((cat) => {
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
          });
        }
        // init schedule
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

      const validCategories = [
        "food",
        "health",
        "hygiene",
        "clothing",
        "shelter",
        "work",
        "wifi",
        "mental",
        "substance",
        "crisis",
        "bathroom",
        "youth",
        "sex",
        "women",
        "lgbtq",
        "babies",
        "migrant",
        "legal",
        "seniors",
      ];

      const filteredCategoryCounts = Object.keys(categoryCounts)
        .filter((key) => validCategories.includes(key.toLowerCase()))
        .reduce((obj, key) => {
          obj[key] = categoryCounts[key];
          return obj;
        }, {});

      setReport(filteredCategoryCounts);
      actions.setCategoryCounts(filteredCategoryCounts);
      actions.setDayCounts(dayCounts);
    }
  }, [store?.mapResults, store?.schedules]);

  return (
    <div className="report-container">
      In your area:
      <div className="grid-container">
        {Object.entries(report).map(([key, value], index) => {
          const colorStyle = actions.getColorForCategory(key);
          return (
            <div className="grid-item" key={index}>
              <div>
                <span>{value}</span>
                <span
                  className={`report-icon ${actions.getIconForCategory(key)}`}
                  style={colorStyle ? colorStyle : {}}
                ></span>
                <span>{getLabelForCategory(key)} </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Report;
