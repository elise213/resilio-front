import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/selection.css";
import { Context } from "../store/appContext";
import Login from "./Login";
import ResourceCard from "./ResourceCard";
import Contact from "./Contact";
import ErrorBoundary from "./ErrorBoundary";
import Selection from "./Selection";
import { IconButton, Menu, MenuItem, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { Switch, Box } from "@mui/material";

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
  handleBoundsChange,
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

  const NavigationMenu = () => {
    const { store, actions } = useContext(Context);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleMenuClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
      setAnchorEl(null);
    };

    return (
      <>
        {/* Menu Icon Button */}
        <IconButton onClick={handleMenuClick}>
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "x-large" }}
          >
            menu
          </span>
        </IconButton>

        {/* Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <MenuItem onClick={handleMenuClose}>
            <Link
              to="/emergency-resources"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Emergency Resources
            </Link>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <Link
              to="/donate"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Donate
            </Link>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <Link
              to="/about"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              About Us
            </Link>
          </MenuItem>
        </Menu>
      </>
    );
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
      !!store.boundaryResults && store.boundaryResults.length > 0
    );
  }, [store.boundaryResults]);

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

  const toggleLocationDropdown = () => {
    setIsLocationDropdownOpen(!isLocationDropdownOpen);
  };

  const locationDropdownIcon = isLocationDropdownOpen
    ? "expand_more"
    : "chevron_right";

  // Determine the class name based on the state of openDropdown
  const navDivListClassName = openDropdown.category
    ? "nav-div-list open-dropdown"
    : openDropdown.day
    ? "nav-div-list open-dropday"
    : "nav-div-list";

  return (
    <>
      <nav className={`new-navbar  ${layout}`}>
        <div className={`navbar-content`}>
          <div className="button-container-sidebar">
            <NavigationMenu />

            <Login log={log} setLog={setLog} setLayout={setLayout} />
          </div>
          <div className="logo-div">
            <img className="top-logo" src="/assets/OV.png" alt="Resilio Logo" />
          </div>

          <>
            <div className=" nav-div">
              <Button
                variant="contained"
                color="primary"
                onClick={geoFindMe}
                className="geo-button"
              >
                Find My Location
              </Button>
              <div className="side-by">
                <>
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
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="filter-button"
                  >
                    <span className="material-symbols-outlined">page_info</span>
                  </button>
                </>
                {/* )} */}
              </div>

              {store.CATEGORY_OPTIONS &&
              store.DAY_OPTIONS &&
              store.GROUP_OPTIONS &&
              categories &&
              days &&
              groups ? (
                <ErrorBoundary>
                  {/* <button
                            className="dropdown-button location"
                            onClick={toggleLocationDropdown}
                          >
                            Location{" "}
                            <span className="material-symbols-outlined">
                              {locationDropdownIcon}
                            </span>
                          </button>
                          {isLocationDropdownOpen && (
                            <div className="dropdown-content">
                              <input
                                type="text"
                                key="zip-code-input"
                                className="zipcode"
                                value={localZipInput}
                                onChange={handleZipInputChange}
                                maxLength="5"
                                placeholder="Zip Code"
                              />
                              <button className="geo-button" onClick={geoFindMe}>
                                Get My Location
                              </button>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={geoFindMe}
                                className="geo-button"
                              >
                                Find My Location
                              </Button>
                            </div>
                          )} */}

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
                {!hasBoundaryResults && !store.boundaryResults.length > 0 && (
                  <>
                    <span className="no-results-text">
                      {" "}
                      No results match your query. Please move the map or adjust
                      filters to find more resources{" "}
                    </span>
                  </>
                )}
                {hasBoundaryResults && store.boundaryResults.length > 0 && (
                  <div className={`list-container`}>
                    {activeTab === "AllResources" && (
                      <ul>
                        {Array.isArray(store.mapResults) &&
                          store.boundaryResults
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
                    )}
                  </div>
                )}
              </div>
              {!store.loginModalisOpen && (
                <Box
                  display="flex"
                  alignItems="center"
                  className="screen-divider-toggle"
                >
                  <span style={{ marginRight: "8px" }}>List View</span>
                  <Switch
                    checked={layout === "fullscreen-map"}
                    onChange={() =>
                      setLayout(
                        layout === "fullscreen-map"
                          ? "fullscreen-sidebar"
                          : "fullscreen-map"
                      )
                    }
                    color="primary"
                  />
                  <span style={{ marginLeft: "8px" }}>Map View</span>
                </Box>
              )}
            </div>
          </>

          {/* MODALS*/}

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
