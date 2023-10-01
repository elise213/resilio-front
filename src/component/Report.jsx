import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import Styles from "../styles/report.css";

const Report = () => {
  const { actions, store } = useContext(Context);
  const [report, setReport] = useState({});

  useEffect(() => {
    Object.keys(store.GROUP_OPTIONS || {}).forEach((key) => {
      console.log(key);
    });
  }, []);

  useEffect(() => {
    let score = {};

    if (store?.boundaryResults?.length > 0) {
      store.boundaryResults.forEach((result) => {
        if (typeof result.category === "string") {
          let categories = result.category.split(",").map((cat) => cat.trim());
          categories.forEach((cat) => {
            if (score.hasOwnProperty(cat)) {
              score[cat] += 1;
            } else {
              score[cat] = 1;
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
        "wifi",
        "crisis",
      ];
      const filteredScore = Object.keys(score)
        .filter((key) => validCategories.includes(key.toLowerCase()))
        .reduce((obj, key) => {
          obj[key] = score[key];
          return obj;
        }, {});

      setReport(filteredScore);
    }
  }, [store?.boundaryResults, store?.GROUP_OPTIONS]);

  return (
    <div className="report-container">
      Open today in your area:
      <div className="grid-container">
        {Object.entries(report).map(([key, value], index) => {
          const colorStyle = actions.getColorForCategory(key);
          return (
            <div className="grid-item" key={index}>
              <div>
                <span
                  className={`report-icon ${actions.getIconForCategory(key)}`}
                  style={colorStyle ? colorStyle : {}}
                ></span>
                <span>{key}: </span>
                <span>{value}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Report;
