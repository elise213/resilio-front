import React, { useContext } from "react";
import { Button, Tooltip } from "@mui/material";
import ZipCodeDropdown from "./zipCodeDropdown";
import styles from "../styles/geoLocationModal.css";
import { Context } from "../store/appContext";

const GeoLocationModal = ({
  setIsGeoModalOpen,
  resetFilters,
  mapInstance,
  setMapInstance,
  mapsInstance,
  setMapsInstance,
  updateCityStateFromZip,
  handleBoundsChange,
}) => {
  const { actions } = useContext(Context);

  const handleGeoFindMe = async () => {
    resetFilters();
    try {
      await actions.geoFindMe(mapInstance, mapsInstance);
      setIsGeoModalOpen(false);
    } catch (error) {
      console.error("Error in geoFindMe:", error);
    }
  };

  return (
    <div className="geo-modal">
      <Button
        onClick={handleGeoFindMe}
        style={{
          cursor: "pointer",
          backgroundColor: "transparent",
          color: "black",
        }}
      >
        Find my location
      </Button>

      <p>OR</p>
      <ZipCodeDropdown
        updateCityStateFromZip={updateCityStateFromZip}
        handleBoundsChange={handleBoundsChange}
        setIsGeoModalOpen={setIsGeoModalOpen}
      />
    </div>
  );
};

export default GeoLocationModal;
