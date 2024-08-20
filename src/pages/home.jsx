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
  const [zipInput, setZipInput] = useState("");
  const [layout, setLayout] = useState("fullscreen-sidebar"); // options: 'fullscreen-map', 'fullscreen-sidebar', 'split-view'

  const INITIAL_CITY_STATE = store.austin[0];
  // const [showRating, setShowRating] = useState(false);

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

  const updateCityStateFromZip = async (zip) => {
    console.log(`updateCityStateFromZip called with zip: ${zip}`);

    const data = await fetchCachedBounds(zip, true); // Fetch bounds for the zip code

    if (!data || !data.results.length) {
      console.error("Failed to fetch bounds or invalid zip code.");
      return;
    }

    console.log(`Fetched data for zip: `, data);

    const location = data.results[0]?.geometry?.location;
    const bounds =
      data.results[0]?.geometry?.bounds || data.results[0]?.geometry?.viewport;

    if (location && bounds) {
      console.log("Updating center to:", location, "Bounds:", bounds);

      // Update the map center and bounds
      handleBoundsChange({
        center: { lat: location.lat, lng: location.lng },
        bounds: {
          ne: bounds.northeast,
          sw: bounds.southwest,
        },
      });

      await actions.setBoundaryResults(bounds, categories, days, groups);
    } else {
      console.error("Location or bounds missing from the response");
    }
  };

  useEffect(() => {
    if (zipInput && zipInput.length === 5) {
      updateCityStateFromZip(zipInput);
    }
  }, [zipInput]);

  const handleZipInputChange = async (e) => {
    const value = e.target.value;
    setZipInput(value);
    if (value.length === 5) {
      await updateCityStateFromZip(value);
    }
  };

  const handleBoundsChange = useCallback(
    debounce((data) => {
      setCity((prevState) => ({
        ...prevState,
        bounds: {
          ne: data.bounds.ne, // Northeast corner of bounds
          sw: data.bounds.sw, // Southwest corner of bounds
        },
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

  //   let apiUrl;
  //   if (isZip) {
  //     apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${apiKey}`;
  //   } else {
  //     apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${query.lat},${query.lng}&key=${apiKey}`;
  //   }
  //   const response = await fetch(apiUrl);
  //   const data = await response.json();

  //   const location = data.results[0]?.geometry?.location;
  //   let bounds =
  //     data.results[0]?.geometry?.bounds || data.results[0]?.geometry?.viewport;

  //   if (!bounds && location) {
  //     const offset = 0.01;
  //     bounds = {
  //       ne: {
  //         lat: location.lat + offset,
  //         lng: normalizeLongitude(location.lng + offset),
  //       },
  //       sw: {
  //         lat: location.lat - offset,
  //         lng: normalizeLongitude(location.lng - offset),
  //       },
  //     };
  //   }
  //   return data;
  // };

  const fetchBounds = async (query, isZip = false) => {
    let apiUrl;

    // Use 'address' for zip code search and 'latlng' for lat/lng search
    if (isZip) {
      apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${apiKey}`;
    } else {
      apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${query.lat},${query.lng}&key=${apiKey}`;
    }

    console.log("Fetching bounds with URL:", apiUrl); // Log the full API URL

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      // Check for errors in the response and handle them
      if (data.status !== "OK") {
        console.error(`Error fetching data: ${data.status}`, data);
        return null; // Return null to handle cases where no valid data is found
      }

      console.log("Fetched data:", data); // Log full response data for debugging
      return data; // Return the raw data for further processing
    } catch (error) {
      console.error("Error fetching bounds:", error);
      return null;
    }
  };

  const fetchCachedBounds = async (query, isZip = false) => {
    const cacheKey = `bounds-${JSON.stringify(query)}`;
    const cachedData = sessionStorage.getItem(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    let data = await fetchBounds(query, isZip); // Fetch bounds using zip code
    sessionStorage.setItem(cacheKey, JSON.stringify(data));
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

  const openModal = (resource) => {
    setSelectedResource(resource);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedResource(null);
    setModalIsOpen(false);
  };

  const [loadingLocation, setLoadingLocation] = useState(false); // Add loading state

  const geoFindMe = async () => {
    if (navigator.geolocation) {
      setLayout("fullscreen-map");
      setLoadingLocation(true); // Show the loading alert

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Position:", position.coords); // Check if you get the coordinates here
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          updateCityStateFromCoords(
            position.coords.latitude,
            position.coords.longitude
          );
          setLoadingLocation(false); // Hide the loading alert after location is found
        },
        (error) => {
          console.log("Error getting position", error);
          alert("Unable to retrieve your location");
          setLoadingLocation(false); // Hide the loading alert if there's an error
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
      {loadingLocation && (
        <div className="loading-alert">Finding your location...</div>
      )}

      <div className={`grand-resilio-container`}>
        {/* <div className="sidebar-container"> */}
        <Sidebar
          layout={layout}
          setLayout={setLayout}
          // setShowRating={setShowRating}
          openLoginModal={openLoginModal}
          setOpenLoginModal={setOpenLoginModal}
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
          contactModalIsOpen={contactModalIsOpen}
          setContactModalIsOpen={setContactModalIsOpen}
          aboutModalIsOpen={aboutModalIsOpen}
          setAboutModalIsOpen={setAboutModalIsOpen}
          donationModalIsOpen={donationModalIsOpen}
          setDonationModalIsOpen={setDonationModalIsOpen}
          fetchCachedBounds={fetchCachedBounds}
          handleBoundsChange={handleBoundsChange}
          userLocation={userLocation}
          setUserLocation={setUserLocation}
          geoFindMe={geoFindMe}
          updateCityStateFromZip={updateCityStateFromZip}
        />
        {/* </div> */}
        <div className="grand-map-container">
          <ErrorBoundary>
            <SimpleMap
              handleZipInputChange={handleZipInputChange}
              zipInput={zipInput}
              layout={layout}
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
              userLocation={userLocation}
              setUserLocation={setUserLocation}
              geoFindMe={geoFindMe}
            />
          </ErrorBoundary>
        </div>
        {modalIsOpen && (
          <div className="modal-div">
            <Modal
              // setShowRating={setShowRating}
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
