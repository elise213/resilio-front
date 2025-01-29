import React, { useState, useContext, useCallback, useEffect } from "react";
import { Context } from "../store/appContext";
import Sidebar from "../component/Sidebar";
import SimpleMap from "../component/SimpleMap";
import ErrorBoundary from "../component/ErrorBoundary";
import Styles from "../styles/home.css";

import { debounce } from "lodash";
import { Modal } from "../component";

const Home = () => {
  const { store, actions } = useContext(Context);
  const apiKey = import.meta.env.VITE_GOOGLE;
  const [isModalOpen, setIsModalOpen] = useState(store.modalIsOpen);

  // Use effect to monitor store changes and update local state
  useEffect(() => {
    setIsModalOpen(store.modalIsOpen);
  }, [store.modalIsOpen]);

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
  const [layout, setLayout] = useState("fullscreen-sidebar");

  const INITIAL_CITY_STATE = store.austin[0];
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [city, setCity] = useState(INITIAL_CITY_STATE);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const favorites = store.favorites;
  // );

  const [searchingToday, setSearchingToday] = useState(false);
  const [categories, setCategories] = useState(
    INITIAL_CATEGORY_STATE(store.CATEGORY_OPTIONS)
  );
  const [groups, setGroups] = useState(
    INITIAL_GROUP_STATE(store.GROUP_OPTIONS)
  );
  const [days, setDays] = useState(INITIAL_DAY_STATE(store.DAY_OPTIONS));

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = sessionStorage.getItem("token") || store.token;
      setIsLoggedIn(!!token);
      console.log("Token:", token);
    };

    checkLoginStatus();
  }, [store.token]);

  // const updateCityStateFromZip = async (zip) => {

  const updateCityStateFromZip = async (zip) => {
    const data = await fetchCachedBounds(zip, true);
    if (data && data.results.length) {
      const location = data.results[0]?.geometry?.location;
      const bounds =
        data.results[0]?.geometry?.bounds ||
        data.results[0]?.geometry?.viewport;

      if (location && bounds) {
        actions.setBoundaryResults(bounds, categories, days, groups); // Update boundary results
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
      actions.setBoundaryResults(data.bounds, categories, days, groups); // Call Flux action to update boundary results
      setCity({
        ...city,
        bounds: {
          ne: data.bounds.ne,
          sw: data.bounds.sw,
        },
        center: {
          lat: data.center.lat,
          lng: normalizeLongitude(data.center.lng),
        },
      });
    }, 600),
    [categories, days, groups]
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

  const [loadingLocation, setLoadingLocation] = useState(false);

  // const geoFindMe = async () => {
  //   if (navigator.geolocation) {
  //     setLayout("fullscreen-map");
  //     setLoadingLocation(true);

  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         console.log("Position:", position.coords);
  //         setUserLocation({
  //           lat: position.coords.latitude,
  //           lng: position.coords.longitude,
  //         });
  //         updateCityStateFromCoords(
  //           position.coords.latitude,
  //           position.coords.longitude
  //         );
  //         setLoadingLocation(false);
  //       },
  //       (error) => {
  //         console.log("Error getting position", error);
  //         alert("Unable to retrieve your location");
  //         setLoadingLocation(false);
  //       }
  //     );
  //   } else {
  //     alert("Geolocation is not supported by your browser");
  //   }
  // };

  // USE EFFECTS

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
        <Sidebar
          layout={layout}
          setLayout={setLayout}
          categories={categories}
          setCategories={setCategories}
          groups={groups}
          setGroups={setGroups}
          favorites={favorites}
          days={days}
          setDays={setDays}
          setSearchingToday={setSearchingToday}
          INITIAL_DAY_STATE={INITIAL_DAY_STATE}
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
              favorites={favorites}
              hoveredItem={hoveredItem}
              setHoveredItem={setHoveredItem}
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
              userLocation={userLocation}
              setUserLocation={setUserLocation}
              geoFindMe={geoFindMe}
            />
          </ErrorBoundary>
        </div>

        {isModalOpen && (
          <div className="modal-div">
            <Modal />
          </div>
        )}

        <div className="foot">
          <p className="all-rights">© 2024 Open Village</p>
        </div>
      </div>
    </>
  );
};
export default Home;
