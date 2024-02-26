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
  favorites,
  groups,
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
}) => {
  const { store, actions } = useContext(Context);

  const [showContactModal, setShowContactModal] = useState(false);
  // const [isLargeScreen, setIsLargeScreen] = useState(store.isLargeScreen);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = sessionStorage.getItem("token") || store.token;
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
  }, [store.token]);

  // useEffect(() => {
  //   setIsLargeScreen(store.isLargeScreen);
  // }, [store.isLargeScreen]);

  const toggleContactModal = () => {
    setShowContactModal(!showContactModal);
  };

  useEffect(() => {
    const body = document.body;
    if (isNavOpen || showContactModal) {
      body.classList.add("no-scroll");
    } else {
      body.classList.remove("no-scroll");
    }
  }, [isNavOpen, showContactModal]);

  return (
    <>
      <div className="nav-container">
        <nav className={`new-navbar ${isNavOpen ? "open-nav" : ""}`}>
          <div
            onClick={toggleNav}
            className={`open-icon-nav ${
              !isFavoritesOpen && !isToolBoxOpen && !isNavOpen && !isDeckOpen
                ? "closed"
                : ""
            }`}
          >
            <i className="fas fa-bars"></i>
          </div>

          <div className={`navbar-content ${isNavOpen ? "open-nav" : ""}`}>
            <div className="nav-div">
              <span className="intro">
                Use this app to search for resources near you. Save resources
                and make a plan for yourself by logging in with your email.
              </span>
            </div>
            <div
              className="
            nav-div"
            >
              <Login
                openLoginModal={openLoginModal}
                setOpenLoginModal={setOpenLoginModal}
              />
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search Resources..."
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
            nav-div"
            >
              <span className="intro">Favorites</span>

              {isLoggedIn && !store.favorites.length > 0 && (
                <>
                  <span className="scroll-title to-save-res">
                    Your Liked{" "}
                    <i
                      style={{ color: "red" }}
                      className="fa-solid fa-heart"
                    ></i>{" "}
                    resources will appear here. Try adding some!
                  </span>
                </>
              )}

              {store.favorites && store.favorites.length > 0 ? (
                <div className="list-container-favs">
                  {/* <ul>
                    {favorites.map((resource, index) => (
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
                  </ul> */}
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
          </div>
        </nav>

        {showContactModal && (
          <div className="modal-overlay">
            <div className="modal-content-contact">
              <span className="close-contact" onClick={toggleContactModal}>
                <i className="fa-solid fa-x"></i>
              </span>
              <Contact />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar2;
