import React, { useContext } from "react";
import { Context } from "../store/appContext";

const DaySelection = ({
  days,
  handleEvent,
  setMoreOpen,
  moreOpen
}) => {
  const { store, actions } = useContext(Context);
  return (
    <div className="selection">
      {store.daysColumns.flatMap((column, index) =>
        column.map(day => (
          <div key={day} className="day-column">
            <div className="my-form-check">
              <input
                className="my-input2"
                type="checkbox"
                id={day}
                value={day}
                onChange={() => handleEvent(day)}
                checked={day === "allDays" ? !Object.values(days).some(v => v) : !!days[day]}
              />
              <label className="my-label" htmlFor={day}>
                {day === "allDays" ? "Any Day" : day.charAt(0).toUpperCase() + day.slice(1)}
              </label>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DaySelection;