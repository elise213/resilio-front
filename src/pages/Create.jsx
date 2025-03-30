import React, { useState, useContext, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import Button from "@mui/material/Button";
import Swal from "sweetalert2";
import { useGoogleMapsLoader } from "../hooks/googleMapsLoader";

const initializeDaysState = (daysOfWeek) => {
  return daysOfWeek.reduce((acc, day) => {
    acc[day] = { start: "", end: "" };
    return acc;
  }, {});
};

const Create = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const mapsLoaded = useGoogleMapsLoader();
  const autocompleteRef = useRef(null);

  const daysOfWeek = useMemo(() => store.daysOfWeek || [], [store.daysOfWeek]);

  const [formData, setFormData] = useState(() => ({
    name: "",
    address: "",
    phone: "",
    category: [],
    website: "",
    description: "",
    latitude: null,
    longitude: null,
    image: "",
    image2: "",
    days: initializeDaysState(daysOfWeek),
  }));

  const categories = store.CATEGORY_OPTIONS || [];

  useEffect(() => {
    if (!mapsLoaded || !autocompleteRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      autocompleteRef.current,
      {
        componentRestrictions: { country: ["us"] },
        fields: ["geometry", "formatted_address"],
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;

      setFormData((prev) => ({
        ...prev,
        address: place.formatted_address,
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
      }));
    });
  }, [mapsLoaded]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.latitude || !formData.longitude) {
      Swal.fire({
        icon: "error",
        title: "Missing Address",
        text: "Please select a valid address from the autocomplete suggestions.",
      });
      return;
    }

    const modifiedFormData = {
      ...formData,
      category: formData.category.join(", "),
    };

    try {
      await actions.createResource(modifiedFormData, navigate);
      resetForm();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to create resource. Please try again.",
      });
    }
  };

  const handleChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleCategoryChange = (value) => {
    setFormData((prevData) => {
      const hasCategory = prevData.category.includes(value);
      return {
        ...prevData,
        category: hasCategory
          ? prevData.category.filter((category) => category !== value)
          : [...prevData.category, value],
      };
    });
  };

  const handleTimeChange = (day, timeType, value) => {
    setFormData((prevData) => ({
      ...prevData,
      days: {
        ...prevData.days,
        [day]: {
          ...prevData.days[day],
          [timeType]: value,
        },
      },
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      phone: "",
      category: [],
      website: "",
      description: "",
      latitude: null,
      longitude: null,
      image: "",
      image2: "",
      days: initializeDaysState(daysOfWeek),
    });
  };

  if (!mapsLoaded) return <div>Loading...</div>;

  return (
    <div className="form-container">
      <form className="geo-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="name">Name</label>
          <input
            className="geo-input"
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Resource Name"
          />
        </div>

        <div className="input-group">
          <label htmlFor="address">Address</label>
          <input
            ref={autocompleteRef}
            className="geo-input"
            id="address"
            name="address"
            type="text"
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Resource Address"
          />
        </div>

        <div className="input-group">
          <label htmlFor="description">Description</label>
          <textarea
            className="geo-input"
            id="description"
            rows="3"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
          ></textarea>
        </div>

        <div className="input-group">
          {categories.map((resource) => (
            <div key={resource.id} className="checkbox-group">
              <input
                type="checkbox"
                name="category"
                id={`resource${resource.id}`}
                value={resource.value}
                checked={formData.category.includes(resource.value)}
                onChange={() => handleCategoryChange(resource.value)}
              />
              <label htmlFor={`resource${resource.id}`}>{resource.label}</label>
            </div>
          ))}
        </div>

        {daysOfWeek.map((day) => (
          <div key={day} className="input-group time-group">
            <label htmlFor={`${day}Start`}>
              {day.charAt(0).toUpperCase() + day.slice(1)} from
            </label>
            <input
              className="geo-input time-input"
              type="time"
              id={`${day}Start`}
              name={`${day}Start`}
              value={formData.days[day].start}
              onChange={(e) => handleTimeChange(day, "start", e.target.value)}
            />
            <span> until </span>
            <input
              className="geo-input time-input"
              type="time"
              id={`${day}End`}
              name={`${day}End`}
              value={formData.days[day].end}
              onChange={(e) => handleTimeChange(day, "end", e.target.value)}
            />
          </div>
        ))}

        <Button
          variant="contained"
          color="primary"
          className="submit"
          type="submit"
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default Create;
