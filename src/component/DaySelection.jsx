import React, { useContext } from "react";
import { Context } from "../store/appContext";
const DaySelection = ({
  days,
  handleEvent,
  setMoreOpen
}) => {
  const { store, actions } = useContext(Context);
  return (
    <div className="selection">
      {store.daysColumns.map((column, index) => (
        <div key={index} className="day-column">
          {column.map(day => (
            <div key={day} className="my-form-check">
              <input
                className="my-input2"
                type="checkbox"
                id={day}
                value={day}
                onChange={() => handleEvent(day)}
                checked={day === "allDays" ? !Object.values(days).some(v => v) : !!days[day]}
              />
              {moreOpen &&
                <button className="my-schedule-button" onClick={() => setMoreOpen(!moreOpen)}>
                  See Fewer Choices
                </button>
              }
              <label className="my-label" htmlFor={day}>
                {day === "allDays" ? "Any Day" : day.charAt(0).toUpperCase() + day.slice(1)}
              </label>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DaySelection;
