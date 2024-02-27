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

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = sessionStorage.getItem("token") || store.token;
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
  }, [store.token]);

  return (
    <>
      <nav className={`new-navbar ${isNavOpen ? "open-nav" : ""}`}>
        <div className={`navbar-content`}>
          <div className={`nav-div`}>
            <Login
              openLoginModal={openLoginModal}
              setOpenLoginModal={setOpenLoginModal}
            />
            <img
              className="top-logo"
              src="/assets/RESILIOO.png"
              alt="Resilio Logo"
            />
            <span className="intro">
              Use Resilio to find free resources near you.
            </span>
            {!isLoggedIn && (
              <span className="intro">
                To save your favorite resources, please{" "}
                <a
                  className="login-link"
                  onClick={() => setOpenLoginModal(true)}
                >
                  {" "}
                  Log in
                </a>
                .
              </span>
            )}
          </div>
          {store.favorites && store.favorites.length > 0 ? (
            <>
              <div
                className="
            nav-div"
              >
                <div className="side-by">
                  <div className="search-bar">
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
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
            nav-div"
              >
                <span className="intro">All Resources </span>

                {store.boundaryResults && store.boundaryResults.length > 0 && (
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
              </div>
            </>
          ) : (
            <>
              <div>
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
            nav-div"
          >
            {isLoggedIn && store.favorites && store.favorites.length === 0 && (
              <span className="intro">
                Heart resources to add to your Favorites!{" "}
              </span>
            )}
            {isLoggedIn && store.favorites && store.favorites.length > 0 && (
              <span className="intro">Favorites</span>
            )}

            {store.favorites && store.favorites.length > 0 ? (
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
            ) : (
              ""
            )}
          </div>
        </div>
      </nav>

      {/* </div> */}
    </>
  );
};

export default Navbar2;
