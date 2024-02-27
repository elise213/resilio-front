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
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (!document.getElementById("google-maps")) {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.id = "google-maps";
        script.onload = () => setGoogleMapsLoaded(true);
        document.body.appendChild(script);
      } else {
        setGoogleMapsLoaded(true);
      }
    };
    loadGoogleMapsScript();
  }, []);
  const navigate = useNavigate();
  const { store, actions } = useContext(Context);
  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  // const daysOfWeek = store.DAY_OPTIONS.map(option => option.id);
  const initialDaysState = daysOfWeek.reduce((acc, day) => {
    acc[day] = { start: "", end: "" };
    return acc;
  }, {});

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (!document.getElementById("google-maps")) {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.id = "google-maps";
        document.body.appendChild(script);
      }
    };

    loadGoogleMapsScript();
  }, []);

  // const categories = store.CATEGORY_OPTIONS;
  const categories = [
    { id: "F", value: "food", label: "Food" },
    { id: "Sh", value: "shelter", label: "Shelter" },
    { id: "H", value: "health", label: "Health" },
    { id: "Hy", value: "hygiene", label: "Hygiene" },
    { id: "Wi", value: "wifi", label: "WiFi" },
    { id: "C", value: "crisis", label: "Crisis Support" },
    { id: "Su", value: "substance", label: "Substance Support" },
    { id: "B", value: "bathroom", label: "Bathroom" },
    { id: "Le", value: "legal", label: "Legal Services" },
    { id: "Sex", value: "sex", label: "Sexual Health" },
    { id: "Me", value: "mental", label: "Mental Health" },
    { id: "Wo", value: "women", label: "Women" },
    { id: "Y", value: "youth", label: "Youth" },
    { id: "Sn", value: "seniors", label: "Seniors" },
    { id: "Lg", value: "lgbtq", label: "LGBTQ" },
  ];
  const initialFormData = {
    name: "",
    address: "",
    phone: "",
    category: [],
    website: "",
    description: "",
    latitude: "",
    longitude: "",
    image: "",
    image2: "",
    days: initialDaysState,
  };
  const [formData, setFormData] = useState(initialFormData);

  // const handleSelect = async (address) => {
  //   handleChange("address", address);
  //   try {
  //     const results = await geocodeByAddress(address);
  //     const latLng = await getLatLng(results[0]);
  //     handleChange("latitude", latLng.lat.toString());
  //     handleChange("longitude", latLng.lng.toString());
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

  const handleSelect = async (address) => {
    handleChange("address", address);
    try {
      const results = await geocodeByAddress(address);
      const latLng = await getLatLng(results[0]);
      handleChange("latitude", latLng.lat);
      handleChange("longitude", latLng.lng);
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
          <label htmlFor="image">image 1</label>
          <input
            className="geo-input"
            id="image"
            name="image"
            type="text"
            value={formData.image}
            onChange={(e) => handleChange("image", e.target.value)}
            placeholder="URL for image 1"
          />
        </div>

        <div className="input-group">
          <label htmlFor="image2">image 2</label>
          <input
            className="geo-input"
            id="image2"
            name="image2"
            type="text"
            value={formData.image2}
            onChange={(e) => handleChange("image2", e.target.value)}
            placeholder="URL for image 2"
          />
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

        {/* <div className="input-group">
          <label htmlFor="latitude">Latitude</label>
          <input
            className="geo-input"
            id="latitude"
            name="latitude"
            type="number"
            value={formData.latitude}
            onChange={(e) =>
              handleChange("latitude", parseFloat(e.target.value))
            } // Added parseFloat
            title="Provide the latitude"
          />
        </div>

        <div className="input-group">
          <label htmlFor="longitude">Longitude</label>
          <input
            className="geo-input"
            id="longitude"
            name="longitude"
            type="number"
            value={formData.longitude}
            onChange={(e) =>
              handleChange("longitude", parseFloat(e.target.value))
            } 
            title="Provide the longitude"
          />
        </div> */}

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
