import React, { useState, useContext, useRef, useEffect } from "react";
import { Context } from "../store/appContext";
import Logo from "/assets/RESILIOO.png";
import {
  SimpleMap,
  Selection,
  Loading,
  ResourceCard,
  MapSettings,
  Modal
} from "../component";

const Home = () => {

  const INITIAL_CITY_STATE = {
    center: { lat: 24.681678475660995, lng: 84.99154781534179 },
    bounds: {
      ne: { lat: 25.0, lng: 85.2 },
      sw: { lat: 24.4, lng: 84.8 }
    }
  };

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
  const { store, actions } = useContext(Context);
  const apiKey = import.meta.env.VITE_GOOGLE;

  // REFS
  const ulRef = useRef(null);
  const fetchCounterRef = useRef(0);
  const abortControllerRef = useRef(null);
  const circleInstance = useRef();

  // STATES
  const [categories, setCategories] = useState(INITIAL_CATEGORY_STATE(store.CATEGORY_OPTIONS));
  const [days, setDays] = useState(INITIAL_DAY_STATE(store.DAY_OPTIONS));
  const [groups, setGroups] = useState(INITIAL_GROUP_STATE(store.GROUP_OPTIONS));

  const [allCategories, setAllCategories] = useState(true);
  const [allGroups, setAllGroups] = useState(true);
  const [allDays, setAllDays] = useState(true);



  const [city, setCity] = useState(INITIAL_CITY_STATE);
  const [isLocating, setIsLocating] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const [isScrolledToEnd, setIsScrolledToEnd] = useState(false);


  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [selectedResource, setSelectedResource] = useState(null);

  const [zipInput, setZipInput] = useState("");
  const [isOverflowing, setIsOverflowing] = useState(false);

  // FUNCTIONS


  const handleBoundsChange = (data) => {
    console.log("CALLED HANDLE BOUNDS CHANGE", data)
    setCity(prevState => ({
      ...prevState,
      bounds: data.bounds,
      center: {
        lat: data.center.lat,
        lng: normalizeLongitude(data.center.lng),
      }
    }));
  }

  useEffect(() => {
    if (city.bounds) {
      console.log("NEW CITY INFO", city)
      actions.setBoundaryResults(city.bounds, categories, days, groups);
    }
  }, [city]);


  const normalizeLongitude = (lng) => {
    console.log("normalize long called")
    if (lng > 180) {
      return lng - 360;
    }
    if (lng < -180) {
      return lng + 360;
    }
    return lng;
  };

  const fetchBounds = async (query, isZip = false) => {
    console.log("fetch bounds called")
    let apiUrl;
    if (isZip) {
      apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${apiKey}`;
    } else {
      apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${query.lat},${query.lng}&key=${apiKey}`;
    }
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log('Raw API response:', JSON.stringify(data.results[0].geometry));

    const location = data.results[0]?.geometry?.location;
    let bounds = data.results[0]?.geometry?.bounds || data.results[0]?.geometry?.viewport;
    console.log('Bounds:', bounds);
    // Fallback logic
    if (!bounds && location) {
      const offset = 0.01; // Some arbitrary small number
      bounds = {
        ne: { lat: location.lat + offset, lng: normalizeLongitude(location.lng + offset) },
        sw: { lat: location.lat - offset, lng: normalizeLongitude(location.lng - offset) },
      };
    }

    console.log('Location:', location);
    console.log('Bounds:', bounds);

    return data;
  };


  const updateCityStateFromCoords = async (lat, lng) => {
    try {
      const data = await fetchBounds({ lat, lng });
      const location = data.results[0]?.geometry?.location;
      const bounds = data.results[0]?.geometry?.bounds || data.results[0]?.geometry?.viewport;
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
      console.log("ZIPPPPPPINPUTCHANGE 5")
      await updateCityStateFromZip(value);
    }
  };

  const updateCityStateFromZip = async (zip) => {
    try {
      const data = await fetchBounds(zip, true);
      const location = data.results[0]?.geometry?.location;
      const bounds = data.results[0]?.geometry?.bounds || data.results[0]?.geometry?.viewport;
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


  const clearAll = () => {
    setCategories(store.CATEGORY_OPTIONS.reduce((acc, curr) => ({ ...acc, [curr.id]: false }), {}));
    setDays(store.DAY_OPTIONS.reduce((acc, curr) => ({ ...acc, [curr.id]: false }), {}));
    setGroups({
      LGBTQ: false,
      women: false,
      youth: false,
      seniors: false
    });
  };


  const handleAllCheckboxes = (setStateFunc, options, allFlagName) => {
    const newState = {};
    Object.keys(options).forEach(key => {
      newState[key] = false;
    });
    newState[allFlagName] = true;
    setStateFunc(newState);
  };

  const toggleDay = (dayId) => {
    setDays(prev => {
      if (dayId === 'allDays') {
        handleAllCheckboxes(setDays, prev, 'allDays');
      } else {
        return { ...prev, allDays: false, [dayId]: !prev[dayId] };
      }
    });
  };

  const openModal = (resource) => {
    setSelectedResource(resource);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedResource(null);
    setModalIsOpen(false);
  };


  const handleAllCategories = () => {
    handleAllCheckboxes(setCategories, categories, 'allCategories');
  };

  const handleAllGroups = () => {
    handleAllCheckboxes(setGroups, groups, 'allGroups');
  };

  const handleAllDays = () => {
    handleAllCheckboxes(setDays, days, 'allDays');
  };


  const updateData = async () => {
    console.log("update DATA function called")
    if (!store.schedule) {
      actions.setSchedules();
    }
    if (city.bounds) {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();
      const currentFetchCount = ++fetchCounterRef.current;
      const fetchData = async () => {
        try {
          if (currentFetchCount === fetchCounterRef.current) {
            if (categories && days && city?.bounds) {
              actions.setBoundaryResults(city.bounds, categories, days, groups);
            }
          }
        } catch (error) {
        }
      };
      fetchData();
      return () => abortControllerRef.current?.abort();
    }
  };

  const handleEvent = (dayId) => {
    if (dayId === 'allDays') {
      handleAllCheckboxes(setDays, days, 'allDays');
    } else {
      setDays(prev => ({ ...prev, allDays: false, [dayId]: !prev[dayId] }));
    }
  };

  // console.log("DAYS", days, "CATEGORIES", categories, "GROUPS", groups)

  const geoFindMe = async () => {
    console.log("GEO FIND ME CALLED");
    setIsLocating(true);
    console.log(navigator.geolocation)
    if (navigator.geolocation) {
      console.log("Geolocation supported");
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log("Got position", position);
          setIsLocating(false);
          await updateCityStateFromCoords(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.log("Error getting position", error);
          setIsLocating(false);
          alert("Unable to retrieve your location");
        }
      );
    } else {
      console.log("Geolocation not supported");
      setIsLocating(false);
      alert("Geolocation is not supported by your browser");
    }
  };

  // USE EFFECTS


  useEffect(() => {
    if (zipInput && zipInput.length === 5) {
      updateCityStateFromZip(zipInput);
    }
  }, [zipInput]);

  useEffect(() => {
    console.log("CITY", city)
  }, [city]);


  useEffect(() => {
    const anyServiceChecked = store.CATEGORY_OPTIONS.some(opt => categories[opt.id] && opt.id !== "allCategories");
    setAllCategories(!anyServiceChecked);
  }, [categories]);


  useEffect(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    const currentFetchCount = ++fetchCounterRef.current;
    const fetchData = async () => {
      try {
        if (currentFetchCount === fetchCounterRef.current) {
          if (categories && days && city.bounds) {
            // console.log("Sending boundsData to backend", city.bounds);
            await actions.setBoundaryResults(city.bounds, categories, days, groups);
          }
        }
      } catch (error) {
        console.error("Error in fetching boundary results:", error);
      }
    };
    fetchData();

    return () => abortControllerRef.current?.abort();
  },
    [city.bounds, categories, days, city, groups]);


  useEffect(() => {
    const handleScroll = () => {
      if (ulRef.current) {
        const { scrollWidth, clientWidth, scrollLeft } = ulRef.current;
        const atEndOfScroll = scrollWidth - clientWidth - scrollLeft < 10;
        setIsScrolledToEnd(atEndOfScroll);
      }
    };
    if (ulRef.current) {
      ulRef.current.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (ulRef.current) {
        ulRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    updateData();
  }, [days, categories, city]);


  useEffect(() => {
    if (ulRef.current && ulRef.current.scrollWidth > ulRef.current.clientWidth) {
      setIsOverflowing(true);
    } else {
      setIsOverflowing(false);
    }
  }, [store.boundaryResults]);


  const handleSetAll = (setFn, stateObj, value = true) => {
    const newState = {};
    Object.keys(stateObj).forEach(key => {
      newState[key] = value;
    });
    setFn(newState);
  };


  // RETURN
  return (
    <div>
      <div className="grand-container">
        <div className="search-container">
          <div className="what-type">

            <img className="home-logo" src={Logo} alt="Alive Logo" />


            {store.CATEGORY_OPTIONS && store.DAY_OPTIONS && store.GROUP_OPTIONS && categories && days && groups ? (
              <Selection
                categories={categories}
                setCategories={setCategories}
                groups={groups}
                setGroups={setGroups}
                days={days}
                setDays={setDays}
                setIsOpen={setIsOpen}
                isOpen={isOpen}
                allGroups={allGroups}
                setAllGroups={setAllGroups}
                handleAllCategories={handleAllCategories}
                handleAllGroups={handleAllGroups}
                handleAllCheckboxes={handleAllCheckboxes}
                allCategories={allCategories}
                allDays={allDays}
                handleSetAll={handleSetAll}
                handleEvent={handleEvent}
                handleAllDays={handleAllDays}
                allgroups={allGroups}
              />
            ) : (
              <p>Loading selection options...</p>
            )}

          </div>
        </div>
        {/* FILTER OPTIONS */}
        <div className="search-results-full">
          <div
            className="scroll-search-results"
            style={{
              display: 'block'
            }}
          >
            <ul
              style={{
                listStyleType: "none",
                justifyContent: store.loading || store.boundaryResults.length === 0 ? 'center' : (isOverflowing ? 'flex-start' : 'center')
              }}
              ref={ulRef}
            >
              {store.boundaryResults.length === 0 && !store.loading && !isLocating ? (<li><Loading name="none" /></li>) : ''}
              {isLocating ? (<li><Loading name="locating" /></li>) : ""}
              {store.loading ? (<li><Loading name="loading" /></li>) : ''}

              {!store.loading && !isLocating ? (
                store.boundaryResults.map((result, i) => {
                  return (
                    <li key={i}>
                      <ResourceCard
                        item={result}
                        openModal={openModal}
                        closeModal={closeModal}
                        modalIsOpen={modalIsOpen}
                        setModalIsOpen={setModalIsOpen}
                        selectedResource={selectedResource}
                      />
                    </li>
                  );
                })
              ) : ''}

            </ul>
          </div>
          {/* MAP */}
          <div className="new-container">
            <div className="map-settings-container">
              <MapSettings
                geoFindMe={geoFindMe}
                handleZipInputChange={handleZipInputChange}
                zipInput={zipInput}

              />
            </div>

            <div className="map-and-cities">
              <SimpleMap
                handleBoundsChange={handleBoundsChange}
                openModal={openModal}
                city={city}

              />
            </div>
          </div>
        </div>
      </div>
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
    </div >
  );
}
export default Home;