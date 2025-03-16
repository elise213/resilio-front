import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/selection.css";
import { Context } from "../store/appContext";
import Login from "./Login";
import ResourceCard from "./ResourceCard";
import Contact from "./Contact";
import ErrorBoundary from "./ErrorBoundary";
// import Selection from "./Selection";
import { Switch, FormControlLabel } from "@mui/material";
import { Tooltip, Icon } from "@mui/material";
import ResilioDropdown from "./ResilioDropdown";

const Sidebar = ({
  layout,
  setLayout,
  categories,
  days,
  log,
  loadingResults,
  setCategories,
  setDays,
  setLog,
  IsFilterModalOpen,
  setIsFilterModalOpen,
  geoFindMe,
  updateCityStateFromZip,
}) => {
  const { store, actions } = useContext(Context);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasBoundaryResults, setHasBoundaryResults] = useState(false);
  const [activeTab, setActiveTab] = useState("AllResources");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [localZipInput, setLocalZipInput] = useState("");

  const [openDropdown, setOpenDropdown] = useState({
    category: false,
    day: false,
  });

  const handleToggleChange = (event) => {
    setLayout(event.target.checked ? "fullscreen-map" : "fullscreen-sidebar");
  };

  useEffect(() => {
    if (localZipInput.length === 5) {
      updateCityStateFromZip(localZipInput);
    }
  }, [localZipInput]);

  // const handleZipInputChange = (e) => {
  //   const value = e.target.value;
  //   setLocalZipInput(value);

  //   if (value.length === 5) {
  //     updateCityStateFromZip(value);
  //   }
  // };

  const clearSelectedCategory = (category) => {
    setCategories((prevCategories) => {
      const updatedCategories = { ...prevCategories };
      updatedCategories[category] = false;
      return updatedCategories;
    });
  };

  const clearSelectedDay = (day) => {
    setDays((prevDays) => {
      const updatedDays = { ...prevDays };
      updatedDays[day] = false;
      return updatedDays;
    });
  };

  useEffect(() => {
    setSelectedCategories(
      Object.keys(categories).filter((key) => categories[key])
    );
  }, [categories]);

  useEffect(() => {
    setSelectedDays(Object.keys(days).filter((key) => days[key]));
  }, [days]);

  const CombinedFilters = ({
    searchQuery,
    clearSearchQuery,
    selectedCategories,
    clearSelectedCategory,
    selectedDays,
    clearSelectedDay,
  }) => {
    return (
      <>
        {(searchQuery ||
          selectedDays.length > 0 ||
          selectedCategories.length > 0) && (
          <>
            <div className="active-filters">
              {searchQuery && (
                <div className="active-filter">
                  {searchQuery}{" "}
                  <div onClick={clearSearchQuery} style={{ cursor: "pointer" }}>
                    {/* &times; */} x
                  </div>
                </div>
              )}
              {selectedCategories.map((category) => (
                <div key={category} className="active-filter">
                  {category}{" "}
                  <div
                    onClick={() => clearSelectedCategory(category)}
                    style={{ cursor: "pointer" }}
                  >
                    {/* &times; */} x
                  </div>
                </div>
              ))}
              {selectedDays.map((day) => (
                <div key={day} className="active-filter">
                  {day}{" "}
                  <div
                    onClick={() => clearSelectedDay(day)}
                    style={{ cursor: "pointer" }}
                  >
                    {/* &times; */} x
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </>
    );
  };

  useEffect(() => {
    setHasBoundaryResults(
      !store.loadingResults &&
        !!store.boundaryResults &&
        store.boundaryResults.length > 0
    );
  }, [store.boundaryResults, store.loadingResults]);

  useEffect(() => {
    setSelectedCategories(
      Object.keys(categories).filter((key) => categories[key])
    );
  }, [categories]);

  useEffect(() => {
    setSelectedDays(Object.keys(days).filter((key) => days[key]));
  }, [days]);

  const clearSearchQuery = () => {
    setSearchQuery("");
  };

  const dropCategory = openDropdown.category;

  const navDivListClassName = dropCategory
    ? "nav-div-list open-dropdown"
    : openDropdown.day
    ? "nav-div-list open-dropday"
    : "nav-div-list";

  return (
    <>
      <nav className={`new-navbar  ${layout}`}>
        <div className={`navbar-content`}>
          <div className="button-container-sidebar" style={{ display: "flex" }}>
            {!store.loginModalisOpen && (
              <>
                <FormControlLabel
                  className="switcheroo"
                  control={
                    <Switch
                      checked={layout === "fullscreen-map"}
                      onChange={handleToggleChange}
                      color="primary"
                      size="small"
                    />
                  }
                  label={layout === "fullscreen-map" ? "Map View" : "List View"}
                  labelPlacement="end"
                />
              </>
            )}
            <div className="sidebar-dropdowns">
              <Login log={log} setLog={setLog} setLayout={setLayout} />
            </div>
          </div>
          <div className="logo-div">
            <img className="top-logo" src="/assets/OV.png" alt="Resilio Logo" />
          </div>

          {store.loadingResults ? (
            <p style={{ textAlign: "center", margin: "20px" }}>Loading...</p>
          ) : store.boundaryResults.length > 0 ? (
            <>
              <div className=" nav-div">
                <div className="side-by">
                  <>
                    <ResilioDropdown />

                    <div className="search-bar">
                      <span className="material-symbols-outlined search-icon">
                        search
                      </span>
                      <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <Tooltip title="Find My Location" arrow>
                      <Icon onClick={geoFindMe} style={{ cursor: "pointer" }}>
                        my_location
                      </Icon>
                    </Tooltip>
                    <Tooltip title="Filter Resources" arrow>
                      <Icon
                        onClick={() => {
                          setIsFilterModalOpen(true);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        tune
                      </Icon>
                    </Tooltip>
                  </>
                </div>

                <div className={navDivListClassName}>
                  {activeTab === "AllResources" && (
                    <CombinedFilters
                      searchQuery={searchQuery}
                      clearSearchQuery={clearSearchQuery}
                      selectedCategories={selectedCategories}
                      clearSelectedCategory={clearSelectedCategory}
                      selectedDays={selectedDays}
                      clearSelectedDay={clearSelectedDay}
                    />
                  )}
                  <div className="list-container">
                    {store.loadingResults ? (
                      <p style={{ textAlign: "center", margin: "20px" }}>
                        Loading...
                      </p>
                    ) : (
                      activeTab === "AllResources" && (
                        <ul>
                          {store.boundaryResults
                            .filter(
                              (resource) =>
                                resource.name
                                  .toLowerCase()
                                  .includes(searchQuery.toLowerCase()) ||
                                (resource.description &&
                                  resource.description
                                    .toLowerCase()
                                    .includes(searchQuery.toLowerCase()))
                            )
                            .map((resource, index) => (
                              <ResourceCard item={resource} key={index + 5} />
                            ))}
                        </ul>
                      )
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <span style={{ margin: "20px" }}>
              No results. Please zoom out or move the map to find resources.
            </span>
          )}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
