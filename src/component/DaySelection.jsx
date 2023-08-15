import React, { useContext } from "react";
import { Context } from "../store/appContext";

const DaySelection = ({ setDropdownOpen, ...setters }) => {
  const { store, actions } = useContext(Context);

  const daysColumns = [["monday", "tuesday"],
  ["wednesday", "thursday"],
  ["friday", "saturday"],
  ["sunday", "all"]
  ];


  function handleEvent(day) {
    return function (event) {
      const element = event.target;
      if (day !== "all") {
        setters[`set${day.charAt(0).toUpperCase() + day.slice(1)}`](element.checked);
      } else {
        handleAll();
      }
    };
  }

  function handleAll() {
    daysColumns.flat().filter(day => day !== "all").forEach(day => setters[`set${day.charAt(0).toUpperCase() + day.slice(1)}`](false));
    setDropdownOpen(false);
  }

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
              />
              <label className="my-label" htmlFor={day}>
                {day === "all" ? "Any Day" : day.charAt(0).toUpperCase() + day.slice(1)}
              </label>
            </div>
          ))}
        </div>
      ))}
    </div>

  )
}

export default DaySelection;
