import React, { useState, useContext, useRef } from "react";
import { Context } from "../store/appContext";

const ZipCodeDropdown = ({ handleBoundsChange, setIsGeoModalOpen }) => {
  const { store, actions } = useContext(Context);
  const [zip, setZip] = useState("");

  const fetchCachedBounds = async (query, isZip = false) => {
    const cacheKey = `bounds-${JSON.stringify(query)}`;
    const cachedData = sessionStorage.getItem(cacheKey);
    if (cachedData) return JSON.parse(cachedData);

    let data = await actions.fetchBounds(query, isZip);
    if (data) sessionStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
  };

  const forcePanRef = useRef(false);

  const updateCityStateFromZip = async (zip) => {
    console.log(`🔍 Looking up ZIP: ${zip}`);
    actions.setForcePan(true);
    const data = await fetchCachedBounds(zip, true);
    if (!data) {
      console.error("❌ Error fetching bounds: No results found.");
      return;
    }
    const { location, bounds } = data;
    console.log("✅ Found location:", location);
    console.log("📏 Bounding Box:", bounds);
    handleBoundsChange({ center: location, bounds });
    await actions.setBoundaryResults(
      bounds,
      store.selectedCategories,
      store.selectedDays
    );
    setIsGeoModalOpen(false);
  };

  // const updateCityStateFromZip = async (zip) => {
  //   console.log(`🔍 Looking up ZIP: ${zip}`);
  //   const data = await fetchCachedBounds(zip, true);

  //   console.log("📌 Response from fetchCachedBounds:", data);

  //   if (!data) {
  //     console.error("❌ Error fetching bounds: No results found.");
  //     return;
  //   }

  //   const { location, bounds } = data;

  //   console.log("✅ Found location:", location);
  //   console.log("📏 Bounding Box:", bounds);

  //   handleBoundsChange({ center: location, bounds }); // Always recenters
  //   await actions.setBoundaryResults(
  //     bounds,
  //     store.selectedCategories,
  //     store.selectedDays
  //   );
  //   setIsGeoModalOpen(false);
  // };

  const handleZipChange = (e) => {
    const value = e.target.value;
    setZip(value);
    if (value.length === 5 && /^[0-9]{5}$/.test(value)) {
      updateCityStateFromZip(value);
    }
  };

  return (
    <div className="zip-dropdown-container" style={{ margin: "10px" }}>
      <input
        type="text"
        id="zip-code"
        value={zip}
        onChange={handleZipChange}
        placeholder="Enter ZIP"
        maxLength={5}
        inputMode="numeric"
        pattern="[0-9]*"
      />
    </div>
  );
};

export default ZipCodeDropdown;
