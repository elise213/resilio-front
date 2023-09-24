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
import CircleType from "circletype";


const Home = () => {
  const INITIAL_CITY_STATE = {
    // 24.681678475660995  84.99154781534179
    center: { lat: 24.681678475660995, lng: 84.99154781534179 },
    bounds: {
      ne: { lat: 25.0, lng: 85.2 },
      sw: { lat: 24.4, lng: 84.8 }
    }
    // center: { lat: 34.0522, lng: -118.2437 },
    // bounds: {
    //   ne: { lat: 34.24086583325125, lng: -117.80047032470705 },
    //   sw: { lat: 33.86311337069103, lng: -118.68692967529368 }
    // }
  };

  const INITIAL_RESOURCE_STATE = (RESOURCE_OPTIONS) =>
    RESOURCE_OPTIONS.reduce((acc, curr) => {
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
  const [city, setCity] = useState(INITIAL_CITY_STATE);
  const [resources, setResources] = useState(INITIAL_RESOURCE_STATE(store.RESOURCE_OPTIONS));
  const [days, setDays] = useState(INITIAL_DAY_STATE(store.DAY_OPTIONS));
  const [isLocating, setIsLocating] = useState(false);
  const [isScrolledToEnd, setIsScrolledToEnd] = useState(false);

  const [demographics, setDemographics] = useState({
    LGBTQ: false,
    women: false,
    youth: false,
    seniors: false,
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  const [allKinds, setAllKinds] = useState(true);
  const [allGroups, setAllGroups] = useState(true);

  const [filterByBounds, setFilterByBounds] = useState(true);
  const [filterByGroup, setFilterByGroup] = useState(false);
  // const [boundsData, setBoundsData] = useState();
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
      actions.setBoundaryResults(city.bounds, resources, days);
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
    setResources(store.RESOURCE_OPTIONS.reduce((acc, curr) => ({ ...acc, [curr.id]: false }), {}));
    setDays(store.DAY_OPTIONS.reduce((acc, curr) => ({ ...acc, [curr.id]: false }), {}));
    setDemographics({
      LGBTQ: false,
      women: false,
      youth: false,
      seniors: false
    });
  };

  const toggleDay = (dayId) => {
    setDays(prev => {
      if (dayId === 'allDays') {
        return {
          ...prev,
          allDays: !prev.allDays,
          ...store.DAY_OPTIONS.reduce((acc, currDay) => {
            if (currDay.id !== 'allDays') acc[currDay.id] = false;
            return acc;
          }, {})
        };
      }
      return {
        ...prev,
        allDays: false,
        [dayId]: !prev[dayId]
      };
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

  const handleAllKinds = () => {
    if (!allKinds) {
      setAllKinds(prevAllKinds => !prevAllKinds);
      setResources(store.RESOURCE_OPTIONS.reduce((acc, curr) => ({ ...acc, [curr.id]: false }), {}));
    };
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
            if (resources && days && city?.bounds) {
              actions.setBoundaryResults(city.bounds, resources, days);
            }
          }
        } catch (error) {
        }
      };
      fetchData();
      return () => abortControllerRef.current?.abort();
    }
  };


  const handleEvent = (day) => {
    if (day === "allDays") {
      Object.keys(days).forEach(d => {
        if (days[d]) {
          toggleDay(d);
        }
      });
    } else {
      if (days["allDays"]) {
        toggleDay("allDays");
      }
      toggleDay(day);
    }
  };

  const handleDontFilterByDay = () => {
    setDropdownOpen(!dropdownOpen);
    handleEvent("allDays");
  };

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
    const anyServiceChecked = store.RESOURCE_OPTIONS.some(opt => resources[opt.id] && opt.id !== "allKinds");
    setAllKinds(!anyServiceChecked);
  }, [resources]);


  useEffect(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    const currentFetchCount = ++fetchCounterRef.current;
    const fetchData = async () => {
      try {
        if (currentFetchCount === fetchCounterRef.current) {
          if (resources && days && city.bounds) {
            console.log("Sending boundsData to backend", city.bounds);
            // actions.setBoundaryResults(boundsData, resources, days);
            await actions.setBoundaryResults(city.bounds, resources, days);
          }
        }
      } catch (error) {
        console.error("Error in fetching boundary results:", error);
      }
    };
    fetchData();

    return () => abortControllerRef.current?.abort();
  },
    [city.bounds, resources, days, city]);


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
  }, [days, resources, city]);

  // useEffect(() => {
  //   let circle1
  //   if (circleInstance.current) {
  //     circle1 = new CircleType(circleInstance.current).radius(500)
  //   };
  //   return () => {
  //     circle1 && circle1.destroy();
  //   };
  // }, []);

  useEffect(() => {
    if (ulRef.current && ulRef.current.scrollWidth > ulRef.current.clientWidth) {
      setIsOverflowing(true);
    } else {
      setIsOverflowing(false);
    }
  }, [store.boundaryResults]);


  useEffect(() => {
    if (city)
      console.log('City state has changed: ', city);
  }, [city]);
  const handleAllGroups = () => {
    setDemographics({
      LGBTQ: false,
      women: false,
      youth: false,
      seniors: false,
    });
    setAllGroups(true);
    setResources(prev => {
      const updatedResources = { ...prev };
      const demoIds = ["lgbtq", "women", "seniors", "youth"];
      demoIds.forEach(id => {
        updatedResources[id] = false;
      });
      return updatedResources;
    });
  };


  const toggleResource = (resourceId) => {
    setResources(prev => {
      const updatedResources = { ...prev, [resourceId]: !prev[resourceId] };
      if (["lgbtq", "women", "seniors", "youth"].includes(resourceId)) {
        setAllGroups(false);
      }
      return updatedResources;
    });
  };


  // RETURN
  return (
    <div>
      <div className="grand-container">
        <div className="search-container">
          <div className="what-type">

            {/* <div className="circle-font" ref={circleInstance}>What Do You Need?</div> */}
            <img className="home-logo" src={Logo} alt="Alive Logo" />

            {/* SELECTION */}
            <Selection
              allGroups={allGroups}
              setAllGroups={setAllGroups}
              handleAllKinds={handleAllKinds}
              allKinds={allKinds}
              toggleResource={toggleResource}
              moreOpen={moreOpen}
              resources={resources}
              filterByGroup={filterByGroup}
              days={days}
              handleEvent={handleEvent}  // make sure to pass handleEvent here
              setMoreOpen={setMoreOpen}
              setFilterByGroup={setFilterByGroup}
              setDropdownOpen={setDropdownOpen}
              handleDontFilterByDay={handleDontFilterByDay}
              dropdownOpen={dropdownOpen}
              handleAllGroups={handleAllGroups}
              allgroups={allGroups}
            />
          </div>
        </div>
        {/* FILTER OPTIONS */}
        <div className="search-results-full">
          {/* {!isScrolledToEnd && isOverflowing ?
            (<div className="scroll-warning">
              <span>
                Scroll to see more
              </span>
              <i className="fa-solid fa-arrow-right"></i>
            </div>
            ) : <p className="spacing-scroll-warning"></p>} */}
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
                  // if (result.latitude !== "24.681678475660995") { console.log("LATITUDE", result, result.latitude) };
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
};
export default Home;