import React, { useState } from "react";

const ZipCodeDropdown = ({ updateCityStateFromZip }) => {
  const [zip, setZip] = useState("");

  const handleZipChange = (e) => {
    const value = e.target.value;
    setZip(value);
    if (value.length === 5 && /^[0-9]{5}$/.test(value)) {
      updateCityStateFromZip(value);
    }
  };

  return (
    <div className="zip-dropdown-container">
      {/* <label htmlFor="zip-code">Enter ZIP Code:</label> */}
      <input
        type="text"
        id="zip-code"
        value={zip}
        onChange={handleZipChange}
        placeholder="Enter ZIP"
        maxLength={5}
      />
    </div>
  );
};

export default ZipCodeDropdown;
