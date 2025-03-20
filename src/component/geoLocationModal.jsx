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
}) => {
  const { actions } = useContext(Context);

  const handleGeoFindMe = async () => {
    resetFilters();
    try {
      await actions.geoFindMe(mapInstance, mapsInstance); // Ensure it completes before closing the modal
      setIsGeoModalOpen(false);
    } catch (error) {
      console.error("Error in geoFindMe:", error);
    }
  };

  return (
    <div className="geo-modal">
      <Tooltip title="Find My Location" arrow>
        <Button onClick={handleGeoFindMe} style={{ cursor: "pointer" }}>
          Find my location
        </Button>
      </Tooltip>
      <p>OR</p>
      <ZipCodeDropdown updateCityStateFromZip={updateCityStateFromZip} />
    </div>
  );
};

export default GeoLocationModal;
