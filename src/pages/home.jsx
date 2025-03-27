import React, {
  useState,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { Context } from "../store/appContext";
import Sidebar from "../component/Sidebar";
import Map from "../component/Map";
import ErrorBoundary from "../hooks/ErrorBoundary";
import Styles from "../styles/home.css";
import Selection from "../component/Selection";
import Modal from "../component/Modal";
import Contact from "../component/Contact";
import About from "../component/About";
import { debounce } from "lodash";
import Donation from "../component/Donation";

const Home = () => {
  const { store, actions } = useContext(Context);

  const apiKey = import.meta.env.VITE_GOOGLE;
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [mapZoom, setMapZoom] = useState(11);
  // Top of file
  const callHistory = useRef([]);

  const isRateLimited = () => {
    const now = Date.now();
    // Keep only calls within the last minute
    callHistory.current = callHistory.current.filter((t) => now - t < 60000);
    if (callHistory.current.length >= 10) return true;
    callHistory.current.push(now);
    return false;
  };

  const [userSelectedFilter, setUserSelectedFilter] = useState(false);
  // const INITIAL_CATEGORY_STATE = (CATEGORY_OPTIONS) =>
  //   CATEGORY_OPTIONS.reduce((acc, curr) => {
  //     return { ...acc, [curr.id]: false };
  //   }, {});
  const INITIAL_DAY_STATE = (DAY_OPTIONS) =>
    DAY_OPTIONS.reduce((acc, curr) => ({ ...acc, [curr.id]: false }), {});

  const [city, setCity] = useState(
    () =>
      store.austin?.[0] || {
        center: { lat: 34.0522, lng: -118.2437 }, // default to LA
      }
  );
  const [mapCenter, setMapCenter] = useState(city.center);

  const [categories, setCategories] = useState(
    store.CATEGORY_OPTIONS.reduce(
      (acc, curr) => ({ ...acc, [curr.id]: false }),
      {}
    )
  );
  const [mapInstance, setMapInstance] = useState(null);
  const [mapsInstance, setMapsInstance] = useState(null);
  const [days, setDays] = useState(
    store.DAY_OPTIONS.reduce((acc, curr) => ({ ...acc, [curr.id]: false }), {})
  );

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [zipInput, setZipInput] = useState("");
  const [layout, setLayout] = useState("fullscreen-sidebar");
  const [lastBounds, setLastBounds] = useState(null);
  // const INITIAL_CITY_STATE = store.austin[0];
  // const [city, setCity] = useState(INITIAL_CITY_STATE);
  // const [mapCenter, setMapCenter] = useState(city.center);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [filteredResults2, setFilteredResults2] = useState(
    store.boundaryResults
  );

  const resetFilters = () => {
    console.log("🔄 Resetting categories and days to original values...");
    setCategories(
      store.CATEGORY_OPTIONS.reduce(
        (acc, curr) => ({ ...acc, [curr.id]: false }),
        {}
      )
    );
    setDays(
      store.DAY_OPTIONS.reduce(
        (acc, curr) => ({ ...acc, [curr.id]: false }),
        {}
      )
    );
    console.log("✅ Categories and days reset.");
  };

  useEffect(() => {
    if (store.austin?.[0]) {
      setCity(store.austin[0]);
      setMapCenter(store.austin[0].center);
    }
  }, [store.austin]);

  const handleCategoryChange = (categoryId) => {
    setCategories((prevCategories) => {
      const newCategories = {
        ...prevCategories,
        [categoryId]: !prevCategories[categoryId],
      };
      // return JSON.stringify(newCategories) === JSON.stringify(prevCategories)
      //   ? prevCategories
      //   : newCategories;
      const isSame = Object.keys(prevCategories).every(
        (key) => prevCategories[key] === newCategories[key]
      );
      return isSame ? prevCategories : newCategories;
    });
  };

  const handleDayChange = (dayId) => {
    setDays((prevDays) => {
      if (prevDays[dayId] === !prevDays[dayId]) {
        return prevDays;
      }
      return { ...prevDays, [dayId]: !prevDays[dayId] };
    });
  };

  const updateCityStateFromZip = async (zip) => {
    console.log(`🔍 Looking up ZIP: ${zip}`);

    const data = await fetchCachedBounds(zip, true);

    console.log("📌 Response from fetchCachedBounds:", data);

    if (!data || data.length === 0) {
      console.error("❌ Error fetching bounds: No results found.");
      return null;
    }

    const firstResult = data[0];
    const location = {
      lat: parseFloat(firstResult.lat),
      lng: parseFloat(firstResult.lon),
    };

    const bounds = {
      ne: {
        lat: parseFloat(firstResult.boundingbox[1]),
        lng: parseFloat(firstResult.boundingbox[3]),
      },
      sw: {
        lat: parseFloat(firstResult.boundingbox[0]),
        lng: parseFloat(firstResult.boundingbox[2]),
      },
    };

    console.log("✅ Found location:", location);
    console.log("📏 Bounding Box:", bounds);

    handleBoundsChange({ center: location, bounds });
    await actions.setBoundaryResults(bounds, categories, days);
  };

  const isFilteringByCategory = useMemo(
    () => Object.keys(categories).some((key) => categories[key]),
    [categories]
  );

  const isFilteringByDay = useMemo(
    () => Object.keys(days).some((key) => days[key]),
    [days]
  );

  const applyFiltering = isFilteringByCategory || isFilteringByDay;

  /* ===========================
   * 📌 Effects (useEffect)
   * =========================== */

  useEffect(() => {
    if (zipInput && zipInput.length === 5) {
      updateCityStateFromZip(zipInput);
    }
  }, [zipInput]);

  // 📍 Apply filters when categories, days, or all resources change
  useEffect(() => {
    console.log("category or day change", categories, days);
  }, [categories, days]);

  // 📍 Count occurrences of categories in boundary results
  useEffect(() => {
    let categoryCounts = {};
    if (!store.boundaryResults?.length) return;
    store.boundaryResults.forEach((resource) => {
      if (typeof resource.category === "string") {
        let resourceCategories = resource.category
          .split(",")
          .map((cat) => cat.trim().toLowerCase());

        resourceCategories.forEach((cat) => {
          if (store.CATEGORY_OPTIONS.some((option) => option.id === cat)) {
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
          }
        });
      }
    });
    actions.setCategoryCounts(categoryCounts);
  }, [store.boundaryResults]);

  // 📍 Count occurrences of days in boundary results
  useEffect(() => {
    let dayCounts = store.DAY_OPTIONS.reduce((acc, day) => {
      acc[day.id] = 0;
      return acc;
    }, {});
    if (!store.boundaryResults?.length) return;
    store.boundaryResults.forEach((resource) => {
      if (!resource.schedule) return;
      store.DAY_OPTIONS.forEach((day) => {
        const daySchedule = resource.schedule[day.id];
        if (daySchedule?.start && daySchedule?.end) {
          dayCounts[day.id]++;
        }
      });
    });
    actions.setDayCounts({ ...dayCounts });
  }, [store.boundaryResults]);

  // 📍 Count categories and days in all resources
  useEffect(() => {
    if (!store.boundaryResults?.length) return;
    let categoryCounts = {};
    let dayCounts = store.DAY_OPTIONS.reduce((acc, day) => {
      acc[day.id] = 0;
      return acc;
    }, {});

    store.boundaryResults.forEach((resource) => {
      if (typeof resource.category === "string") {
        resource.category.split(",").forEach((cat) => {
          cat = cat.trim().toLowerCase();
          if (store.CATEGORY_OPTIONS.some((option) => option.id === cat)) {
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
          }
        });
      }

      if (resource.schedule) {
        store.DAY_OPTIONS.forEach((day) => {
          if (
            resource.schedule[day.id]?.start &&
            resource.schedule[day.id]?.end
          ) {
            dayCounts[day.id]++;
          }
        });
      }
    });

    actions.setCategoryCounts(categoryCounts);
    actions.setDayCounts(dayCounts);
  }, [store.boundaryResults, days]);

  const debouncedApplyFilters = useCallback(
    debounce(() => {
      applyFilters();
    }, 300),
    [categories, days, store.boundaryResults]
  );
  useEffect(() => {
    debouncedApplyFilters();
  }, [categories, days, store.boundaryResults]);

  // check if all values in an object (like categories or days) are false
  const areAllUnchecked = (filters) => {
    return Object.values(filters).every((value) => value === false);
  };

  // 📍 Track if user has selected filters
  useEffect(() => {
    const noCategorySelected = areAllUnchecked(categories);
    const noDaySelected = areAllUnchecked(days);
    setUserSelectedFilter(!(noCategorySelected && noDaySelected));
  }, [categories, days]);

  // 📍 Initialize app
  useEffect(() => {
    const cleanup = actions.initApp();
    return cleanup;
  }, []);

  /* ===========================
   * 📌 State Management & Filtering
   * =========================== */

  const applyFilters = useCallback(() => {
    if (!store.boundaryResults?.length) {
      console.warn("❌ No resources available for filtering.");
      return;
    }

    const filteredCategories = Object.keys(categories).filter(
      (key) => categories[key]
    );
    const filteredDays = Object.keys(days).filter((key) => days[key]);

    if (filteredCategories.length === 0 && filteredDays.length === 0) {
      setFilteredResults2(store.boundaryResults);
      return;
    }

    const filtered = store.boundaryResults.filter((resource) => {
      const categoryMatch =
        filteredCategories.length === 0 ||
        (resource.category &&
          resource.category
            .split(",")
            .some((cat) =>
              filteredCategories.includes(cat.trim().toLowerCase())
            ));

      const dayMatch =
        filteredDays.length === 0 ||
        (resource.schedule &&
          filteredDays.some((day) => resource.schedule[day]?.start));

      return categoryMatch && dayMatch;
    });

    // console.log("📊 Filtered Results:", filtered);
    setFilteredResults2(filtered);
  }, [categories, days, store.boundaryResults]);

  const fetchCachedBounds = async (query, isZip = false) => {
    const cacheKey = `bounds-${JSON.stringify(query)}`;
    const cachedData = sessionStorage.getItem(cacheKey);
    if (cachedData) return JSON.parse(cachedData);

    let data = await fetchBounds(query, isZip);
    if (data) sessionStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
  };

  /* ===========================
   * 📌 Event Handlers
   * =========================== */

  const MIN_BOUNDS_CHANGE = 0.002;

  const boundsAreSimilar = (bounds1, bounds2) => {
    if (!bounds1 || !bounds2) return false;

    const latDiff = Math.abs(bounds1.ne.lat - bounds2.ne.lat);
    const lngDiff = Math.abs(bounds1.ne.lng - bounds2.ne.lng);

    return latDiff < MIN_BOUNDS_CHANGE && lngDiff < MIN_BOUNDS_CHANGE;
  };

  const handleBoundsChange = useCallback(
    debounce(({ bounds, center, zoom }) => {
      if (!bounds || !bounds.ne || !bounds.sw) return;

      const latChanged = Math.abs(center.lat - mapCenter.lat) > 0.0001;
      const lngChanged = Math.abs(center.lng - mapCenter.lng) > 0.0001;
      const zoomChanged = zoom !== mapZoom;

      const newBounds = {
        ne: { lat: bounds.ne.lat, lng: bounds.ne.lng },
        sw: { lat: bounds.sw.lat, lng: bounds.sw.lng },
      };
      if (isRateLimited()) {
        console.warn(
          "⛔ Rate limit hit: skipping map update to save API calls."
        );
        return;
      }

      const isFirstCall = !lastBounds;

      if (
        !isFirstCall &&
        boundsAreSimilar(newBounds, lastBounds) &&
        !latChanged &&
        !lngChanged &&
        !zoomChanged
      ) {
        console.log(
          "🛑 Bounds, center, and zoom are basically the same. Skipping."
        );
        return;
      }

      setLastBounds(newBounds);
      if (latChanged || lngChanged) setMapCenter(center);
      if (zoomChanged) setMapZoom(zoom);
      actions.setBoundaryResults(newBounds, categories, days);
    }, 1000),
    [lastBounds, mapCenter, mapZoom, categories, days]
  );

  const mapCenterRef = useRef(mapCenter);
  useEffect(() => {
    mapCenterRef.current = mapCenter;
  }, [mapCenter]);

  useEffect(() => {
    const favorites = sessionStorage.getItem("favorites");
    if (favorites) {
      try {
        const parsed = JSON.parse(favorites);
        setStore({ favorites: parsed });
        console.log("✅ Rehydrated favorites from sessionStorage:", parsed);
      } catch (err) {
        console.warn("⚠️ Could not rehydrate favorites. Fetching instead.");
        actions.fetchFavorites();
      }
    } else {
      actions.fetchFavorites();
    }
  }, []);

  return (
    <>
      {loadingLocation && (
        <div className="loading-alert">Finding your location...</div>
      )}

      <div className={`grand-resilio-container`}>
        <Sidebar
          handleCategoryChange={handleCategoryChange}
          handleDayChange={handleDayChange}
          setIsFilterModalOpen={setIsFilterModalOpen}
          layout={layout}
          setLayout={setLayout}
          categories={categories}
          setCategories={setCategories}
          days={days}
          setDays={setDays}
          INITIAL_DAY_STATE={INITIAL_DAY_STATE}
          fetchCachedBounds={fetchCachedBounds}
          handleBoundsChange={handleBoundsChange}
          updateCityStateFromZip={updateCityStateFromZip}
          city={city}
          resetFilters={resetFilters}
          mapInstance={mapInstance}
          setMapInstance={setMapInstance}
          mapsInstance={mapsInstance}
          setMapsInstance={setMapsInstance}
          filteredResults2={filteredResults2}
        />

        <div className="grand-map-container">
          <ErrorBoundary>
            <Map
              filteredResults2={filteredResults2}
              handleBoundsChange={handleBoundsChange}
              setMapCenter={setMapCenter}
              mapCenter={mapCenter}
              setMapZoom={setMapZoom}
              mapZoom={mapZoom}
              layout={layout}
              hoveredItem={hoveredItem}
              setHoveredItem={setHoveredItem}
              city={city}
              mapInstance={mapInstance}
              setMapInstance={setMapInstance}
              mapsInstance={mapsInstance}
              setMapsInstance={setMapsInstance}
              categories={categories}
              days={days}
            />
          </ErrorBoundary>
        </div>

        {store.modalIsOpen && (
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
                isFilterModalOpen={isFilterModalOpen}
                setIsFilterModalOpen={setIsFilterModalOpen}
                applyFilters={applyFilters}
                handleCategoryChange={handleCategoryChange}
                handleDayChange={handleDayChange}
                categories={categories}
                days={days}
                resetFilters={resetFilters}
              />
            </ErrorBoundary>
          ) : (
            <p>Loading selection options...</p>
          ))}
      </div>

      {store.donationModalIsOpen && (
        <>
          <Donation />
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
