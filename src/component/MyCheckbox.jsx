import React from "react";

const MyCheckbox = ({ id, label, isChecked, handleToggle }) => (
  // <div className="day-row" key={id}>
  <div className="my-form-check">
    <input
      className="my-input"
      type="checkbox"
      id={id}
      value={id}
      name="selection"
      checked={isChecked || false}
      onChange={() => handleToggle(id)}
    />
    <label className="my-label" htmlFor={id}>
      {label}
    </label>
  </div>
  // </div>
);

export default MyCheckbox;
