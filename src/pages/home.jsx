import React, { useState, useContext, useRef, useEffect } from "react";
import { Context } from "../store/appContext";
import { SimpleMap } from "../component/SimpleMap";
import { ResourceCard } from "../component/ResourceCard";
import DaySelection from "../component/DaySelection";
import MapSettings from "../component/MapSettings";
import { useSearchParams } from "react-router-dom";
import CircleType from "circletype";
import Modal from "../component/Modal";
import arrow from "/assets/coralarrow.png";

const Home = () => {
  const { store, actions } = useContext(Context);
  const [searchParams, setSearchParams] = useSearchParams();
  const [food, setFood] = useState(false);
  const [shelter, setShelter] = useState(false);
  const [health, setHealth] = useState(false);
  const [hygiene, setHygiene] = useState(false);
  const [work, setWork] = useState(false);
  const [bathroom, setBathroom] = useState(false);
  const [wifi, setWiFi] = useState(false);
  const [substance, setSubstance] = useState(false);
  const [crisis, setCrisis] = useState(false);
  const [lgbtq, setLgbtq] = useState(false);
  const [women, setWomen] = useState(false);
  const [seniors, setSeniors] = useState(false);
  const [mental, setMental] = useState(false);
  const [sex, setSex] = useState(false);
  const [legal, setLegal] = useState(false);
  const [youth, setYouth] = useState(false);
  const [monday, setMonday] = useState(false);
  const [tuesday, setTuesday] = useState(false);
  const [wednesday, setWednesday] = useState(false);
  const [thursday, setThursday] = useState(false);
  const [friday, setFriday] = useState(false);
  const [saturday, setSaturday] = useState(false);
  const [sunday, setSunday] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [allKinds, setAllKinds] = useState(true);
  const [filterByBounds, setFilterByBounds] = useState(true);
  const [boundsData, setBoundsData] = useState();
  const [zipInput, setZipInput] = useState();
  const apiKey = import.meta.env.VITE_GOOGLE;
  const [city, setCity] = useState({
    // AUSTIN
    // center: { lat: 30.266666, lng: -97.733330 },
    // LOS ANGELES
    center: { lat: 34.0522, lng: -118.2437 },
    bounds: {
      ne: { lat: (34.0522 + 0.18866583325124964), lng: (-118.2437 + 0.44322967529295454) },
      sw: { lat: (34.0522 - 0.18908662930897435), lng: (-118.2437 - 0.44322967529298296) }
    }
  });
  const circleInstance = useRef();

  const openModal = (resource) => {
    setSelectedResource(resource);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedResource(null);
    setModalIsOpen(false);
  };


  const alwaysVisibleOptions = [
    { id: "food", label: "Food", state: food, handler: setFood },
    { id: "shelter", label: "Shelter", state: shelter, handler: setShelter },
    { id: "health", label: "Health Care", state: health, handler: setHealth },
    { id: "allKinds", label: "All Resources", state: allKinds, handler: setAllKinds }
  ];

  const otherOptions = [
    { id: "hygiene", label: "Showers", state: hygiene, handler: setHygiene },
    { id: "crisis", label: "Crisis Support", state: crisis, handler: setCrisis },
    { id: "substance", label: "Substance Support", state: substance, handler: setSubstance },
    { id: "work", label: "Work", state: work, handler: setWork },
    { id: "bathroom", label: "Public Bathrooms", state: bathroom, handler: setBathroom },
    { id: "wifi", label: "WiFi", state: wifi, handler: setWiFi },
    { id: "mental", label: "Mental Health", state: mental, handler: setMental },
    { id: "sex", label: "Sexual Health", state: sex, handler: setSex },
    { id: "legal", label: "Legal Support", state: legal, handler: setLegal },
    { id: "lgbtq", label: "LGBTQ+", state: lgbtq, handler: setLgbtq },
    { id: "women", label: "Women", state: women, handler: setWomen },
    { id: "seniors", label: "Seniors", state: seniors, handler: setSeniors },
    { id: "youth", label: "Youth 18-24", state: youth, handler: setYouth },
  ];

  const options = [
    ...alwaysVisibleOptions,
    ...otherOptions
  ];

  const handleCheckbox = (id, checked) => {
    if (id === "allKinds") {
      if (!checked) {
        setMoreOpen(false);
        const anyOtherServiceChecked = options.some(opt => opt.id !== "allKinds" && opt.state);
        if (!anyOtherServiceChecked) return; // If trying to uncheck "All Services" and no other service is checked, prevent it.
      }
      setAllKinds(checked);
      setMoreOpen(false);
      options.forEach(opt => opt.handler(false)); // 
    } else {
      const option = options.find(opt => opt.id === id);
      option && option.handler(checked);
      checkIfAllServicesShouldBeChecked();
    }
  };


  const checkIfAllServicesShouldBeChecked = () => {
    const anyServiceChecked = options.some(opt => opt.state === true);
    if (!anyServiceChecked) {
      setAllKinds(true);
    } else {
      setAllKinds(false);
    }
  };

  useEffect(() => {
    setBoundsData(city.bounds);
  }, [city]);


  useEffect(() => {
    let circle1
    if (circleInstance.current) {
      circle1 = new CircleType(circleInstance.current).radius(500)
    };

    return () => {
      circle1 && circle1.destroy();

    };
  }, [searchParams, dropdownOpen]);

  useEffect(() => {
    if (boundsData) {
      actions.setBoundaryResults(boundsData);
    }
  }, [filterByBounds, boundsData, zipInput]);


  useEffect(() => {
    const updateData = async () => {
      await setSearchParams({
        monday, tuesday, wednesday, thursday, friday, saturday, sunday,
        food, shelter, health, hygiene, work, bathroom, wifi, crisis, substance,
        lgbtq, women, seniors, mental, sex, legal, youth
      });
      actions.setSchedules();
      if (boundsData) {
        actions.setBoundaryResults(boundsData);
      }
    };
    const allCategories = [food, shelter, health, hygiene, work, bathroom, wifi, crisis, substance,
      lgbtq, women, seniors, mental, sex, legal, youth];

    if (allCategories.every(category => !category)) {
      setAllKinds(true);
    }
    updateData();
  }, [
    monday, tuesday, wednesday, thursday, friday, saturday, sunday,
    food, shelter, health, hygiene, work, bathroom, wifi, crisis, substance,
    lgbtq, women, seniors, mental, sex, legal, youth, boundsData
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

  const handleZipInputChange = async (e) => {
    const value = e.target.value;
    if (value.length <= 5 && /^[0-9]*$/.test(value)) {
      setZipInput(value);

      if (value.length === 5) {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${value}&key=${apiKey}`);
        const data = await response.json();

        if (data && data.results && data.results[0] && data.results[0].geometry) {
          const location = data.results[0].geometry.location;
          const bounds = data.results[0].geometry.bounds || data.results[0].geometry.viewport; // Fallback to viewport if bounds is not available.

          setCity({
            center: { lat: location.lat, lng: location.lng },
            bounds: {
              ne: { lat: bounds.northeast.lat, lng: bounds.northeast.lng },
              sw: { lat: bounds.southwest.lat, lng: bounds.southwest.lng }
            }
          });
        }
      }
    }
  };

  const [isOverflowing, setIsOverflowing] = useState(false);
  const ulRef = useRef(null);

  useEffect(() => {
    if (ulRef.current && ulRef.current.scrollWidth > ulRef.current.clientWidth) {
      setIsOverflowing(true);
    } else {
      setIsOverflowing(false);
    }
  }, [store.boundaryResults]);


  return (
    <div>
      <div className="grand-container">

        <div className="search-container">

          <div className="what-type">
            <div className="question">
              <div className="circle-font" ref={circleInstance}>What do you need?</div>
            </div>

            <div className="selection">
              {alwaysVisibleOptions.map((option) => (
                <div className="day-column" key={option.id}>
                  <div className="my-form-check">
                    <input
                      className="my-input"
                      type="checkbox"
                      id={option.id}
                      value={option.id}
                      name="selection"
                      checked={option.state}
                      onChange={(e) => handleCheckbox(e.target.id, e.target.checked)}
                    />
                    <label className="my-label" htmlFor={option.id}>
                      {option.label}
                    </label>
                  </div>
                </div>
              ))}

              {moreOpen && otherOptions.map((subOption) => (
                <div className="day-column" key={subOption.id}>
                  <div className="my-form-check">
                    <input
                      className="my-input"
                      type="checkbox"
                      id={subOption.id}
                      value={subOption.id}
                      name="selection"
                      checked={subOption.state}
                      onChange={(e) => handleCheckbox(e.target.id, e.target.checked)}
                    />
                    <label className="my-label" htmlFor={subOption.id}>
                      {subOption.label}
                    </label>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {!moreOpen &&
            <button className="my-schedule-button" onClick={() => setMoreOpen(!moreOpen)}>
              See More Resources
            </button>
          }

          {!dropdownOpen &&
            <button className="my-schedule-button"
              onClick={() => setDropdownOpen(!dropdownOpen)}>
              Filter By Day
            </button>
          }
          {dropdownOpen &&
            <DaySelection
              filterByBounds={filterByBounds}
              boundsData={boundsData}
              setMonday={setMonday}
              setTuesday={setTuesday}
              setWednesday={setWednesday}
              setThursday={setThursday}
              setFriday={setFriday}
              setSaturday={setSaturday}
              setSunday={setSunday}
              setDropdownOpen={setDropdownOpen}
            />
          }

        </div>
        <div className="search-results-full">
          <div
            className="scroll-search-results"
            style={{
              display: filterByBounds && store.boundaryResults.length === 0 ? 'none' : 'block'
            }}
          >
            <ul style={{ listStyleType: "none", justifyContent: isOverflowing ? 'flex-start' : 'center' }} ref={ulRef}>
              {
                // !filterByBounds
                //   ? store.searchResults.map((result, i) => (
                //     <li key={i}>
                //       <ResourceCard
                //         item={result}
                //         openModal={openModal}
                //         closeModal={closeModal}
                //         modalIsOpen={modalIsOpen}
                //         setModalIsOpen={setModalIsOpen}
                //         selectedResource={selectedResource}
                //       />
                //     </li>
                //   ))
                //   : 
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
              }
            </ul>
          </div>
          <div className="new-container">
            <div className="map-settings-container">
              <MapSettings setCity={setCity} handleZipInputChange={handleZipInputChange} zipInput={zipInput} filterByBounds={filterByBounds} setFilterByBounds={setFilterByBounds} />
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
              schedule={store.schedule}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
