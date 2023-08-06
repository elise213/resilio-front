import React, { useState, useContext, useRef, useEffect } from "react";
import { Context } from "../store/appContext";
// import { Link, useLocation } from "react-router-dom";
import { SimpleMap } from "../component/SimpleMap";
import { ResourceCard } from "../component/ResourceCard";
import { useSearchParams } from "react-router-dom";
import CircleType from "circletype";
import axios from 'axios';
import Modal from "../component/Modal"
import arrow from "/assets/coralarrow.png";

const Home = () => {
  const { store, actions } = useContext(Context);
  const [searchParams, setSearchParams] = useSearchParams();
  const [food, setFood] = useState(false);
  const [shelter, setShelter] = useState(false);
  const [health, setHealth] = useState(false);
  const [hygiene, setHygiene] = useState(false);
  const [work, setWork] = useState(false);
  const [monday, setMonday] = useState(false);
  const [tuesday, setTuesday] = useState(false);
  const [wednesday, setWednesday] = useState(false);
  const [thursday, setThursday] = useState(false);
  const [friday, setFriday] = useState(false);
  const [saturday, setSaturday] = useState(false);
  const [sunday, setSunday] = useState(false);
  // const [zipCode, setZipCode] = useState('');
  const [place, setPlace] = useState()
  const [neLat, setNeLat] = useState(0)
  const [neLng, setNeLng] = useState(0)
  const [swLat, setSwLat] = useState(0)
  const [swLng, setSwLng] = useState(0)
  const [dropdownOpen, setDropdownOpen] = useState(false);

  let url = window.location.search;

  const circleInstance = useRef();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  const openModal = (resource) => {
    setSelectedResource(resource);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedResource(null);
    setModalIsOpen(false);
    console.log("CLOSE MODAL")
  };

  useEffect(() => {
    new CircleType(circleInstance.current).radius(500);
    actions.setSearchResults();
  }, [searchParams]);

  useEffect(() => {
    if (place != undefined && place.bounds.ne.lat != undefined) {
      // console.log("PLACE bounds", place.bounds)
      setNeLat(place.bounds.ne.lat)
      setNeLng(place.bounds.ne.lng)
      setSwLat(place.bounds.sw.lat)
      setSwLng(place.bounds.sw.lng)
    }
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
      neLat: neLat,
      neLng: neLng,
      swLat: swLat,
      swLng: swLng
    });
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
    place
  ]);

  function handleEvent(setter) {
    return function (event) {
      const element = event.target;
      setter(element.checked);
    };
  }
  const handleFood = handleEvent(setFood);
  const handleShelter = handleEvent(setShelter);
  const handleHealth = handleEvent(setHealth);
  const handleHygiene = handleEvent(setHygiene);
  const handleWork = handleEvent(setWork);
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

  return (
    <div>
      <div className="grand-container">
        {/* <div className="alert alert-danger ps-5 w-100" role="alert">
          The information in our current database is only in Los Angeles, and is only for testing purposes.
        </div> */}
        <div className="search-container">
          {/* <!-- What type of resource--> */}
          <div className="what-type">
            <div className="question">
              <div className="my-2 circle-font" ref={circleInstance}>WHAT DO YOU NEED?</div>
            </div>
            <div className="selection">
              <div className="my-form-check">
                <input
                  className="my-input"
                  type="checkbox"
                  id="food"
                  value="food"
                  name="selection"
                  onChange={handleFood}
                />
                <label className="my-label" htmlFor="food">
                  Food
                </label>
              </div>
              <div className="my-form-check">
                <input
                  className="my-input"
                  type="checkbox"
                  id="shelter"
                  value="shelter"
                  name="selection"
                  onChange={handleShelter}
                />
                <label className="my-label" htmlFor="shelter">
                  Shelter
                </label>
              </div>
              <div className="my-form-check">
                <input
                  className="my-input"
                  type="checkbox"
                  id="health"
                  value="health"
                  name="selection"
                  onChange={handleHealth}
                />
                <label className="my-label" htmlFor="health">
                  Healthcare
                </label>
              </div>
              <div className="my-form-check">
                <input
                  className="my-input"
                  type="checkbox"
                  id="hygiene"
                  value="hygiene"
                  name="selection"
                  onChange={handleHygiene}
                />
                <label className="my-label" htmlFor="hygiene">
                  Shower
                </label>
              </div>
              <div className="my-form-check">
                <input
                  className="my-input"
                  type="checkbox"
                  id="hygiene"
                  value="hygiene"
                  name="selection"
                  onChange={handleHygiene}
                />
                <label className="my-label" htmlFor="hygiene">
                  Bathroom
                </label>
              </div>
              <div className="my-form-check">
                <input
                  className="my-input"
                  type="checkbox"
                  id="work"
                  value="work"
                  name="selection"
                  onChange={handleWork}
                />
                <label className="my-label" htmlFor="work">
                  Work
                </label>
              </div>
            </div>

            {/* Filter by day */}
            <div className="selection">
              <div className="my-dropdown">
                {!dropdownOpen &&
                  <button className="my-schedule-button"
                    // type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}>

                    <img className="left-arrow" src={arrow}></img>

                    Filter By Day

                    <img className="right-arrow" src={arrow}></img>
                  </button>
                }
                <hr />
                {dropdownOpen &&
                  <div className="my-dropdown-menu">
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
                        Tues
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
                        Thurs
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
                        className="my-input"
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
                }
              </div>
            </div>
          </div>

          {/* <button className="maras-button" 
          // onClick={geoFindMe()}
          >
            Use my location
          </button> */}
          {/* <div>
            <form>
              <label htmlFor="zip-code">Please enter your zip-code</label>
              <input
                id="zip-code"
                className="zip-code mt-4"
                type="text"
                pattern="[0-9]*"
                inputMode="numeric"
                value={zipCode}
                onChange={handleZip}
                maxLength={5}
              ></input>
            </form>
          </div> */}

        </div>

        <div className="search-results-full">
          <div className="scroll-search-results">
            <ul style={{ listStyleType: "none" }}>
              {store.searchResults.map((result, i) => {
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
              })}
            </ul>
          </div>

          {/* Search Results Map */}
          <div className="map-and-cities">
            <SimpleMap
              // ZipCode={zipCode} 
              setPlace={setPlace}
              openModal={openModal}
              closeModal={closeModal}
              selectedResource={selectedResource}
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
