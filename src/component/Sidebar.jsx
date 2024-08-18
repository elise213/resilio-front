import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/sidebar.css";
import { Context } from "../store/appContext";
import Login from "./Login";
import ResourceCard from "./ResourceCard";
import Contact from "./Contact";
import ErrorBoundary from "./ErrorBoundary";
import Selection from "./Selection";

const Sidebar = ({
  layout,
  setLayout,
  INITIAL_DAY_STATE,
  addSelectedResource,
  contactModalIsOpen,
  setContactModalIsOpen,
  categories,
  closeModal,
  days,
  groups,
  log,
  modalIsOpen,
  openLoginModal,
  setOpenLoginModal,
  openModal,
  removeSelectedResource,
  searchingToday,
  selectedResources,
  setCategories,
  setDays,
  setGroups,
  setLog,
  setModalIsOpen,
  setSearchingToday,
  aboutModalIsOpen,
  setAboutModalIsOpen,
  donationModalIsOpen,
  setDonationModalIsOpen,
  fetchCachedBounds,
  handleBoundsChange,
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
  const [openDropdown, setOpenDropdown] = useState({
    category: false,
    day: false,
  });

  // Manage layout state within the Sidebar component

  const handleZipInputChange = (e) => {
    const value = e.target.value;
    setLocalZipInput(value);
  };

  useEffect(() => {
    if (localZipInput.length === 5) {
      updateCityStateFromZip(localZipInput);
    }
  }, [localZipInput]);

  const updateCityStateFromZip = async (zip) => {
    try {
      const data = await fetchCachedBounds(zip, true);
      console.log("API Response:", data); // Add this line for debugging
      const location = data.results[0]?.geometry?.location;
      const bounds =
        data.results[0]?.geometry?.bounds ||
        data.results[0]?.geometry?.viewport;

      if (location && bounds) {
        handleBoundsChange({ center: location, bounds: bounds });
        await actions.setBoundaryResults(bounds, categories, days, groups);
      }
    } catch (error) {
      console.error("Error fetching bounds:", error.message);
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
    console.log("SC", selectedCategories);
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
          <div
            className="button-container-sidebar"
            style={{
              display: "flex",
              justifyContent: openLoginModal ? "center" : "flex-end",
            }}
          >
            {!openLoginModal && (
              <>
                <button
                  className="screen-divider-button"
                  onClick={() => setLayout("split-view")}
                >
                  Split View
                </button>
                <button
                  className="screen-divider-button"
                  onClick={() => setLayout("fullscreen-map")}
                >
                  Fullscreen Map
                </button>
                <button
                  className="screen-divider-button"
                  onClick={() => setLayout("fullscreen-sidebar")}
                >
                  Fullscreen List
                </button>
              </>
            )}
            <Login
              log={log}
              setLog={setLog}
              openLoginModal={openLoginModal}
              setOpenLoginModal={setOpenLoginModal}
            />
          </div>

          <div className="logo-div">
            <img className="top-logo" src="/assets/OV.png" alt="Resilio Logo" />
          </div>

          {hasBoundaryResults && store.boundaryResults.length > 0 && (
            <>
              <div className=" nav-div">
                <div className="side-by">
                  {store.boundaryResults && !userSelectedFilter && (
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
                  )}
                  {store.CATEGORY_OPTIONS &&
                  store.DAY_OPTIONS &&
                  store.GROUP_OPTIONS &&
                  categories &&
                  days &&
                  groups ? (
                    <ErrorBoundary>
                      <div className="dropdown">
                        <button
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
                          </div>
                        )}

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
                        />
                      </div>
                    </ErrorBoundary>
                  ) : (
                    <p>Loading selection options...</p>
                  )}
                </div>

                <div className={navDivListClassName}>
                  <div className="tab-buttons">
                    <div
                      className={
                        activeTab === "AllResources" ? "active" : "dormant"
                      }
                      onClick={() => setActiveTab("AllResources")}
                    >
                      {!userSelectedFilter && !searchQuery ? (
                        <p>
                          Map Boundary
                          {store.boundaryResults.length > 0
                            ? ` (${store.boundaryResults.length})`
                            : ""}
                        </p>
                      ) : (
                        <p>
                          Filtered Results
                          {store.boundaryResults.filter(
                            (resource) =>
                              resource.name
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase()) ||
                              (resource.description &&
                                resource.description
                                  .toLowerCase()
                                  .includes(searchQuery.toLowerCase()))
                          ).length > 0
                            ? ` (${
                                store.boundaryResults.filter(
                                  (resource) =>
                                    resource.name
                                      .toLowerCase()
                                      .includes(searchQuery.toLowerCase()) ||
                                    (resource.description &&
                                      resource.description
                                        .toLowerCase()
                                        .includes(searchQuery.toLowerCase()))
                                ).length
                              })`
                            : ""}
                        </p>
                      )}
                    </div>
                    <div
                      style={{ textAlign: "end" }}
                      className={
                        activeTab === "Favorites" ? "active" : "dormant"
                      }
                      onClick={() => setActiveTab("Favorites")}
                    >
                      Favorites
                      {store.favorites.length > 0
                        ? ` (${store.favorites.length})`
                        : ""}
                    </div>
                  </div>
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
                              <ResourceCard
                                number={index + 1}
                                key={resource.id}
                                item={resource}
                                openModal={openModal}
                                closeModal={closeModal}
                                modalIsOpen={modalIsOpen}
                                setModalIsOpen={setModalIsOpen}
                                selectedResources={selectedResources}
                                addSelectedResource={addSelectedResource}
                                removeSelectedResource={removeSelectedResource}
                              />
                            ))}
                      </ul>
                    )}
                    {!isLoggedIn && activeTab === "Favorites" && (
                      <div className="please-log">
                        Please
                        <span
                          role="button"
                          tabIndex={0}
                          className="log-in"
                          onClick={() => {
                            setOpenLoginModal(true);
                            setModalIsOpen(false);
                          }}
                        >
                          log in
                        </span>
                        to save favorites
                      </div>
                    )}

                    {activeTab === "Favorites" && isLoggedIn && (
                      <ul>
                        {Array.isArray(store.favorites) &&
                          store.favorites
                            .filter((resource) => {
                              const nameMatches =
                                resource.name &&
                                resource.name
                                  .toLowerCase()
                                  .includes(searchQuery.toLowerCase());
                              const descriptionMatches =
                                resource.description &&
                                resource.description
                                  .toLowerCase()
                                  .includes(searchQuery.toLowerCase());
                              return nameMatches || descriptionMatches;
                            })
                            .map((resource, index) => (
                              <ResourceCard
                                key={`${resource.id}-${index}`}
                                number={index + 1}
                                item={resource}
                                openModal={openModal}
                                closeModal={closeModal}
                                modalIsOpen={modalIsOpen}
                                setModalIsOpen={setModalIsOpen}
                                selectedResources={selectedResources}
                                addSelectedResource={addSelectedResource}
                                removeSelectedResource={removeSelectedResource}
                              />
                            ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </>
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
