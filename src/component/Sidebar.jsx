import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/selection.css";
import { Context } from "../store/appContext";
import Login from "./Login";
import ResourceCard from "./ResourceCard";
import Contact from "./Contact";
import ErrorBoundary from "./ErrorBoundary";
import Selection from "./Selection";

import { Switch, FormControlLabel } from "@mui/material";
import { Tooltip, Icon } from "@mui/material";

const Sidebar = ({
  layout,
  setLayout,
  INITIAL_DAY_STATE,
  contactModalIsOpen,
  setContactModalIsOpen,
  categories,
  days,
  groups,
  log,
  loadingResults,
  searchingToday,
  setCategories,
  setDays,
  setGroups,
  setLog,
  setSearchingToday,
  aboutModalIsOpen,
  setAboutModalIsOpen,
  donationModalIsOpen,
  setDonationModalIsOpen,
  // fetchCachedBounds,
  handleBoundsChange,
  // userLocation,
  // setUserLocation,
  geoFindMe,
  updateCityStateFromZip,
}) => {
  const { store, actions } = useContext(Context);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasBoundaryResults, setHasBoundaryResults] = useState(false);
  const [activeTab, setActiveTab] = useState("AllResources");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [userSelectedFilter, setUserSelectedFilter] = useState(false);
  const [localZipInput, setLocalZipInput] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleZipInputChange = (e) => {
    const value = e.target.value;
    setLocalZipInput(value);

    if (value.length === 5) {
      updateCityStateFromZip(value);
    }
  };

  const areAllUnchecked = (stateObj) => {
    return Object.values(stateObj).every((value) => !value);
  };

  useEffect(() => {
    actions.fetchFavorites();
  }, []);

  useEffect(() => {
    const noCategorySelected = areAllUnchecked(categories);
    const noDaySelected = areAllUnchecked(days);

    setUserSelectedFilter(!(noCategorySelected && noDaySelected));
  }, [categories, days]);

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
                    &times;
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
                    &times;
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
                    &times;
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
    const checkLoginStatus = () => {
      const token = sessionStorage.getItem("token") || store.token;
      setIsLoggedIn(!!token);
    };
    checkLoginStatus();
  }, [store.token]);

  useEffect(() => {
    setHasBoundaryResults(
      !loadingResults &&
        !!store.boundaryResults &&
        store.boundaryResults.length > 0
    );
  }, [store.boundaryResults, loadingResults]);

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

  const navDivListClassName = openDropdown.category
    ? "nav-div-list open-dropdown"
    : openDropdown.day
    ? "nav-div-list open-dropday"
    : "nav-div-list";

  console.log("📌 Sidebar received loadingResults:", loadingResults);

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
                    />
                  }
                  label={layout === "fullscreen-map" ? "Map View" : "List View"}
                  labelPlacement="end"
                />
              </>
            )}
            <Login log={log} setLog={setLog} setLayout={setLayout} />
          </div>
          <div className="logo-div">
            <img className="top-logo" src="/assets/OV.png" alt="Resilio Logo" />
          </div>

          {loadingResults ? (
            <p style={{ textAlign: "center", margin: "20px" }}>Loading...</p>
          ) : store.boundaryResults.length > 0 ? (
            <>
              <div className=" nav-div">
                <div className="side-by">
                  <>
                    <Tooltip title="Find My Location" arrow>
                      <Icon onClick={geoFindMe} style={{ cursor: "pointer" }}>
                        my_location
                      </Icon>
                    </Tooltip>

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
                    <Tooltip title="Filter Resources" arrow>
                      <Icon
                        onClick={() => setIsModalOpen(true)}
                        style={{ cursor: "pointer" }}
                      >
                        tune
                      </Icon>
                    </Tooltip>
                  </>
                </div>

                {store.CATEGORY_OPTIONS &&
                store.DAY_OPTIONS &&
                store.GROUP_OPTIONS &&
                categories &&
                days &&
                groups ? (
                  <ErrorBoundary>
                    <Selection
                      openDropdown={openDropdown}
                      setOpenDropdown={setOpenDropdown}
                      handleBoundsChange={handleBoundsChange}
                      categories={categories}
                      setCategories={setCategories}
                      groups={groups}
                      setGroups={setGroups}
                      days={days}
                      setDays={setDays}
                      searchingToday={searchingToday}
                      setSearchingToday={setSearchingToday}
                      INITIAL_DAY_STATE={INITIAL_DAY_STATE}
                      areAllUnchecked={areAllUnchecked}
                      isModalOpen={isModalOpen}
                      setIsModalOpen={setIsModalOpen}
                    />
                  </ErrorBoundary>
                ) : (
                  <p>Loading selection options...</p>
                )}

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
                    {loadingResults ? (
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
          {/* MODALS!! */}

          {donationModalIsOpen && (
            <>
              <div className="new-modal donation">
                <p
                  className="close-modal"
                  onClick={() => setDonationModalIsOpen(false)}
                >
                  <span className="material-symbols-outlined">
                    arrow_back_ios
                  </span>
                  Back to search
                </p>

                <iframe
                  title="Donation form powered by Zeffy"
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    width: "100%",
                    height: "1200px",
                  }}
                  src="https://www.zeffy.com/en-US/embed/donation-form/cc33bc68-a2e1-4fd3-a1c6-88afd0cae253"
                  allowpaymentrequest
                  allowtransparency="true"
                ></iframe>
              </div>
            </>
          )}

          {aboutModalIsOpen && (
            <div className="new-modal">
              <p
                className="close-modal"
                onClick={() => setAboutModalIsOpen(false)}
              >
                <span className="material-symbols-outlined">
                  arrow_back_ios
                </span>
                Back to search
              </p>
              <p className="intro">Resilio is a 501(c)3 based in Austin, TX.</p>
            </div>
          )}

          {contactModalIsOpen && (
            <div className="new-modal">
              <p
                className="close-modal"
                onClick={() => setContactModalIsOpen(false)}
              >
                <span className="material-symbols-outlined">
                  arrow_back_ios
                </span>
                Back to search
              </p>
              <Contact />
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
