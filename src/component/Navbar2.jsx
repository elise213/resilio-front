import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/navbar2.css";
import { Context } from "../store/appContext";
import Login from "./Login";
import ResourceCard from "./ResourceCard";
import Contact from "../component/Contact";
import EmailList from "../component/EmailList";
import ErrorBoundary from "../component/ErrorBoundary";
import Selection from "./Selection";
import ToolBox from "./ToolBox";

const Navbar2 = ({
  INITIAL_DAY_STATE,
  addSelectedResource,
  backSide,
  categories,
  closeModal,
  days,
  groups,
  geoFindMe,
  handleZipInputChange,
  isDeckOpen,
  isFavoritesOpen,
  isNavOpen,
  isToolBoxOpen,
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
  setIsDeckOpen,
  setIsFavoritesOpen,
  setIsNavOpen,
  setIsToolBoxOpen,
  setModalIsOpen,
  setOpenLoginModal,
  setSearchingToday,
  toggleNav,
  toggleToolButtonRef,
  zipInput,
}) => {
  const { store, actions } = useContext(Context);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasBoundaryResults, setHasBoundaryResults] = useState(false);
  // const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  // const toggleLocation = () => {
  //   setIsLocationOpen(!isLocationOpen);
  // };

  const toggleLocationDropdown = () => {
    setIsLocationDropdownOpen(!isLocationDropdownOpen);
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
            {/* Zip code input and any other location change functionality */}
            <p className="intro">
              Please enter a zip code to navigate to a location that is
              participating in our platform.
            </p>
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

  return (
    <>
      <nav className={`new-navbar ${isNavOpen ? "open-nav" : ""}`}>
        <div className={`navbar-content`}>
          <div className={`nav-div-row`}>
            <div>
              <img
                className="top-logo"
                src="/assets/RESILIOO.png"
                alt="Resilio Logo"
              />
              <p className="intro">Find free resources near you.</p>
            </div>
            <Login
              openLoginModal={openLoginModal}
              setOpenLoginModal={setOpenLoginModal}
            />
          </div>

          <LocationDropdown />
          {/* <div>
            <button onClick={toggleLocation}>Change Location</button>

            {isLocationOpen && (
              <div className="list-container">
                <p className="intro">
                  Please enter a zip code to navigate to a location that is
                  participating in our platform.
                </p>
                <div className="stack">
                  <input
                    type="text"
                    id="zipcode"
                    value={zipInput}
                    onChange={handleZipInputChange}
                    maxLength="5"
                    placeholder="Zip Code"
                  />
                </div>
              </div>
            )}
          </div> */}

          {hasBoundaryResults ? (
            <>
              <div className=" nav-div">
                <div className="side-by">
                  <span className="intro">Filter Resources </span>
                  <div className="search-bar">
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <ToolBox
                    backSide={backSide}
                    categories={categories}
                    setCategories={setCategories}
                    groups={groups}
                    setGroups={setGroups}
                    days={days}
                    setDays={setDays}
                    searchingToday={searchingToday}
                    setSearchingToday={setSearchingToday}
                    INITIAL_DAY_STATE={INITIAL_DAY_STATE}
                    isDeckOpen={isDeckOpen}
                    isNavOpen={isNavOpen}
                    isFavoritesOpen={isFavoritesOpen}
                    isToolBoxOpen={isToolBoxOpen}
                    setIsDeckOpen={setIsDeckOpen}
                    setIsNavOpen={setIsNavOpen}
                    setIsToolBoxOpen={setIsToolBoxOpen}
                    setIsFavoritesOpen={setIsFavoritesOpen}
                    toggleToolButtonRef={toggleToolButtonRef}
                  />
                </div>

                <div
                  className="
            nav-div-list"
                >
                  <span className="intro">All Resources </span>

                  {store.boundaryResults &&
                    store.boundaryResults.length > 0 && (
                      <div
                        className="list-container"
                        style={{ maxHeight: !isLoggedIn ? "60vh" : "auto" }}
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
                                  setFavorites={setFavorites}
                                />
                              ))}
                        </ul>
                      </div>
                    )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="change-location">
                <p className="intro">
                  Please enter a zip code to navigate to a location that is
                  participating in our platform.
                </p>
                <div className="stack">
                  {/* <button className="geo-button" onClick={() => geoFindMe()}>
                    geo-location
                  </button> */}

                  <input
                    type="text"
                    id="zipcode"
                    value={zipInput}
                    onChange={handleZipInputChange}
                    maxLength="5"
                    placeholder="Zip Code"
                  />
                </div>
              </div>
            </>
          )}
          <div
            className="
            nav-div-list"
          >
            {!isLoggedIn && (
              <span className="intro">
                Please{" "}
                <a
                  className="login-link"
                  onClick={() => setOpenLoginModal(true)}
                >
                  {" "}
                  Log in{" "}
                </a>{" "}
                to save resources.
              </span>
            )}

            {isLoggedIn && store.favorites.length == 0 && (
              <span className="intro">
                Heart resources to add to your Favorites!{" "}
              </span>
            )}
            {isLoggedIn && store.favorites && store.favorites.length > 0 && (
              <>
                <span className="intro">Favorites</span>

                <div className="list-container-favs">
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
              </>
            )}
          </div>
        </div>
      </nav>

      {/* </div> */}
    </>
  );
};

export default Navbar2;
