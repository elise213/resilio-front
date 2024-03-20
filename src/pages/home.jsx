import React, { useState, useContext, useRef, useEffect } from "react";
import { Context } from "../store/appContext";
import Navbar2 from "../component/Navbar2";
// import CardDeck from "../component/CardDeck";
// import Favorites from "../component/Favorites";
import SimpleMap from "../component/SimpleMap";
import ErrorBoundary from "../component/ErrorBoundary";
import Styles from "../styles/home.css";
import Buttons from "../component/Buttons";
import Button from "@mui/material/Button";
import Contact from "../component/Contact";

import { Modal } from "../component";

const Home = () => {
  const { store, actions } = useContext(Context);
  const apiKey = import.meta.env.VITE_GOOGLE;
  const INITIAL_CITY_STATE = store.austin[0];

  console.log("user id", store.user_id);

  const [showContactModal, setShowContactModal] = useState(false);

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

  // STATES

  const [loading, setLoading] = useState(false);
  const [backSide, setBackSide] = useState(false);

  const [userLocation, setUserLocation] = useState(null);
  const [isGeneratedMapModalOpen, setIsGeneratedMapModalOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(true);

  const [city, setCity] = useState(INITIAL_CITY_STATE);
  const [isLocating, setIsLocating] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [showRating, setShowRating] = useState(false);

  const [selectedResource, setSelectedResource] = useState(null);

  const [zipInput, setZipInput] = useState("");
  const [hoveredItem, setHoveredItem] = useState(null);

  const [favorites, setFavorites] = useState(
    JSON.parse(sessionStorage.getItem("favorites")) || []
  );
  const [searchingToday, setSearchingToday] = useState(false);

  const [categories, setCategories] = useState(
    INITIAL_CATEGORY_STATE(store.CATEGORY_OPTIONS)
  );
  const [days, setDays] = useState(INITIAL_DAY_STATE(store.DAY_OPTIONS));
  const [groups, setGroups] = useState(
    INITIAL_GROUP_STATE(store.GROUP_OPTIONS)
  );

  const [openLoginModal, setOpenLoginModal] = useState(false);

  // FUNCTIONS

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
          // icon: "error",
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

  // const updateCityStateFromZip = async (zip) => {
  //   try {
  //     const data = await fetchBounds(zip, true);
  //     const location = data.results[0]?.geometry?.location;
  //     const bounds =
  //       data.results[0]?.geometry?.bounds ||
  //       data.results[0]?.geometry?.viewport;

  //     if (location && bounds) {
  //       const newCityState = {
  //         ...city,
  //         center: location,
  //         bounds: bounds,
  //       };
  //       setCity(newCityState);
  //       handleBoundsChange({ center: location, bounds: bounds });
  //       await actions.setBoundaryResults(bounds, categories, days, groups);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching bounds:", error.message);
  //   }
  // };

  const updateCityStateFromZip = async (zip) => {
    try {
      const data = await fetchBounds(zip, true);
      console.log("API Response:", data); // Add this line for debugging
      const location = data.results[0]?.geometry?.location;
      const bounds =
        data.results[0]?.geometry?.bounds ||
        data.results[0]?.geometry?.viewport;

      if (location && bounds) {
        // const newCityState = {
        //   ...city,
        //   center: location,
        //   bounds: bounds,
        // };
        // setCity(newCityState);
        // console.log("New City State:", newCityState); // Add this line for debugging
        handleBoundsChange({ center: location, bounds: bounds });
        await actions.setBoundaryResults(bounds, categories, days, groups);
      }
    } catch (error) {
      console.error("Error fetching bounds:", error.message);
    }
  };

  useEffect(() => {
    if (zipInput && zipInput.length === 5) {
      updateCityStateFromZip(zipInput);
    }
  }, [zipInput]); // Ensure zipInput is triggering this effect

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
  }, [city]);

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
    const handleResize = actions.updateScreenSize;
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div className="grand-resilio-container">
        <Navbar2
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
          handleZipInputChange={handleZipInputChange}
          zipInput={zipInput}
          showContactModal={showContactModal}
          setShowContactModal={setShowContactModal}
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
                handleBoundsChange={handleBoundsChange}
                openModal={openModal}
                city={city}
                zipInput={zipInput}
                categories={categories}
                days={days}
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
                removeSelectedResource={removeSelectedResource}
                resource={selectedResource}
                selectedResources={selectedResources}
                addSelectedResource={addSelectedResource}
                modalIsOpen={modalIsOpen}
                closeModal={closeModal}
                setModalIsOpen={setModalIsOpen}
                setFavorites={setFavorites}
                showRating={showRating}
                setShowRating={setShowRating}
                setShowContactModal={setShowContactModal}
                showContactModal={showContactModal}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default Home;
