import React, { useContext } from "react";
import { Context } from "../store/appContext";

const DaySelection = ({ days, onToggleDay, setDropdownOpen }) => {
  const context = useContext(Context);

  const daysColumns = [
    ["monday", "tuesday"],
    ["wednesday", "thursday"],
    ["friday", "saturday"],
    ["sunday", "all"]
  ];

  const handleEvent = (day) => () => {
    if (day !== "all") {
      onToggleDay(day);
    } else {
      handleAll();
    }
  };

  const handleAll = () => {
    daysColumns.flat().filter(day => day !== "all").forEach(day => {
      const setter = `set${day.charAt(0).toUpperCase() + day.slice(1)}`;
      if (typeof context[setter] === 'function') {
        context[setter](false);
      }
    });
    setDropdownOpen(false);
  };

  return (
    <div className="selection">
      {daysColumns.map((column, index) => (
        <div key={index} className="day-column">
          {column.map(day => (
            <div key={day} className="my-form-check">
              <input
                className="my-input2"
                type="checkbox"
                id={day}
                value={day}
                onChange={handleEvent(day)}
                checked={days[day]}
              />
              <label className="my-label" htmlFor={day}>
                {day === "all" ? "Any Day" : day.charAt(0).toUpperCase() + day.slice(1)}
              </label>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DaySelection;
