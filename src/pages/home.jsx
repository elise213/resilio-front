import React, { useState, useContext, useRef, useEffect } from "react";
import { Context } from "../store/appContext";
import { SimpleMap, Selection, Loading, ResourceCard, DaySelection, MapSettings, Modal } from "../component";
import CircleType from "circletype";

const Home = () => {
  const { store, actions } = useContext(Context);
  const apiKey = import.meta.env.VITE_GOOGLE;

  // REFS
  const ulRef = useRef(null);
  const fetchCounterRef = useRef(0);
  const abortControllerRef = useRef(null)
  const circleInstance = useRef();

  // STATES
  const [isLocating, setIsLocating] = useState(false);
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
    setResources(prev => {
      const updatedResources = { ...prev };
      const demoIds = ["lgbtq", "women", "seniors", "youth"];
      demoIds.forEach(id => {
        updatedResources[id] = false;
      });
      return updatedResources;
    });
  };

  const clearAll = () => {
    setResources(store.RESOURCE_OPTIONS.reduce((acc, curr) => ({ ...acc, [curr.id]: false }), {}));
    setDays(store.DAY_OPTIONS.reduce((acc, curr) => ({ ...acc, [curr.id]: false }), {}));
    setGroupFilters({
      LGBTQ: false,
      women: false,
      youth: false,
      seniors: false
    });
  };

  const toggleResource = (resourceId) => {
    setResources(prev => {
      const updatedResources = { ...prev, [resourceId]: !prev[resourceId] };
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

  // const toggleGroupFilter = (filterName) => {
  //   setGroupFilters((prev) => ({ ...prev, [filterName]: !prev[filterName] }));
  // };

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

  // USE EFFECTS
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
          if (resources && days && boundsData) {
            await actions.setBoundaryResults(boundsData, resources, days);
          }
        }
      } catch (error) {
        console.error("Error in fetching boundary results:", error);
      }
    };
    fetchData();
    return () => abortControllerRef.current?.abort();
  },
    // []);
    [boundsData, resources, days, city]);


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


  useEffect(() => {
    setBoundsData(city.bounds);
  }, [boundsData]);

  useEffect(() => {
    const handleResize = () => {
      console.log('Window resized!');
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
            Don't filter by Category
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
              {store.boundaryResults.length === 0 && !store.loading && !isLocating ? (<li><Loading name="none" /></li>) : ''}
              {isLocating ? (<li><Loading name="locating" /></li>) : ""}
              {store.loading ? (<li><Loading name="loading" /></li>) : ''}

              {!store.loading && !isLocating ? (
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
              <MapSettings setIsLocating={setIsLocating} clearAll={clearAll} updateData={updateData} setCity={setCity} zipInput={zipInput} setZipInput={setZipInput} filterByBounds={filterByBounds} setFilterByBounds={setFilterByBounds} />
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