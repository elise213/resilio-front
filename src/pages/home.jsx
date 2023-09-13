import React, { useState, useContext, useRef, useEffect } from "react";
import { Context } from "../store/appContext";
import { SimpleMap } from "../component/SimpleMap";
import Selection from "../component/Selection";
import { NoResults } from "../component/NoResults";
import { Loading } from "../component/Loading";
import { ResourceCard } from "../component/ResourceCard";
import DaySelection from "../component/DaySelection";
import MapSettings from "../component/MapSettings";
import CircleType from "circletype";
import Modal from "../component/Modal";

const Home = () => {
  const { store, actions } = useContext(Context);
  const apiKey = import.meta.env.VITE_GOOGLE;

  // REFS
  const ulRef = useRef(null);
  const fetchCounterRef = useRef(0);
  const abortControllerRef = useRef(null)
  const circleInstance = useRef();

  // STATES
  const [isScrolledToEnd, setIsScrolledToEnd] = useState(false);
  const [city, setCity] = useState({
    center: { lat: 34.0522, lng: -118.2437 },
    bounds: {
      ne: { lat: 34.24086583325125, lng: -117.80047032470705 },
      sw: { lat: 33.86311337069103, lng: -118.68692967529368 }
    }
    // center: { lat: 30.266666, lng: -97.733330 },
    // bounds: {
    //   ne: { lat: (30.266666 + 0.18866583325124964), lng: (-97.733330 + 0.44322967529295454) },
    //   sw: { lat: (30.266666 - 0.18908662930897435), lng: (-97.733330 - 0.44322967529298296) }
    // }
  });
  const [resources, setResources] = useState(
    store.RESOURCE_OPTIONS.reduce((acc, curr) => ({ ...acc, [curr.id]: false }), {})
  );
  const [days, setDays] = useState(
    store.DAY_OPTIONS.reduce((acc, curr) => ({ ...acc, [curr.id]: false }), {})
  );
  const [groupFilters, setGroupFilters] = useState({
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
  const [filterByBounds, setFilterByBounds] = useState(true);
  const [boundsData, setBoundsData] = useState();
  const [zipInput, setZipInput] = useState("");
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [filterByGroup, setFilterByGroup] = useState(false);

  // FUNCTIONS
  const handleDontDemo = () => {
    setFilterByGroup(!filterByGroup);

    // Set all the demoIds in resources to false
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
      const checkIfAllServicesShouldBeChecked = (currentResources) => {
        const anyServiceChecked = store.RESOURCE_OPTIONS.some(opt => currentResources[opt.id] && opt.id !== "allKinds");
        setAllKinds(!anyServiceChecked);
      };
      return updatedResources;
    });
  };
  const toggleDay = (dayId) => {
    setDays(prev => {
      if (dayId === 'allDays') {
        return {
          ...prev,
          allDays: !prev.allDays,
          // Reset all other days to false
          ...store.DAY_OPTIONS.reduce((acc, currDay) => {
            if (currDay.id !== 'allDays') acc[currDay.id] = false;
            return acc;
          }, {})
        };
      }
      // If any other day is clicked
      return {
        ...prev,
        allDays: false,  // Uncheck "allDays"
        [dayId]: !prev[dayId]
      };
    });
  };
  const toggleGroupFilter = (filterName) => {
    setGroupFilters((prev) => ({ ...prev, [filterName]: !prev[filterName] }));
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
    if (allKinds) {
      setMoreOpen(false);
    }
    if (!allKinds) {
      setAllKinds(prevAllKinds => !prevAllKinds);
      const updatedResources = Object.keys(resources).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});
      setResources(updatedResources);
    };
    checkIfAllServicesShouldBeChecked();
  };
  const checkIfAllServicesShouldBeChecked = () => {
    const anyServiceChecked = store.RESOURCE_OPTIONS.some(opt => resources[opt.id] && opt.id !== "allKinds");
    setAllKinds(!anyServiceChecked);
  };
  const updateData = async () => {
    if (!store.schedule) {
      actions.setSchedules();
    }
    if (boundsData) {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();
      const currentFetchCount = ++fetchCounterRef.current;
      const fetchData = async () => {
        try {
          if (currentFetchCount === fetchCounterRef.current) {
            if (days && boundsData) {
              await actions.setBoundaryResults(boundsData, resources, days);
            }
          }
        } catch (error) {
        }
      };
      fetchData();
      return () => abortControllerRef.current?.abort();
    }
    checkIfAllServicesShouldBeChecked();
  };
  function clearZipInput() {
    setZipInput('');
  }
  const handleEvent = (day) => {
    if (day === "allDays") {
      setDropdownOpen(!dropdownOpen);
      Object.keys(days).forEach(d => {
        if (days[d]) {
          toggleDay(d);
        }
      });
    } else {
      // If any other day is selected while "Any Day" is already selected, then deselect "Any Day"
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

  const handleZipInputChange = async (e) => {
    const value = e.target.value;
    if (value.length <= 5 && /^[0-9]{0,5}$/.test(value)) {
      setZipInput(value);
      if (value.length === 5) {
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${value}&key=${apiKey}`,
          );
          if (!response.ok) {
            throw new Error("Failed to fetch data from Google Maps API");
          }
          const data = await response.json();
          if (data && data.results && data.results[0] && data.results[0].geometry) {
            const location = data.results[0].geometry.location;
            const bounds = data.results[0].geometry.bounds || data.results[0].geometry.viewport;
            setCity({
              center: { lat: location.lat, lng: location.lng },
              bounds: {
                ne: { lat: bounds.northeast.lat, lng: bounds.northeast.lng },
                sw: { lat: bounds.southwest.lat, lng: bounds.southwest.lng }
              }
            });
          }
        } catch (error) {
          console.error("Error while updating city center / bounds:", error.message);
          alert("There was an issue fetching location data.");
        }
      }
    }
  };

  // USE EFFECTS
  useEffect(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    const currentFetchCount = ++fetchCounterRef.current;
    const fetchData = async () => {
      try {
        if (currentFetchCount === fetchCounterRef.current) {
          if (days && boundsData) {
            await actions.setBoundaryResults(boundsData, resources, days);
          }
        }
      } catch (error) {
        console.error("Error in fetching boundary results:", error);
      }
    };
    fetchData();
    return () => abortControllerRef.current?.abort();
  }, [boundsData, resources, days]);
  useEffect(() => {
    const handleScroll = () => {
      if (ulRef.current) {
        const { scrollWidth, clientWidth, scrollLeft } = ulRef.current;
        const atEndOfScroll = scrollWidth - clientWidth - scrollLeft < 10; // adjust the "10" as needed
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
    setBoundsData(city.bounds);
    checkIfAllServicesShouldBeChecked();
  }, [city, resources]);
  useEffect(() => {
    updateData();
  }, [
    days, resources
  ]);
  useEffect(() => {
    const handleResize = () => {
      console.log('Window resized!');
      checkIfAllServicesShouldBeChecked();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  useEffect(() => {
    let circle1
    if (circleInstance.current) {
      circle1 = new CircleType(circleInstance.current).radius(500)
    };
    return () => {
      circle1 && circle1.destroy();
    };
  }, []);
  useEffect(() => {
    if (ulRef.current && ulRef.current.scrollWidth > ulRef.current.clientWidth) {
      setIsOverflowing(true);
    } else {
      setIsOverflowing(false);
    }
  }, [store.boundaryResults]);

  // RETURN
  return (
    <div>
      <div className="grand-container">
        <div className="search-container">
          <div className="what-type">
            <div className="question">
              <div className="circle-font" ref={circleInstance}>What Do You Need?</div>
            </div>
            {/* SELECTION */}
            <Selection resources={resources} handleAllKinds={handleAllKinds} allKinds={allKinds} toggleResource={toggleResource} moreOpen={moreOpen} filterByGroup={filterByGroup} />
            {dropdownOpen &&
              <DaySelection
                days={days}
                toggleDay={toggleDay}
                dropdownOpen={dropdownOpen}
                setDropdownOpen={setDropdownOpen}
                allDays={days.allDays}
                handleEvent={handleEvent}
                setMoreOpen={setMoreOpen}
                moreOpen={moreOpen}
              />
            }
          </div>
        </div>
        {/* FILTER OPTIONS */}
        {!filterByGroup &&
          <button className="my-schedule-button" onClick={() => setFilterByGroup(!filterByGroup)}>
            Filter by Demographic
          </button>
        }
        {filterByGroup &&
          <button className="my-schedule-button" onClick={() => handleDontDemo()
          }>
            Don't Filter by Demographics
          </button>
        }
        {!moreOpen &&
          <button className="my-schedule-button" onClick={() => setMoreOpen(!moreOpen)}>
            Filter By Category
          </button>
        }
        {moreOpen &&
          <button className="my-schedule-button" onClick={() => {
            setMoreOpen(!moreOpen);
            handleAllKinds();
          }}>
            See All Categories
          </button>
        }
        {!dropdownOpen &&
          <button className="my-schedule-button"
            onClick={() => setDropdownOpen(!dropdownOpen)}>
            Filter By Day
          </button>
        }
        {dropdownOpen &&
          <button className="my-schedule-button"
            onClick={handleDontFilterByDay}>
            Don't Filter By Day
          </button>
        }
        <div className="search-results-full">
          {!isScrolledToEnd && isOverflowing ?
            (<div className="scroll-warning">
              <span>
                Scroll to see more
              </span>
              <i className="fa-solid fa-arrow-right"></i>
            </div>
            ) : <p className="spacing-scroll-warning"></p>}
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
              {store.boundaryResults.length === 0 && !store.loading ? (<li><NoResults /></li>) : ''}
              {store.loading ? (<li><Loading /></li>) : ''}
              {!store.loading ? (
                store.boundaryResults.map((result, i) => (
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
                ))
              ) : ''}
            </ul>
          </div>
          {/* MAP */}
          <div className="new-container">
            <div className="map-settings-container">
              <MapSettings setCity={setCity} zipInput={zipInput} filterByBounds={filterByBounds} setFilterByBounds={setFilterByBounds} handleZipInputChange={handleZipInputChange} />
            </div>
            <div className="map-and-cities">
              <SimpleMap
                openModal={openModal}
                closeModal={closeModal}
                selectedResource={selectedResource}
                setFilterByBounds={setFilterByBounds}
                filterByBounds={filterByBounds}
                setBoundsData={setBoundsData}
                city={city}
                setCity={setCity}
                clearZipInput={clearZipInput}
                zipInput={zipInput}
                resources={resources}
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