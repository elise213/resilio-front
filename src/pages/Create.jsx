import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import Button from "@mui/material/Button";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

const Create = () => {
  const apiKey = import.meta.env.VITE_GOOGLE;
  const [isGoogleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const navigate = useNavigate();
  const { store, actions } = useContext(Context);
  const daysOfWeek = store.daysOfWeek;
  const initialDaysState = daysOfWeek.reduce((acc, day) => {
    acc[day] = { start: "", end: "" };
    return acc;
  }, {});

  const initialFormData = {
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
    days: initialDaysState,
  };
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    const scriptId = "google-maps-script";
    console.log("loading google maps");
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.id = scriptId;
      script.async = true;
      script.defer = true;
      script.onload = () => setGoogleMapsLoaded(true);
      document.body.appendChild(script);
    } else {
      setGoogleMapsLoaded(true);
    }

    return () => {
      const script = document.getElementById(scriptId);
      if (script) {
        script.remove();
      }
    };
  }, [apiKey]);

  const categories = store.CATEGORY_OPTIONS;

  // const handleSelect = actions.debounce(async (address) => {
  //   if (address !== formData.address) {
  //     handleChange("address", address);
  //     try {
  //       const results = await geocodeByAddress(address);
  //       const latLng = await getLatLng(results[0]);
  //       handleChange("latitude", latLng.lat);
  //       handleChange("longitude", latLng.lng);
  //     } catch (error) {
  //       console.error("Error:", error);
  //     }
  //   }
  // }, 500);

  const handleSelect = actions.debounce(async (address) => {
    if (address !== formData.address) {
      handleChange("address", address);
      try {
        const results = await geocodeByAddress(address);
        const latLng = await getLatLng(results[0]);

        // Ensure latitude & longitude are numbers before setting them
        handleChange("latitude", latLng.lat || null);
        handleChange("longitude", latLng.lng || null);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  }, 500);

  function handleSubmit(e) {
    e.preventDefault();
    const modifiedFormData = {
      ...formData,
      category: formData.category.join(", "),
    };
    actions.createResource(modifiedFormData, navigate);
    resetForm();
    navigate("/");
  }

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
    setFormData(initialFormData);
  };
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
          {isGoogleMapsLoaded && (
            <PlacesAutocomplete
              value={formData.address}
              onChange={(address) => handleChange("address", address)}
              onSelect={handleSelect}
            >
              {({
                getInputProps,
                suggestions,
                getSuggestionItemProps,
                loading,
              }) => (
                <div>
                  <input
                    {...getInputProps({
                      className: "geo-input",
                      id: "address",
                      placeholder: "Resource Address",
                    })}
                  />
                  <div>
                    {loading ? <div>Loading...</div> : null}
                    {suggestions.map((suggestion) => {
                      console.log("SUGGESTIONS", suggestions);
                      const className = suggestion.active
                        ? "suggestion-item--active"
                        : "suggestion-item";
                      return (
                        <div
                          {...getSuggestionItemProps(suggestion, {
                            className,
                          })}
                        >
                          {suggestion.description}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </PlacesAutocomplete>
          )}
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
              {day.charAt(0).toUpperCase() + day.slice(1)} from{" "}
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
