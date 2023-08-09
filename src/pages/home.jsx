import React, { useState, useContext, useRef, useEffect } from "react";
import { Context } from "../store/appContext";
import { SimpleMap } from "../component/SimpleMap";
import { ResourceCard } from "../component/ResourceCard";
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
  const [place, setPlace] = useState();
  const [neLat, setNeLat] = useState(0);
  const [neLng, setNeLng] = useState(0);
  const [swLat, setSwLat] = useState(0);
  const [swLng, setSwLng] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [allKinds, setAllKinds] = useState(true);
  const [filterByBounds, setFilterByBounds] = useState(true);
  const [zipCode, setZipCode] = useState("")

  const circleInstance = useRef();
  const circleInstance2 = useRef();

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
    { id: "health", label: "Health", state: health, handler: setHealth },
    { id: "hygiene", label: "Shower", state: hygiene, handler: setHygiene },
    { id: "bathroom", label: "Bathroom", state: bathroom, handler: setBathroom },
    { id: "work", label: "Work", state: work, handler: setWork },
  ];

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
    let circle1, circle2;
    if (circleInstance.current) {
      circle1 = new CircleType(circleInstance.current).radius(500)
    };
    if (circleInstance2.current) {
      circle2 = new CircleType(circleInstance2.current).radius(500).dir(-1)
    }
    actions.setSearchResults();
    actions.setBoundaryResults();
    return () => {
      circle1 && circle1.destroy();
      circle2 && circle2.destroy()
    };
  }, [searchParams, dropdownOpen]);

  useEffect(() => {
    actions.setSearchResults();
    actions.setBoundaryResults();
  }, [filterByBounds]);

  useEffect(() => {
    if (place && place.bounds.ne.lat) {
      setNeLat(place.bounds.ne.lat);
      setNeLng(place.bounds.ne.lng);
      setSwLat(place.bounds.sw.lat);
      setSwLng(place.bounds.sw.lng);
      setSearchParams({
        food: food,
        shelter: shelter,
        health: health,
        hygiene: hygiene,
        work: work,
        monday: monday,
        tuesday: tuesday,
        wednesday: wednesday,
        thursday: thursday,
        friday: friday,
        saturday: saturday,
        sunday: sunday,
        neLat: place.bounds.ne.lat,
        neLng: place.bounds.ne.lng,
        swLat: place.bounds.sw.lat,
        swLng: place.bounds.sw.lng
      });
    }
  }, [monday, tuesday, wednesday, thursday, friday, saturday, sunday, food, health, hygiene, shelter, work, place, filterByBounds])

  function handleAllKinds(event) {
    const isChecked = event.target.checked;
    if (isChecked) {
      setFood(false);
      setShelter(false);
      setHealth(false);
      setHygiene(false);
      setWork(false);
      setBathroom(false)
    };
    setAllKinds(isChecked);
  }

  const handleFood = handleEvent(setFood, true);
  const handleShelter = handleEvent(setShelter, true);
  const handleHealth = handleEvent(setHealth, true);
  const handleHygiene = handleEvent(setHygiene, true);
  const handleWork = handleEvent(setWork, true);
  const handleBathroom = handleEvent(setBathroom, true);
  const handleMonday = handleEvent(setMonday);
  const handleTuesday = handleEvent(setTuesday);
  const handleWednesday = handleEvent(setWednesday);
  const handleThursday = handleEvent(setThursday);
  const handleFriday = handleEvent(setFriday);
  const handleSaturday = handleEvent(setSaturday);
  const handleSunday = handleEvent(setSunday);

  function handleAll() {
    setMonday(false);
    setTuesday(false);
    setWednesday(false);
    setThursday(false);
    setFriday(false);
    setSaturday(false);
    setSunday(false);
    setDropdownOpen(false);
  }

  function handleEvent(setter, isResourceType = false) {
    return function (event) {
      const element = event.target;
      setter(element.checked);
      if (isResourceType) {
        setAllKinds(false)
      };
    };
  }

  return (
    <div>
      <div className="grand-container">

        <div className="search-container">

          <div className="what-type">
            <div className="question">
              <div className="circle-font" ref={circleInstance}>WHAT DO YOU NEED?</div>
            </div>

            <div className="selection">
              {options.map((option) => (
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
                  All
                </label>
              </div>
            </div>
          </div>

          <div className="selection">
            <div className="my-dropdown">
              {!dropdownOpen &&
                <button className="my-schedule-button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <img className="left-arrow" src={arrow}></img>
                  Filter By Day
                  <img className="right-arrow" src={arrow}></img>
                </button>
              }
              {dropdownOpen &&
                <div className="what-type">
                  <div className="selection">
                    <div className="my-form-check">
                      <input
                        className="my-input2"
                        type="checkbox"
                        id="monday"
                        value="monday"
                        onChange={handleMonday}
                      />
                      <label className="my-label" htmlFor="monday">
                        Mon
                      </label>
                    </div>

                    <div className="my-form-check">
                      <input
                        className="my-input2"
                        type="checkbox"
                        id="tuesday"
                        value="tuesday"
                        onChange={handleTuesday}
                      />
                      <label className="my-label" htmlFor="tuesday">
                        Tue
                      </label>
                    </div>

                    <div className="my-form-check">
                      <input
                        className="my-input2"
                        type="checkbox"
                        id="wednesday"
                        value="wednesday"
                        onChange={handleWednesday}
                      />
                      <label className="my-label" htmlFor="wednesday">
                        Wed
                      </label>
                    </div>

                    <div className="my-form-check">
                      <input
                        className="my-input2"
                        type="checkbox"
                        id="thursday"
                        value="thursday"
                        onChange={handleThursday}
                      />
                      <label className="my-label" htmlFor="thursday">
                        Thr
                      </label>
                    </div>

                    <div className="my-form-check">
                      <input
                        className="my-input2"
                        type="checkbox"
                        id="friday"
                        value="friday"
                        onChange={handleFriday}
                      />
                      <label className="my-label" htmlFor="friday">
                        Fri
                      </label>
                    </div>

                    <div className="my-form-check">
                      <input
                        className="my-input2"
                        type="checkbox"
                        id="saturday"
                        value="saturday"
                        onChange={handleSaturday}
                      />
                      <label className="my-label" htmlFor="saturday">
                        Sat
                      </label>
                    </div>

                    <div className="my-form-check">
                      <input
                        className="my-input2"
                        type="checkbox"
                        id="sunday"
                        value="sunday"
                        onChange={handleSunday}
                      />
                      <label className="my-label" htmlFor="sunday">
                        Sun
                      </label>
                    </div>

                    <div className="my-form-check">
                      <input
                        className="my-input2"
                        type="checkbox"
                        id="all"
                        value="all"
                        onChange={handleAll}
                      />
                      <label className="my-label" htmlFor="all">
                        All
                      </label>
                    </div>
                  </div>
                  <div className="question">
                    <div className="circle-font" ref={circleInstance2}>WHEN DO YOU NEED IT?</div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
        <div className="search-results-full">
          <div className="scroll-search-results">
            <ul style={{ listStyleType: "none" }}>
              {filterByBounds
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
          <div className="map-and-cities">
            <SimpleMap
              ZipCode={zipCode}
              setZipCode={setZipCode}
              setPlace={setPlace}
              openModal={openModal}
              closeModal={closeModal}
              selectedResource={selectedResource}
              setFilterByBounds={setFilterByBounds}
              filterByBounds={filterByBounds}
            />
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
