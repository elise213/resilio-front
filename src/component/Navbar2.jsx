import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/navbar2.css";
import { Context } from "../store/appContext";
import Login from "./Login";
import ResourceCard from "./ResourceCard";
import Contact from "../component/Contact";
import EmailList from "../component/EmailList";
import ErrorBoundary from "../component/ErrorBoundary";
import Selection from "./Selection";
import Buttons from "../component/Buttons";
import Modal from "../component/Modal";

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
  isNavOpen,
  modalIsOpen,
  openLoginModal,
  openModal,
  removeSelectedResource,
  searchingToday,
  selectedResources,
  setCategories,
  setDays,
  setFavorites,
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

  // Function to clear selected categories
  const clearSelectedCategory = (category) => {
    setCategories((prevCategories) => {
      const updatedCategories = { ...prevCategories };
      updatedCategories[category] = false;
      return updatedCategories;
    });
  };

  // Function to clear selected days
  const clearSelectedDay = (day) => {
    setDays((prevDays) => {
      const updatedDays = { ...prevDays };
      updatedDays[day] = false;
      return updatedDays;
    });
  };

  const toggleLocationDropdown = () => {
    setIsLocationDropdownOpen(!isLocationDropdownOpen);
  };

  useEffect(() => {
    // Set the selected categories whenever the categories state changes
    setSelectedCategories(
      Object.keys(categories).filter((key) => categories[key])
    );
  }, [categories]);

  useEffect(() => {
    // Set the selected days whenever the days state changes
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
            <p className="active-filters-label">Your Active Filters:</p>
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
    return (
      <div className="dropdown">
        <button className="dropdown-button" onClick={toggleLocationDropdown}>
          Change Location
          <span className="material-symbols-outlined">
            {isLocationDropdownOpen ? "expand_less" : "expand_more"}
          </span>
        </button>
        {isLocationDropdownOpen && (
          <div className="dropdown-content">
            <input
              type="text"
              id="zipcode"
              // Assume zipInput and handleZipInputChange are defined in your component
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
    // Set the selected categories whenever the categories state changes
    setSelectedCategories(
      Object.keys(categories).filter((key) => categories[key])
    );
    console.log("SC", selectedCategories);
  }, [categories]);

  useEffect(() => {
    // Set the selected days whenever the days state changes
    setSelectedDays(Object.keys(days).filter((key) => days[key]));
  }, [days]);

  // Function to clear search query
  const clearSearchQuery = () => {
    setSearchQuery("");
  };

  return (
    <>
      <nav className={`new-navbar open-nav`}>
        <div className={`navbar-content`}>
          {/* <div className={`nav-div-row`}></div> */}
          <div className="logo-div">
            <img
              className="top-logo"
              src="/assets/RESILIOO.png"
              alt="Resilio Logo"
            />
            <p className="intro">Free resources in your neighborhood.</p>
          </div>

          {hasBoundaryResults && (
            <>
              <div className=" nav-div">
                <div className="side-by">
                  <div className="search-bar">
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <LocationDropdown />
                  {store.CATEGORY_OPTIONS &&
                  store.DAY_OPTIONS &&
                  store.GROUP_OPTIONS &&
                  categories &&
                  days &&
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
                      />
                    </ErrorBoundary>
                  ) : (
                    <p>Loading selection options...</p>
                  )}
                </div>

                {/* Show combined active filters */}
                <CombinedFilters
                  searchQuery={searchQuery}
                  clearSearchQuery={clearSearchQuery}
                  selectedCategories={selectedCategories}
                  clearSelectedCategory={clearSelectedCategory}
                  selectedDays={selectedDays}
                  clearSelectedDay={clearSelectedDay}
                />
                <Login
                  openLoginModal={openLoginModal}
                  setOpenLoginModal={setOpenLoginModal}
                />

                <div
                  className={
                    "nav-div-list" + (isLoggedIn ? "" : " more-margin")
                  }
                >
                  {isLoggedIn && (
                    <div className="tab-buttons">
                      <div
                        className={activeTab === "AllResources" ? "active" : ""}
                        onClick={() => setActiveTab("AllResources")}
                      >
                        All Resources
                      </div>
                      <div
                        className={activeTab === "Favorites" ? "active" : ""}
                        onClick={() => setActiveTab("Favorites")}
                      >
                        Favorites
                      </div>
                    </div>
                  )}
                  {activeTab === "AllResources" && (
                    <div className="list-container">
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
                                removeSelectedResource={removeSelectedResource}
                                setFavorites={setFavorites}
                              />
                            ))}
                      </ul>
                    </div>
                  )}
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
                                setFavorites={setFavorites}
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
                <p className="intro">
                  We are a 501(c)3, in need of donations and community support.
                  Please Email resourcemap001@gmail.com to connect with us.
                  Thank you very much.
                </p>
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
