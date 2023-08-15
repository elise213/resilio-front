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
  const [monday, setMonday] = useState(false);
  const [tuesday, setTuesday] = useState(false);
  const [wednesday, setWednesday] = useState(false);
  const [thursday, setThursday] = useState(false);
  const [friday, setFriday] = useState(false);
  const [saturday, setSaturday] = useState(false);
  const [sunday, setSunday] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [allKinds, setAllKinds] = useState(true);
  const [filterByBounds, setFilterByBounds] = useState(true);
  const [zipCode, setZipCode] = useState("")
  const [boundsData, setBoundsData] = useState();
  const [zipInput, setZipInput] = useState();
  const [wifi, setWiFi] = useState(false);
  const [substance, setSubstance] = useState(false);
  const [crisis, setCrisis] = useState(false);
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
  const circleInstance2 = useRef();
  const circleInstance3 = useRef();

  const openModal = (resource) => {
    setSelectedResource(resource);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedResource(null);
    setModalIsOpen(false);
  };

  const options = [
    { id: "food", label: "Food", state: food, handler: setFood },
    { id: "shelter", label: "Shelter", state: shelter, handler: setShelter },
    { id: "health", label: "Health Care", state: health, handler: setHealth },
    { id: "hygiene", label: "Shower", state: hygiene, handler: setHygiene },
    { id: "bathroom", label: "Bathroom", state: bathroom, handler: setBathroom },
    { id: "substance", label: "Substance Support", state: substance, handler: setSubstance },
    { id: "wifi", label: "Free WiFi", state: wifi, handler: setWiFi },
    { id: "work", label: "Work", state: work, handler: setWork },
    { id: "crisis", label: "Crisis Support", state: crisis, handler: setCrisis },
  ];

  const apiKey = import.meta.env.VITE_GOOGLE;

  const handleCheckbox = (id, checked) => {
    if (id === "allKinds") {
      setAllKinds(true);
      options.forEach(opt => opt.handler(false));
    } else {
      const option = options.find(opt => opt.id === id);
      option && option.handler(checked);
      setAllKinds(false);
    }
  };

  useEffect(() => {
    let circle1, circle2, circle3;
    if (circleInstance.current) {
      circle1 = new CircleType(circleInstance.current).radius(500)
    };
    if (circleInstance2.current) {
      circle2 = new CircleType(circleInstance2.current).radius(500).dir(1)
    }
    if (circleInstance3.current) {
      circle3 = new CircleType(circleInstance3.current).radius(500).dir(1)
    }
    return () => {
      circle1 && circle1.destroy();
      circle2 && circle2.destroy()
      circle3 && circle3.destroy()
    };
  }, [searchParams, dropdownOpen]);

  useEffect(() => {
    if (boundsData) {
      actions.setSearchResults();
      actions.setBoundaryResults(boundsData);
    }
  }, [filterByBounds, boundsData]);

  useEffect(() => {
    const updateData = async () => {
      await setSearchParams({
        food: food,
        shelter: shelter,
        health: health,
        hygiene: hygiene,
        work: work,
        bathroom: bathroom,
        wifi: wifi,
        crisis: crisis,
        substance: substance,
        monday: monday,
        tuesday: tuesday,
        wednesday: wednesday,
        thursday: thursday,
        friday: friday,
        saturday: saturday,
        sunday: sunday,
      });
      actions.setSearchResults(); if (boundsData) {
        actions.setBoundaryResults(boundsData);
      }
    };
    updateData();
  }, [
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,
    food,
    health,
    hygiene,
    shelter,
    work,
    bathroom,
    wifi, crisis, substance,
    filterByBounds,
    boundsData,
    city]);


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
  }, [store.searchResults, store.boundaryResults]);


  return (
    <div>
      <div className="grand-container">

        <div className="search-container">

          <div className="what-type">
            <div className="question">
              <div className="circle-font" ref={circleInstance}>What do you need?</div>
            </div>

            <div className="selection">
              <div className="day-column">
                {options.slice(0, 3).map((option) => (
                  <div className="my-form-check" key={option.id}>
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
                ))}
              </div>

              <div className="day-column">
                {options.slice(3, 6).map((option) => (
                  <div className="my-form-check" key={option.id}>
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
                ))}
              </div>

              <div className="day-column">
                {options.slice(6, 9).map((option) => (
                  <div className="my-form-check" key={option.id}>
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
                ))}
              </div>

              <div className="day-column">
                <div className="my-form-check">
                  <input
                    className="my-input"
                    type="checkbox"
                    id="allKinds"
                    value="allKinds"
                    name="selection"
                    checked={allKinds}
                    onChange={(e) => handleCheckbox(e.target.id, e.target.checked)}
                  />
                  <label className="my-label" htmlFor="allKinds">
                    All Services
                  </label>
                </div>
              </div>
            </div>
          </div>


          {!dropdownOpen &&
            <button className="my-schedule-button"
              onClick={() => setDropdownOpen(!dropdownOpen)}>
              <img className="left-arrow-filter" src={arrow}></img>
              Filter By Day
              <img className="right-arrow-filter" src={arrow}></img>
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
              {!filterByBounds
                ? store.searchResults.map((result, i) => (
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
                : store.boundaryResults.map((result, i) => (
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
            {/* <div className="question">
              <div className="circle-font" ref={circleInstance3}>Where are you?</div>
            </div> */}
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
