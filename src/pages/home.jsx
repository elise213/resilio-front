import React, { useState, useContext, useRef, useEffect } from "react";
import { Context } from "../store/appContext";
// import { Link, useLocation } from "react-router-dom";
import { SimpleMap } from "../component/SimpleMap";
import { ResourceCard } from "../component/ResourceCard";
import { useSearchParams } from "react-router-dom";
import CircleType from "circletype";
import axios from 'axios';

const Home = () => {
  const { store, actions } = useContext(Context);
  const [searchParams, setSearchParams] = useSearchParams();
  const [food, setFood] = useState(false);
  const [shelter, setShelter] = useState(false);
  const [health, setHealth] = useState(false);
  const [hygiene, setHygiene] = useState(false);
  const [monday, setMonday] = useState(false);
  const [tuesday, setTuesday] = useState(false);
  const [wednesday, setWednesday] = useState(false);
  const [thursday, setThursday] = useState(false);
  const [friday, setFriday] = useState(false);
  const [saturday, setSaturday] = useState(false);
  const [sunday, setSunday] = useState(false);
  const [zipCode, setZipCode] = useState('');
  const [place, setPlace] = useState()
  const [neLat, setNeLat] = useState(0)
  const [neLng, setNeLng] = useState(0)
  const [swLat, setSwLat] = useState(0)
  const [swLng, setSwLng] = useState(0)
  let url = window.location.search;

  const circleInstance = useRef();

  useEffect(() => {
    new CircleType(circleInstance.current).radius(500);
    actions.setSearchResults();
  }, [searchParams]);

  useEffect(() => {
    if (place != undefined && place.bounds.ne.lat != undefined) {
      console.log("PLACE bounds", place.bounds)
      setNeLat(place.bounds.ne.lat)
      setNeLng(place.bounds.ne.lng)
      setSwLat(place.bounds.sw.lat)
      setSwLng(place.bounds.sw.lng)
      // console.log("NELAT", neLat)
    }
    setSearchParams({
      food: food,
      shelter: shelter,
      health: health,
      hygiene: hygiene,
      monday: monday,
      tuesday: tuesday,
      wednesday: wednesday,
      thursday: thursday,
      friday: friday,
      saturday: saturday,
      sunday: sunday,
      // mapIds: JSON.stringify(mapIds),
      neLat: neLat,
      neLng: neLng,
      swLat: swLat,
      swLng: swLng
    });
    actions.setSearchResults();
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
    place
    // searchParams,
  ]);

  function handleFood(event) {
    const element = event.target;
    if (element.checked) {
      setFood(true);
    }
    if (!element.checked) {
      setFood(false);
    }
  }
  function handleShelter(event) {
    const element = event.target;
    if (element.checked) {
      setShelter(true);
    }
    if (!element.checked) {
      setShelter(false);
    }
  }
  function handleHealth(event) {
    const element = event.target;
    if (element.checked) {
      setHealth(true);
    }
    if (!element.checked) {
      setHealth(false);
    }
  }
  function handleHygiene(event) {
    const element = event.target;
    if (element.checked) {
      setHygiene(true);
    }
    if (!element.checked) {
      setHygiene(false);
    }
  }
  function handleWork(event) {
    const element = event.target;
    if (element.checked) {
      setWork(true);
    }
    if (!element.checked) {
      setWork(false);
    }
  }
  function handleMonday(event) {
    const element = event.target;
    if (element.checked) {
      setMonday(true);
    }
    if (!element.checked) {
      setMonday(false);
    }
  }
  function handleTuesday(event) {
    const element = event.target;
    if (element.checked) {
      setTuesday(true);
    }
    if (!element.checked) {
      setTuesday(false);
    }
  }
  function handleWednesday(event) {
    const element = event.target;
    if (element.checked) {
      setWednesday(true);
    }
    if (!element.checked) {
      setWednesday(false);
    }
  }
  function handleThursday(event) {
    const element = event.target;
    if (element.checked) {
      setThursday(true);
    }
    if (!element.checked) {
      setThursday(false);
    }
  }
  function handleFriday(event) {
    const element = event.target;
    if (element.checked) {
      setFriday(true);
    }
    if (!element.checked) {
      setFriday(false);
    }
  }
  function handleSaturday(event) {
    const element = event.target;
    if (element.checked) {
      setSaturday(true);
    }
    if (!element.checked) {
      setSaturday(false);
    }
  }
  function handleSunday(event) {
    const element = event.target;
    if (element.checked) {
      setSunday(true);
    }
    if (!element.checked) {
      setSunday(false);
    }
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
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="food"
                  value="food"
                  name="selection"
                  onChange={handleFood}
                />
                <label className="form-check-label" htmlFor="food">
                  Food
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="shelter"
                  value="shelter"
                  name="selection"
                  onChange={handleShelter}
                />
                <label className="form-check-label" htmlFor="shelter">
                  Shelter
                </label>
              </div>
              <div className="form-check ">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="health"
                  value="health"
                  name="selection"
                  onChange={handleHealth}
                />
                <label className="form-check-label" htmlFor="health">
                  Healthcare
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="hygiene"
                  value="hygiene"
                  name="selection"
                  onChange={handleHygiene}
                />
                <label className="form-check-label" htmlFor="hygiene">
                  Shower
                </label>
              </div>
              <div className="form-check ">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="hygiene"
                  value="hygiene"
                  name="selection"
                  onChange={handleHygiene}
                />
                <label className="form-check-label" htmlFor="hygiene">
                  Bathroom
                </label>
              </div>
              <div className="form-check  ">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="hygiene"
                  value="hygiene"
                  name="selection"
                  onChange={handleWork}
                />
                <label className="form-check-label" htmlFor="hygiene">
                  Work
                </label>
              </div>
            </div>
            {/* Filter by day */}
            <div className="dropdown-div">
              <div className="dropdown">
                <button className="btn dropdown-toggle form-check-label schedule" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                  SCHEDULE
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  <li>
                    <div className="form-check form-check-inline ">
                      <label className="form-check-label" htmlFor="monday">
                        Monday
                      </label>
                      <input
                        className="form-check-input dropdown-item"
                        type="checkbox"
                        id="monday"
                        value="monday"
                        onChange={handleMonday}
                      />
                    </div>
                  </li>
                  <li>
                    <div className="form-check form-check-inline ">
                      <label className="form-check-label" htmlFor="tuesday">
                        Tuesday
                      </label>
                      <input
                        className="form-check-input dropdown-item"
                        type="checkbox"
                        id="tuesday"
                        value="tuesday"
                        onChange={handleTuesday}
                      />
                    </div>
                  </li>
                  <li>
                    <div className="form-check form-check-inline ">
                      <label className="form-check-label" htmlFor="wednesday">
                        Wednesday
                      </label>
                      <input
                        className="form-check-input dropdown-item"
                        type="checkbox"
                        id="wednesday"
                        value="wednesday"
                        onChange={handleWednesday}
                      />
                    </div>
                  </li>
                  <li>
                    <div className="form-check form-check-inline ">
                      <label className="form-check-label" htmlFor="thursday">
                        Thursday
                      </label>
                      <input
                        className="form-check-input dropdown-item"
                        type="checkbox"
                        id="thursday"
                        value="thursday"
                        onChange={handleThursday}
                      />
                    </div>
                  </li>
                  <li>
                    <div className="form-check form-check-inline ">
                      <label className="form-check-label" htmlFor="friday">
                        Friday
                      </label>
                      <input
                        className="form-check-input dropdown-item"
                        type="checkbox"
                        id="friday"
                        value="friday"
                        onChange={handleFriday}
                      />
                    </div>
                  </li>
                  <li>
                    <div className="form-check form-check-inline ">
                      <label className="form-check-label" htmlFor="saturday">
                        Saturday
                      </label>
                      <input
                        className="form-check-input dropdown-item"
                        type="checkbox"
                        id="saturday"
                        value="saturday"
                        onChange={handleSaturday}
                      />
                    </div>
                  </li>
                  <li>
                    <div className="form-check form-check-inline ">
                      <label className="form-check-label" htmlFor="sunday">
                        Sunday
                      </label>
                      <input
                        className="form-check-input dropdown-item"
                        type="checkbox"
                        id="sunday"
                        value="sunday"
                        onChange={handleSunday}
                      />
                    </div>
                  </li>
                </ul>
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
                    <ResourceCard item={result} />
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Search Results Map */}
          <div className="map-and-cities mx-auto">
            <SimpleMap
              // ZipCode={zipCode} 
              setPlace={setPlace} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
