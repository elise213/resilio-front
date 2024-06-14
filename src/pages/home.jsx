import React, { useState, useContext, useCallback, useEffect } from "react";
import { Context } from "../store/appContext";
import Sidebar from "../component/Sidebar";
import SimpleMap from "../component/SimpleMap";
import ErrorBoundary from "../component/ErrorBoundary";
import Styles from "../styles/home.css";
import Buttons from "../component/Buttons";
import { debounce } from "lodash";
import { Modal } from "../component";

const Home = () => {
  const { store, actions } = useContext(Context);
  const apiKey = import.meta.env.VITE_GOOGLE;

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

  // STATES

  const INITIAL_CITY_STATE = store.austin[0];
  const [showRating, setShowRating] = useState(false);

  const [selectedResources, setSelectedResources] = useState(() => {
    const storedResources = actions.getSessionSelectedResources();
    return storedResources;
  });
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [city, setCity] = useState(INITIAL_CITY_STATE);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [aboutModalIsOpen, setAboutModalIsOpen] = useState(false);
  const [donationModalIsOpen, setDonationModalIsOpen] = useState(false);
  const [contactModalIsOpen, setContactModalIsOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [favorites, setFavorites] = useState(
    JSON.parse(sessionStorage.getItem("favorites")) || []
  );

  const [searchingToday, setSearchingToday] = useState(false);
  const [categories, setCategories] = useState(
    INITIAL_CATEGORY_STATE(store.CATEGORY_OPTIONS)
  );
  const [groups, setGroups] = useState(
    INITIAL_GROUP_STATE(store.GROUP_OPTIONS)
  );
  const [days, setDays] = useState(INITIAL_DAY_STATE(store.DAY_OPTIONS));
  const [openLoginModal, setOpenLoginModal] = useState(false);

  const updateSessionStorage = (resources) => {
    sessionStorage.setItem("selectedResources", JSON.stringify(resources));
  };

  const addSelectedResource = (resource) => {
    if (!resource) {
      console.error("Resource is undefined");
      return;
    }
    setSelectedResources((prevResources) => {
      if (prevResources.length >= 10) {
        Swal.fire({
          title: "Please limit the plan to 10 resources at a time",
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

  const handleBoundsChange = useCallback(
    debounce((data) => {
      setCity((prevState) => ({
        ...prevState,
        bounds: data.bounds,
        center: {
          lat: data.center.lat,
          lng: normalizeLongitude(data.center.lng),
        },
      }));
    }, 600),
    []
  );

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
    return data;
  };

  const fetchCachedBounds = async (query) => {
    const cacheKey = `bounds-${JSON.stringify(query)}`;
    const cachedData = sessionStorage.getItem(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    let data = await fetchBounds(query); // Your existing fetch function
    sessionStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
  };

  const updateCityStateFromCoords = async (lat, lng) => {
    try {
      const data = await fetchCachedBounds({ lat, lng });
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

  // USE EFFECTS

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = sessionStorage.getItem("token") || store.token;
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
  }, [store.token]);

  useEffect(() => {
    const checkLoadingStatus = () => {
      const loading = sessionStorage.getItem("loading");
      setLoading(loading);
    };

    checkLoadingStatus();
  }, [store.loading]);

  // useEffect(() => {
  //   geoFindMe();
  // }, []);

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
    const handleResize = actions.updateScreenSize;
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div className="grand-resilio-container">
        <Sidebar
          setShowRating={setShowRating}
          setOpenLoginModal={setOpenLoginModal}
          openLoginModal={openLoginModal}
          categories={categories}
          setCategories={setCategories}
          groups={groups}
          setGroups={setGroups}
          favorites={favorites}
          days={days}
          setDays={setDays}
          setSearchingToday={setSearchingToday}
          INITIAL_DAY_STATE={INITIAL_DAY_STATE}
          openModal={openModal}
          geoFindMe={geoFindMe}
          contactModalIsOpen={contactModalIsOpen}
          setContactModalIsOpen={setContactModalIsOpen}
          aboutModalIsOpen={aboutModalIsOpen}
          setAboutModalIsOpen={setAboutModalIsOpen}
          donationModalIsOpen={donationModalIsOpen}
          setDonationModalIsOpen={setDonationModalIsOpen}
          fetchCachedBounds={fetchCachedBounds}
          handleBoundsChange={handleBoundsChange}
        />
        {loading != undefined && (
          <div className="loading">
            <p>{loading}</p>
          </div>
        )}

        <div className="grand-map-container">
          <>
            <ErrorBoundary>
              <SimpleMap
                addSelectedResource={addSelectedResource}
                removeSelectedResource={removeSelectedResource}
                favorites={favorites}
                setFavorites={setFavorites}
                hoveredItem={hoveredItem}
                setHoveredItem={setHoveredItem}
                openModal={openModal}
                city={city}
                categories={categories}
                days={days}
                handleBoundsChange={handleBoundsChange}
                groups={groups}
                setCategories={setCategories}
                setGroups={setGroups}
                setDays={setDays}
                setSearchingToday={setSearchingToday}
                INITIAL_DAY_STATE={INITIAL_DAY_STATE}
                closeModal={closeModal}
                modalIsOpen={modalIsOpen}
                setModalIsOpen={setModalIsOpen}
                selectedResource={selectedResource}
                setSelectedResource={setSelectedResource}
                selectedResources={selectedResources}
                setSelectedResources={setSelectedResources}
                aboutModalIsOpen={aboutModalIsOpen}
                setAboutModalIsOpen={setAboutModalIsOpen}
                donationModalIsOpen={donationModalIsOpen}
                setDonationModalIsOpen={setDonationModalIsOpen}
              />
            </ErrorBoundary>
          </>
          {/* )
          } */}
        </div>

        {modalIsOpen && (
          <>
            <div className="modal-div">
              <Modal
                setShowRating={setShowRating}
                removeSelectedResource={removeSelectedResource}
                resource={selectedResource}
                selectedResources={selectedResources}
                addSelectedResource={addSelectedResource}
                modalIsOpen={modalIsOpen}
                closeModal={closeModal}
                setModalIsOpen={setModalIsOpen}
                setFavorites={setFavorites}
                setContactModalIsOpen={setContactModalIsOpen}
                contactModalIsOpen={contactModalIsOpen}
                setOpenLoginModal={setOpenLoginModal}
                openLoginModal={openLoginModal}
              />
            </div>
          </>
        )}

        <Buttons
          setAboutModalIsOpen={setAboutModalIsOpen}
          setContactModalIsOpen={setContactModalIsOpen}
          setDonationModalIsOpen={setDonationModalIsOpen}
          donationModalIsOpen={donationModalIsOpen}
          contactModalIsOpen={contactModalIsOpen}
          aboutModalIsOpen={aboutModalIsOpen}
          setModalIsOpen={setModalIsOpen}
        />

        <div className="foot">
          <p className="all-rights">© 2024 Open Village</p>
        </div>
      </div>
    </>
  );
};
export default Home;
