import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/navbar2.css";
import { Context } from "../store/appContext";
import Login from "./Login";
import ResourceCard from "./ResourceCard";
import Contact from "../component/Contact";
import ErrorBoundary from "../component/ErrorBoundary";
import Selection from "./Selection";
import Buttons from "../component/Buttons";

const Navbar2 = ({
  INITIAL_DAY_STATE,
  addSelectedResource,
  showContactModal,
  setShowContactModal,
  categories,
  closeModal,
  days,
  groups,
  handleZipInputChange,
  modalIsOpen,
  openLoginModal,
  openModal,
  removeSelectedResource,
  searchingToday,
  selectedResources,
  setCategories,
  setDays,
  setGroups,
  setModalIsOpen,
  setOpenLoginModal,
  setSearchingToday,
  zipInput,
}) => {
  const { store, actions } = useContext(Context);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasBoundaryResults, setHasBoundaryResults] = useState(false);
  const [activeTab, setActiveTab] = useState("AllResources");
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  const [aboutModalIsOpen, setAboutModalIsOpen] = useState(false);
  const [donationModalIsOpen, setDonationModalIsOpen] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);

  const [userSelectedFilter, setUserSelectedFilter] = useState(false);

  const areAllUnchecked = (stateObj) => {
    return Object.values(stateObj).every((value) => !value);
  };

  // useEffect(() => {
  //   actions.fetchFavorites();
  // }, [store.favorites]);

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

  // useEffect(() => {
  //   console.log(store.favorites);
  // }, [store.favorites]);

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

  function LocationDropdown() {
    const toggleLocationDropdown = () => {
      setIsLocationDropdownOpen(!isLocationDropdownOpen);
    };

    const locationDropdownIcon = isLocationDropdownOpen
      ? "expand_more"
      : "chevron_right";

    return (
      <div className="dropdown">
        <button className="dropdown-button" onClick={toggleLocationDropdown}>
          Location{" "}
          <span className="material-symbols-outlined">
            {locationDropdownIcon}
          </span>
        </button>
        {isLocationDropdownOpen && (
          <div className="dropdown-content">
            <input
              type="text"
              id="zipcode"
              value={zipInput}
              onChange={handleZipInputChange}
              maxLength="5"
              placeholder="Zip Code"
            />
          </div>
        )}
      </div>
    );
  }

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

  return (
    <>
      <nav className={`new-navbar open-nav`}>
        <div className={`navbar-content`}>
          <div className="logo-div">
            <img
              className="top-logo"
              src="/assets/RESILIOO.png"
              alt="Resilio Logo"
            />
            <Login
              openLoginModal={openLoginModal}
              setOpenLoginModal={setOpenLoginModal}
            />
          </div>
          <p className="tag-line">Free services in your neighborhood</p>

          {hasBoundaryResults && store.boundaryResults.length > 0 && (
            <>
              <div className=" nav-div">
                <div className="side-by">
                  <LocationDropdown />
                  {store.CATEGORY_OPTIONS &&
                  store.DAY_OPTIONS &&
                  store.GROUP_OPTIONS &&
                  categories &&
                  days &&
                  // store.boundaryResults > 1 &&
                  groups ? (
                    <ErrorBoundary>
                      <Selection
                        categories={categories}
                        setCategories={setCategories}
                        groups={groups}
                        setGroups={setGroups}
                        days={days}
                        setDays={setDays}
                        searchingToday={searchingToday}
                        setSearchingToday={setSearchingToday}
                        INITIAL_DAY_STATE={INITIAL_DAY_STATE}
                        zipInput={zipInput}
                        handleZipInputChange={handleZipInputChange}
                        areAllUnchecked={areAllUnchecked}
                      />
                    </ErrorBoundary>
                  ) : (
                    <p>Loading selection options...</p>
                  )}
                </div>

                {store.boundaryResults &&
                  // store.boundaryResults > 1 &&
                  !userSelectedFilter && (
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

                <div
                  className={
                    "nav-div-list" + (isLoggedIn ? "" : " more-margin")
                  }
                >
                  {isLoggedIn && (
                    <div className="tab-buttons">
                      <div
                        className={
                          activeTab === "AllResources" ? "active" : "dormant"
                        }
                        onClick={() => setActiveTab("AllResources")}
                      >
                        {!userSelectedFilter && !searchQuery ? (
                          <p>Map boundary</p>
                        ) : (
                          <p>Filtered Results</p>
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
                      </div>
                    </div>
                  )}
                  {activeTab === "AllResources" && (
                    <>
                      <CombinedFilters
                        searchQuery={searchQuery}
                        clearSearchQuery={clearSearchQuery}
                        selectedCategories={selectedCategories}
                        clearSelectedCategory={clearSelectedCategory}
                        selectedDays={selectedDays}
                        clearSelectedDay={clearSelectedDay}
                      />
                      <div
                        style={{
                          borderTop: isLoggedIn ? "" : "1px solid #ddd",
                          marginTop: isLoggedIn ? "" : "20px",
                          borderTopColor: isLoggedIn ? "" : "black",
                          borderLeftWidth: isLoggedIn ? "" : "1px",
                        }}
                        className="list-container"
                      >
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
                                  key={resource.id}
                                  item={resource}
                                  openModal={openModal}
                                  closeModal={closeModal}
                                  modalIsOpen={modalIsOpen}
                                  setModalIsOpen={setModalIsOpen}
                                  selectedResources={selectedResources}
                                  addSelectedResource={addSelectedResource}
                                  removeSelectedResource={
                                    removeSelectedResource
                                  }
                                  // setFavorites={setFavorites}
                                />
                              ))}
                        </ul>
                      </div>
                    </>
                  )}
                  {/* {activeTab === "Favorites" && isLoggedIn && (
                    <div className="list-container">
                      <ul>
                        {Array.isArray(store.mapResults) &&
                          store.favorites
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
                                key={`${resource.id}-${index}`}
                                item={resource}
                                openModal={openModal}
                                closeModal={closeModal}
                                modalIsOpen={modalIsOpen}
                                setModalIsOpen={setModalIsOpen}
                                selectedResources={selectedResources}
                                addSelectedResource={addSelectedResource}
                                removeSelectedResource={removeSelectedResource}
                                // setFavorites={setFavorites}
                              />
                            ))}
                      </ul>
                    </div>
                  )} */}
                  {activeTab === "Favorites" && isLoggedIn && (
                    <div className="list-container">
                      <ul>
                        {Array.isArray(store.mapResults) &&
                          store.favorites
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
                                key={`${resource.id}-${index}`}
                                item={resource}
                                openModal={openModal}
                                closeModal={closeModal}
                                modalIsOpen={modalIsOpen}
                                setModalIsOpen={setModalIsOpen}
                                selectedResources={selectedResources}
                                addSelectedResource={addSelectedResource}
                                removeSelectedResource={removeSelectedResource}
                                // setFavorites={setFavorites}
                              />
                            ))}
                      </ul>
                    </div>
                  )}
                </div>
                <Buttons
                  setAboutModalIsOpen={setAboutModalIsOpen}
                  setShowContactModal={setShowContactModal}
                  setDonationModalIsOpen={setDonationModalIsOpen}
                />
              </div>
            </>
          )}

          {/* MODALS!! */}

          {donationModalIsOpen && (
            <>
              <div className="donation-modal">
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
            <>
              <div className="donation-modal">
                <p
                  className="close-modal"
                  onClick={() => setAboutModalIsOpen(false)}
                >
                  <span className="material-symbols-outlined">
                    arrow_back_ios
                  </span>
                  Back to search
                </p>
                <p className="intro">
                  Resilio is a 501(c)3 based in Austin, TX.
                </p>
              </div>
            </>
          )}

          {showContactModal && (
            <div className="donation-modal">
              <p
                className="close-modal"
                onClick={() => setShowContactModal(false)}
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

export default Navbar2;
