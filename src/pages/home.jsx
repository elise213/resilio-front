import React, { useState, useContext, useRef, useEffect } from "react";
import { Context } from "../store/appContext";
import GeneratedTreasureMap from "../component/GeneratedTreasureMap";
import Navbar2 from "../component/Navbar2";
import CardDeck from "../component/CardDeck";
import Favorites from "../component/Favorites";
import AltSimpleMap from "../component/AltSimpleMap";
import ErrorBoundary from "../component/ErrorBoundary";
import Styles from "../styles/home.css";
import Login from "../component/Login";

import {
  SimpleMap,
  Selection,
  Loading,
  ResourceCard,
  Modal,
} from "../component";
import ToolBox from "../component/ToolBox";

const Home = () => {
  const { store, actions } = useContext(Context);
  const apiKey = import.meta.env.VITE_GOOGLE;
  const INITIAL_CITY_STATE = store.austin[0];

  // State to manage selected resources
  const [selectedResources, setSelectedResources] = useState(() => {
    const storedResources = actions.getSessionSelectedResources();
    return storedResources;
  });

  const INITIAL_CATEGORY_STATE = (CATEGORY_OPTIONS) =>
    CATEGORY_OPTIONS.reduce((acc, curr) => {
      return { ...acc, [curr.id]: false };
    }, {});

  const INITIAL_GROUP_STATE = (GROUP_OPTIONS) =>
    GROUP_OPTIONS.reduce((acc, curr) => {
      return { ...acc, [curr.id]: false };
    }, {});

  const INITIAL_DAY_STATE = (DAY_OPTIONS) =>
    DAY_OPTIONS.reduce((acc, curr) => ({ ...acc, [curr.id]: false }), {});

  // REFS
  const ulRef = useRef(null);
  const resultsRef = useRef(null);
  const fetchCounterRef = useRef(0);
  const abortControllerRef = useRef(null);

  // STATES
  const [backSide, setBackSide] = useState(false);
  const [message1Open, setMessage1Open] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [isGeneratedMapModalOpen, setIsGeneratedMapModalOpen] = useState(false);
  const [isDeckOpen, setIsDeckOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const [favorites, setFavorites] = useState(
    JSON.parse(sessionStorage.getItem("favorites")) || []
  );

  // const [showFront, setShowFront] = useState(true);
  const [searchingToday, setSearchingToday] = useState(false);

  const [categories, setCategories] = useState(
    INITIAL_CATEGORY_STATE(store.CATEGORY_OPTIONS)
  );
  const [days, setDays] = useState(INITIAL_DAY_STATE(store.DAY_OPTIONS));
  const [groups, setGroups] = useState(
    INITIAL_GROUP_STATE(store.GROUP_OPTIONS)
  );

  const [city, setCity] = useState(INITIAL_CITY_STATE);
  const [isLocating, setIsLocating] = useState(false);
  const [isScrolledToEnd, setIsScrolledToEnd] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [zipInput, setZipInput] = useState("");
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isToolBoxOpen, setIsToolBoxOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [openLoginModal, setOpenLoginModal] = useState(false);

  // FUNCTIONS

  const toggleNav = () => {
    setIsFavoritesOpen(false);
    setIsToolBoxOpen(false);
    setIsDeckOpen(false);
    setIsNavOpen(!isNavOpen);
  };

  // Function to update session storage whenever selectedResources changes
  const updateSessionStorage = (resources) => {
    sessionStorage.setItem("selectedResources", JSON.stringify(resources));
  };

  const addSelectedResource = (resource) => {
    console.log("Adding resource", resource);

    setSelectedResources((prevResources) => {
      if (prevResources.length >= 10) {
        // Display an alert if the limit is reached
        Swal.fire({
          // icon: "error",
          title: "Please limit the path to 10 resources at a time",
        });
        return prevResources;
      }

      if (!prevResources.some((r) => r.id === resource.id)) {
        const updatedResources = [...prevResources, resource];
        console.log("Updated Resources", updatedResources);
        updateSessionStorage(updatedResources);
        return updatedResources;
      }
      return prevResources;
    });
  };

  const removeSelectedResource = (resourceId) => {
    setSelectedResources((prevResources) => {
      const updatedResources = prevResources.filter((r) => r.id !== resourceId);
      updateSessionStorage(updatedResources);
      return updatedResources;
    });
  };

  const handleBoundsChange = (data) => {
    setCity((prevState) => ({
      ...prevState,
      bounds: data.bounds,
      center: {
        lat: data.center.lat,
        lng: normalizeLongitude(data.center.lng),
      },
    }));
  };

  const getTrueCategories = () => {
    const trueCategoryIds = Object.keys(categories).filter(
      (key) => categories[key]
    );
    if (trueCategoryIds.length === 0) {
      return "";
    }
    const trueCategoryLabels = trueCategoryIds.map(
      (id) => store.CATEGORY_OPTIONS.find((cat) => cat.id === id)?.label
    );
    if (trueCategoryLabels.length === 1) {
      return trueCategoryLabels[0];
    } else if (trueCategoryLabels.length === 2) {
      return trueCategoryLabels.join(" and ");
    } else {
      const lastCategory = trueCategoryLabels.pop();
      return `${trueCategoryLabels.join(", ")}, and ${lastCategory}`;
    }
  };

  const normalizeLongitude = (lng) => {
    if (lng > 180) {
      return lng - 360;
    }
    if (lng < -180) {
      return lng + 360;
    }
    return lng;
  };

  const fetchBounds = async (query, isZip = false) => {
    let apiUrl;
    if (isZip) {
      apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${apiKey}`;
    } else {
      apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${query.lat},${query.lng}&key=${apiKey}`;
    }
    const response = await fetch(apiUrl);
    const data = await response.json();
    // console.log("Raw API response:", JSON.stringify(data.results[0].geometry));

    const location = data.results[0]?.geometry?.location;
    let bounds =
      data.results[0]?.geometry?.bounds || data.results[0]?.geometry?.viewport;

    // Fallback logic
    if (!bounds && location) {
      const offset = 0.01;
      bounds = {
        ne: {
          lat: location.lat + offset,
          lng: normalizeLongitude(location.lng + offset),
        },
        sw: {
          lat: location.lat - offset,
          lng: normalizeLongitude(location.lng - offset),
        },
      };
    }
    // console.log("Location:", location);
    // console.log("Bounds:", bounds);
    return data;
  };

  const updateCityStateFromCoords = async (lat, lng) => {
    try {
      const data = await fetchBounds({ lat, lng });
      const location = data.results[0]?.geometry?.location;
      const bounds =
        data.results[0]?.geometry?.bounds ||
        data.results[0]?.geometry?.viewport;
      if (location && bounds) {
        setCity({
          ...city,
          center: location,
          bounds: bounds,
        });
      }
    } catch (error) {
      console.error("Error fetching bounds:", error.message);
    }
  };

  const handleZipInputChange = async (e) => {
    const value = e.target.value;
    setZipInput(value);
    if (value.length === 5) {
      await updateCityStateFromZip(value);
    }
  };

  const updateCityStateFromZip = async (zip) => {
    try {
      const data = await fetchBounds(zip, true);
      const location = data.results[0]?.geometry?.location;
      const bounds =
        data.results[0]?.geometry?.bounds ||
        data.results[0]?.geometry?.viewport;
      if (location && bounds) {
        setCity({
          ...city,
          center: location,
          bounds: bounds,
        });
      }
    } catch (error) {
      console.error("Error fetching bounds:", error.message);
    }
  };

  const openModal = (resource) => {
    setSelectedResource(resource);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedResource(null);
    setModalIsOpen(false);
  };

  const geoFindMe = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          updateCityStateFromCoords(
            position.coords.latitude,
            position.coords.longitude
          );
        },
        (error) => {
          console.log("Error getting position", error);
          alert("Unable to retrieve your location");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  useEffect(() => {
    geoFindMe();
  }, []);

  // USE EFFECTS

  useEffect(() => {
    const body = document.body;
    if (isDeckOpen || isNavOpen || isFavoritesOpen || isToolBoxOpen) {
      body.classList.add("no-scroll");
    } else {
      body.classList.remove("no-scroll");
    }
  }, [isDeckOpen, isNavOpen, isFavoritesOpen, isToolBoxOpen]);

  useEffect(() => {
    actions.setSchedules();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (city.bounds) {
          await actions.setMapResults(city.bounds);
        }
      } catch (error) {
        console.error("Error in fetching map results:", error);
      }
    };
    fetchData();
  }, [city.bounds]);

  useEffect(() => {
    const checkOverflow = () => {
      if (resultsRef.current) {
        const { scrollWidth, clientWidth } = resultsRef.current;
        setIsOverflowing(scrollWidth > clientWidth); // Set isOverflowing to true if content is overflowing
      }
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow); // Call whenever the window is resized
    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, [store.boundaryResults]);

  useEffect(() => {
    if (zipInput && zipInput.length === 5) {
      updateCityStateFromZip(zipInput);
    }
  }, [zipInput]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (categories && days && city.bounds) {
          await actions.setBoundaryResults(
            city.bounds,
            categories,
            days,
            groups
          );
        }
      } catch (error) {
        console.error("Error in fetching boundary results:", error);
      }
    };
    fetchData();
  }, [categories, days, city, groups, searchingToday]);

  useEffect(() => {
    const handleScroll = () => {
      if (ulRef.current) {
        const { scrollWidth, clientWidth, scrollLeft } = ulRef.current;
        const atEndOfScroll = scrollWidth - clientWidth - scrollLeft < 10;
        setIsScrolledToEnd(atEndOfScroll);
      }
    };
    if (ulRef.current) {
      ulRef.current.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (ulRef.current) {
        ulRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    actions.initializeScreenSize();
  }, []);

  useEffect(() => {
    const handleResize = actions.updateScreenSize;
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {/* Site Info */}
      <Navbar2
        setOpenLoginModal={setOpenLoginModal}
        openLoginModal={openLoginModal}
        categories={categories}
        setCategories={setCategories}
        groups={groups}
        setGroups={setGroups}
        days={days}
        setDays={setDays}
        searchingToday={searchingToday}
        setSearchingToday={setSearchingToday}
        INITIAL_DAY_STATE={INITIAL_DAY_STATE}
        isNavOpen={isNavOpen}
        isFavoritesOpen={isFavoritesOpen}
        setIsNavOpen={setIsNavOpen}
        isToolBoxOpen={isToolBoxOpen}
        setIsToolBoxOpen={setIsToolBoxOpen}
        setIsDeckOpen={setIsDeckOpen}
        setIsFavoritesOpen={setIsFavoritesOpen}
        toggleNav={toggleNav}
      />

      {/* Filter */}
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
      />
      {/* All Resources */}
      <CardDeck
        isDeckOpen={isDeckOpen}
        isNavOpen={isNavOpen}
        isFavoritesOpen={isFavoritesOpen}
        isToolBoxOpen={isToolBoxOpen}
        setIsDeckOpen={setIsDeckOpen}
        setIsNavOpen={setIsNavOpen}
        setIsToolBoxOpen={setIsToolBoxOpen}
        setIsFavoritesOpen={setIsFavoritesOpen}
        openModal={openModal}
        closeModal={closeModal}
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        selectedResources={selectedResources}
        addSelectedResource={addSelectedResource}
        removeSelectedResource={removeSelectedResource}
        favorites={favorites}
        setFavorites={setFavorites}
      />
      {/* Favorites */}
      <Favorites
        openModal={openModal}
        closeModal={closeModal}
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        selectedResources={selectedResources}
        addSelectedResource={addSelectedResource}
        removeSelectedResource={removeSelectedResource}
        setFavorites={setFavorites}
        favorites={favorites}
        isDeckOpen={isDeckOpen}
        isNavOpen={isNavOpen}
        isFavoritesOpen={isFavoritesOpen}
        isToolBoxOpen={isToolBoxOpen}
        setIsDeckOpen={setIsDeckOpen}
        setIsNavOpen={setIsNavOpen}
        setIsToolBoxOpen={setIsToolBoxOpen}
        setIsFavoritesOpen={setIsFavoritesOpen}
        setOpenLoginModal={setOpenLoginModal}
        openLoginModal={openLoginModal}
      />

      <div className="fake-navbar"></div>
      <div className="fake-navbar2"></div>

      <div className="grand-container">
        {message1Open && (
          <>
            <ErrorBoundary>
              <AltSimpleMap
                setBackSide={setBackSide}
                backSide={backSide}
                addSelectedResource={addSelectedResource}
                removeSelectedResource={removeSelectedResource}
                favorites={favorites}
                setFavorites={setFavorites}
                hoveredItem={hoveredItem}
                setHoveredItem={setHoveredItem}
                handleBoundsChange={handleBoundsChange}
                openModal={openModal}
                city={city}
                geoFindMe={geoFindMe}
                handleZipInputChange={handleZipInputChange}
                zipInput={zipInput}
                categories={categories}
                days={days}
                groups={groups}
                setCategories={setCategories}
                setGroups={setGroups}
                setDays={setDays}
                searchingToday={searchingToday}
                setSearchingToday={setSearchingToday}
                INITIAL_DAY_STATE={INITIAL_DAY_STATE}
                closeModal={closeModal}
                modalIsOpen={modalIsOpen}
                setModalIsOpen={setModalIsOpen}
                selectedResource={selectedResource}
                setSelectedResource={setSelectedResource}
                isGeneratedMapModalOpen={isGeneratedMapModalOpen}
                setIsGeneratedMapModalOpen={setIsGeneratedMapModalOpen}
                selectedResources={selectedResources}
                setSelectedResources={setSelectedResources}
                toggleNav={toggleNav}
                isFavoritesOpen={isFavoritesOpen}
                isToolBoxOpen={isToolBoxOpen}
                setIsToolBoxOpen={setIsToolBoxOpen}
                isNavOpen={isNavOpen}
                isDeckOpen={isDeckOpen}
              />
            </ErrorBoundary>

            <div className="search-results-full"></div>
          </>
        )}
        {/* </div> */}
        {modalIsOpen && (
          <div>
            <div className="modal-overlay"></div>
            <div className="modal-div">
              <Modal
                resource={selectedResource}
                modalIsOpen={modalIsOpen}
                closeModal={closeModal}
              />
            </div>
          </div>
        )}

        <button className="flip-button" onClick={() => setBackSide(!backSide)}>
          {backSide ? "Map View" : "Plan View"}
        </button>
        {isGeneratedMapModalOpen && (
          <GeneratedTreasureMap
            closeModal={() => setIsGeneratedMapModalOpen(false)}
            selectedResources={selectedResources}
            openModal={openModal}
            setHoveredItem={setHoveredItem}
            hoveredItem={hoveredItem}
            selectedResource={selectedResource}
          />
        )}
      </div>
    </>
  );
};
export default Home;
