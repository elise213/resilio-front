import React, { useState, useContext, useRef, useEffect } from "react";
import { Context } from "../store/appContext";
import { useSearchParams } from "react-router-dom";

const DaySelection = ({ filterByBounds, boundsData, setDropdownOpen, setMonday, setTuesday, setWednesday, setThursday, setFriday, setSaturday, setSunday }) => {
  const { store, actions } = useContext(Context);

  const handleMonday = handleEvent(setMonday);
  const handleTuesday = handleEvent(setTuesday);
  const handleWednesday = handleEvent(setWednesday);
  const handleThursday = handleEvent(setThursday);
  const handleFriday = handleEvent(setFriday);
  const handleSaturday = handleEvent(setSaturday);
  const handleSunday = handleEvent(setSunday);

  function handleEvent(setter, isResourceType = false) {
    return function (event) {
      const element = event.target;
      setter(element.checked);
      if (isResourceType) {
        setAllKinds(false)
      };
    };
  }

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
            Any Day
          </label>
        </div>
      </div>

    </div>
  )
}

export default DaySelection
