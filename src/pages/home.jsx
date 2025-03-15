import React, { useState, useContext, useCallback, useEffect } from "react";
import { Context } from "../store/appContext";
import Sidebar from "../component/Sidebar";
import Map from "../component/Map";
import ErrorBoundary from "../component/ErrorBoundary";
import Styles from "../styles/home.css";
import Selection from "../component/Selection";
import Modal from "../component/Modal";
import Contact from "../component/Contact";
import About from "../component/About";
import { debounce } from "lodash";

const Home = () => {
  const { store, actions } = useContext(Context);
  const apiKey = import.meta.env.VITE_GOOGLE;
  const [isModalOpen, setIsModalOpen] = useState(store.modalIsOpen);
  const [loadingResults, setLoadingResults] = useState(true);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [userSelectedFilter, setUserSelectedFilter] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [locationModalIsOpen, setLocationModalIsOpen] = useState(false);
  const [zipInput, setZipInput] = useState("");
  const [layout, setLayout] = useState("fullscreen-sidebar");
  const INITIAL_CITY_STATE = store.austin[0];
  const [userLocation, setUserLocation] = useState(null);
  const [city, setCity] = useState(INITIAL_CITY_STATE);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const favorites = store.favorites;
  const INITIAL_CATEGORY_STATE = (CATEGORY_OPTIONS) =>
    CATEGORY_OPTIONS.reduce((acc, curr) => {
      return { ...acc, [curr.id]: false };
    }, {});

  const INITIAL_DAY_STATE = (DAY_OPTIONS) =>
    DAY_OPTIONS.reduce((acc, curr) => ({ ...acc, [curr.id]: false }), {});

  const [categories, setCategories] = useState(
    INITIAL_CATEGORY_STATE(store.CATEGORY_OPTIONS)
  );
  const [days, setDays] = useState(INITIAL_DAY_STATE(store.DAY_OPTIONS));

  // USE EFFECTS
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = sessionStorage.getItem("token") || store.token;
      setIsLoggedIn(!!token);
    };
    checkLoginStatus();
  }, [store.token]);

  useEffect(() => {
    setIsModalOpen(store.modalIsOpen);
  }, [store.modalIsOpen]);

  useEffect(() => {
    if (zipInput && zipInput.length === 5) {
      updateCityStateFromZip(zipInput);
    }
  }, [zipInput]);

  useEffect(() => {
    const noCategorySelected = areAllUnchecked(categories);
    const noDaySelected = areAllUnchecked(days);

    setUserSelectedFilter(!(noCategorySelected && noDaySelected));
  }, [categories, days]);

  // FUNCTIONS

  const updateCityStateFromZip = async (zip) => {
    const data = await fetchCachedBounds(zip, true);
    if (data && data.results.length) {
      const location = data.results[0]?.geometry?.location;
      const bounds =
        data.results[0]?.geometry?.bounds ||
        data.results[0]?.geometry?.viewport;

      if (location && bounds) {
        actions.setBoundaryResults(bounds, categories, days);
        handleBoundsChange({
          center: { lat: location.lat, lng: location.lng },
          bounds: {
            ne: bounds.northeast,
            sw: bounds.southwest,
          },
        });
      }
    }
  };

  const handleZipInputChange = async (e) => {
    const value = e.target.value;
    setZipInput(value);
    if (value.length === 5) {
      await updateCityStateFromZip(value);
    }
  };

  const handleBoundsChange = useCallback(
    debounce((data) => {
      console.log("📡 Calling setBoundaryResults...");

      if (
        city.bounds?.ne?.lat === data.bounds.ne.lat &&
        city.bounds?.ne?.lng === data.bounds.ne.lng &&
        city.bounds?.sw?.lat === data.bounds.sw.lat &&
        city.bounds?.sw?.lng === data.bounds.sw.lng
      ) {
        console.log("⏳ Bounds unchanged, skipping API call...");
        return;
      }

      actions.setBoundaryResults(data.bounds, categories, days);

      setCity({
        ...city,
        bounds: { ne: data.bounds.ne, sw: data.bounds.sw },
        center: {
          lat: data.center.lat,
          lng: normalizeLongitude(data.center.lng),
        },
      });
    }, 1000),
    [categories, days]
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
    console.log("Fetching bounds with URL:", apiUrl);
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.status !== "OK") {
        console.error(`Error fetching data: ${data.status}`, data);
        return null;
      }
      console.log("Fetched data:", data);
      return data;
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
    let data = await fetchBounds(query, isZip);
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

  const areAllUnchecked = (stateObj) => {
    return Object.values(stateObj).every((value) => !value);
  };

  const geoFindMe = async () => {
    if (navigator.geolocation) {
      setLoadingLocation(true);

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
          setLoadingLocation(false);
        },
        (error) => {
          console.log("Error getting position", error);
          alert("Unable to retrieve your location");
          setLoadingLocation(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = sessionStorage.getItem("token") || store.token;
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
  }, [store.token]);

  useEffect(() => {
    actions.setSchedules();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingResults(true);

        await actions.setBoundaryResults(city.bounds, categories, days);
      } catch (error) {
        console.error("Error in fetching boundary results:", error);
      } finally {
        setLoadingResults(false);
      }
    };

    if (city.bounds) {
      fetchData();
    }
  }, [city.bounds]);

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
        <Sidebar
          setIsFilterModalOpen={setIsFilterModalOpen}
          layout={layout}
          setLayout={setLayout}
          categories={categories}
          setCategories={setCategories}
          favorites={favorites}
          days={days}
          setDays={setDays}
          INITIAL_DAY_STATE={INITIAL_DAY_STATE}
          fetchCachedBounds={fetchCachedBounds}
          handleBoundsChange={handleBoundsChange}
          userLocation={userLocation}
          setUserLocation={setUserLocation}
          geoFindMe={geoFindMe}
          updateCityStateFromZip={updateCityStateFromZip}
          loadingResults={loadingResults}
        />

        <div className="grand-map-container">
          <ErrorBoundary>
            <Map
              handleZipInputChange={handleZipInputChange}
              zipInput={zipInput}
              layout={layout}
              favorites={favorites}
              hoveredItem={hoveredItem}
              setHoveredItem={setHoveredItem}
              city={city}
              categories={categories}
              days={days}
              handleBoundsChange={handleBoundsChange}
              setCategories={setCategories}
              setDays={setDays}
              INITIAL_DAY_STATE={INITIAL_DAY_STATE}
              userLocation={userLocation}
              setUserLocation={setUserLocation}
              geoFindMe={geoFindMe}
            />
          </ErrorBoundary>
        </div>

        {isModalOpen && (
          <>
            <div
              className="resilio-overlay"
              onClick={() => {
                actions.closeModal();
                document.body.classList.remove("modal-open");
              }}
            ></div>
            <div className="modal-div">
              <Modal />
            </div>
          </>
        )}

        {isFilterModalOpen &&
          (store.CATEGORY_OPTIONS && store.DAY_OPTIONS && categories && days ? (
            <ErrorBoundary>
              <div
                className="resilio-overlay"
                onClick={() => {
                  setIsFilterModalOpen(false);
                  document.body.classList.remove("modal-open");
                }}
              ></div>
              <Selection
                handleBoundsChange={handleBoundsChange}
                categories={categories}
                setCategories={setCategories}
                days={days}
                setDays={setDays}
                INITIAL_DAY_STATE={INITIAL_DAY_STATE}
                areAllUnchecked={areAllUnchecked}
                isFilterModalOpen={isFilterModalOpen}
                setIsFilterModalOpen={setIsFilterModalOpen}
              />
            </ErrorBoundary>
          ) : (
            <p>Loading selection options...</p>
          ))}

        <div className="foot">
          <p className="all-rights">© 2024 Open House</p>
        </div>
      </div>

      {/* MODALS!! */}

      {store.donationModalIsOpen && (
        <>
          <div className="new-modal donation">
            <p
              className="close-new-modal"
              onClick={() => actions.closeDonationModal()}
            >
              <span className="material-symbols-outlined">arrow_back_ios</span>
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

      {store.aboutModalIsOpen && <About />}

      {store.contactModalIsOpen && (
        <div className="new-modal">
          <p
            className="close-new-modal"
            onClick={() => actions.closeContactModal()}
          >
            <span className="material-symbols-outlined">arrow_back_ios</span>
            Back to search
          </p>
          <Contact />
        </div>
      )}
    </>
  );
};
export default Home;
