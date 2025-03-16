import React, { useState, useContext, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import Swal from "sweetalert2";
import styles from "../styles/edit.css";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

const Edit = () => {
  const { id } = useParams();
  const apiKey = import.meta.env.VITE_GOOGLE;
  const [isGoogleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

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
    alert: "",
    latitude: null,
    longitude: null,
    image: "",
    image2: "",
    days: initialDaysState,
    updated: "",
    user_ids: [1, 2, 3],
  };
  const [formData, setFormData] = useState(initialFormData || {});
  const CATEGORY_OPTIONS = store.CATEGORY_OPTIONS || [];
  const categories = CATEGORY_OPTIONS;
  const [unrecognizedCategories, setUnrecognizedCategories] = useState([]);

  console.log("USER ID", store.user_id);

  useEffect(() => {
    const fetchResourceData = async () => {
      try {
        const resourceData = await actions.getResource(id);
        const assignedUsers = await actions.getResourceUsers(id); // Fetch only assigned users

        setFormData((prevData) => ({
          ...initialFormData,
          ...resourceData,
          category: resourceData.category
            ? resourceData.category.split(", ")
            : [],
          user_ids: resourceData.user_ids || [], // Store assigned user IDs
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchResourceData();
  }, [actions, id]);

  const handleAddUserId = () => {
    const newUserId = parseInt(formData.newUserId);

    if (!newUserId || formData.user_ids.includes(newUserId)) return; // Prevent invalid or duplicate entries

    setFormData((prev) => ({
      ...prev,
      user_ids: [...prev.user_ids, newUserId], // Add new ID
      newUserId: "", // Clear input field
    }));
  };

  useEffect(() => {
    if (formData.address) {
      handleSelect(formData.address);
    }
  }, [formData.address]);

  const handleSelect = async (address) => {
    handleChange("address", address);
    try {
      const results = await geocodeByAddress(address);
      const latLng = await getLatLng(results[0]);
      handleChange("latitude", latLng.lat || null);
      handleChange("longitude", latLng.lng || null);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this resource? This action cannot be undone."
    );
    if (confirm) {
      await actions.deleteResource(id, navigate);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const modifiedFormData = {
      ...formData,
      category: formData.category.join(", "), // Convert array to string
      user_ids: formData.user_ids || [], // Ensure user_ids are sent
      latitude: formData.latitude ?? null, // Ensure null values
      longitude: formData.longitude ?? null,
    };

    try {
      await actions.editResource(id, modifiedFormData, navigate);

      Swal.fire({
        icon: "success",
        title: "Resource Updated",
        text: "The resource has been successfully updated!",
        confirmButtonText: "OK",
      }).then(() => {
        resetForm();
        navigate("/"); // Redirect only after user clicks "OK"
      });
    } catch (error) {
      console.error("Error updating the resource:", error);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "An error occurred while updating the resource. Please try again.",
      });
    }
  };

  const handleChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleCategoryChange = (value) => {
    setFormData((prevData) => {
      if (prevData && prevData.category) {
        const hasCategory = prevData.category.includes(value);
        return {
          ...prevData,
          category: hasCategory
            ? prevData.category.filter((category) => category !== value)
            : [...prevData.category, value],
        };
      } else {
        return {
          ...prevData,
          category: [value],
        };
      }
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

  if (!formData) {
    return <div>Loading...</div>;
  }

  useEffect(() => {
    if (
      !document.querySelector(
        'script[src="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY&libraries=places"]'
      )
    ) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      script.onload = () => setGoogleMapsLoaded(true);
    }
    return () => {
      const script = document.querySelector(
        'script[src="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY&libraries=places"]'
      );
      if (script) document.head.removeChild(script);
    };
  }, [apiKey]);

  const handleAddressChange = actions.debounce(async (address) => {
    handleChange("address", address);
    try {
      const results = await geocodeByAddress(address);
      const latLng = await getLatLng(results[0]);
      handleChange("latitude", latLng.lat || null);
      handleChange("longitude", latLng.lng || null);
    } catch (error) {
      console.error("Error:", error);
    }
  }, 600); // Adjust the delay as necessary

  const formatTime = (time) => {
    if (time) {
      const [hour, minute] = time.split(":");
      return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
    }
    return "";
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
            value={formData.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Resource Name"
          />
        </div>
        <div className="input-group">
          <label>Assign Users (Enter User ID)</label>
          <input
            type="number"
            placeholder="Enter User ID"
            value={formData.newUserId || ""}
            onChange={(e) => handleChange("newUserId", e.target.value)}
          />
          <button type="button" onClick={handleAddUserId}>
            Add User ID
          </button>
        </div>

        <div className="assigned-users">
          <p>Assigned Users:</p>
          <ul>
            {formData.user_ids.map((userId) => (
              <li key={userId}>
                {userId}{" "}
                <button
                  type="button"
                  onClick={() => handleRemoveUserId(userId)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="input-group">
          <label htmlFor="address">Address</label>

          {isGoogleMapsLoaded && (
            <PlacesAutocomplete
              value={formData.address}
              onChange={handleAddressChange}
            >
              {({
                getInputProps,
                suggestions,
                getSuggestionItemProps,
                loading,
              }) => (
                <div>
                  <input
                    className="geo-input"
                    {...getInputProps({ placeholder: "Type address" })}
                  />
                  <div>
                    {loading && <div>Loading...</div>}
                    {suggestions.map((suggestion) => (
                      <div
                        {...getSuggestionItemProps(suggestion)}
                        key={suggestion.placeId}
                      >
                        {suggestion.description}
                      </div>
                    ))}
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
            value={formData.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
          ></textarea>
        </div>
        <div className="input-group">
          <label htmlFor="website">Website</label>
          <input
            className="geo-input"
            id="website"
            name="website"
            type="text"
            value={formData.website || ""}
            onChange={(e) => handleChange("website", e.target.value)}
            placeholder="Resource Website URL"
          />
        </div>
        {/* Alert field */}
        <div className="input-group">
          <label htmlFor="alert">Alert</label>
          <textarea
            className="geo-input"
            id="alert"
            rows="2"
            value={formData.alert || ""}
            onChange={(e) => handleChange("alert", e.target.value)}
            placeholder="Alert message for this resource"
          ></textarea>
        </div>

        <div className="input-group">
          <label htmlFor="image">image 1</label>
          <input
            className="geo-input"
            id="image"
            name="image"
            type="text"
            value={formData.image || ""}
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
            value={formData.image2 || ""}
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
                value={resource.value || ""}
                checked={!!formData?.category?.includes(resource.value)}
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
              value={formatTime(formData.days[day]?.start) || ""}
              onChange={(e) => handleTimeChange(day, "start", e.target.value)}
            />
            <span> until </span>
            <input
              className="geo-input time-input"
              type="time"
              id={`${day}End`}
              name={`${day}End`}
              value={formatTime(formData.days[day]?.end) || ""}
              onChange={(e) => handleTimeChange(day, "end", e.target.value)}
            />
          </div>
        ))}
        <div className="input-group">
          <label htmlFor="updated">Last Updated Date</label>
          <input
            className="geo-input"
            id="updated"
            name="updated"
            type="date"
            value={formData.updated ? formData.updated.split("T")[0] : ""}
            onChange={(e) => {
              const selectedDate = e.target.value;
              handleChange("updated", selectedDate || "");
            }}
          />
        </div>
        <button className="update-button" type="submit">
          Update
        </button>
      </form>
      {[1, 3, 4, 8].includes(store.user_id) && (
        <button className="delete-button" onClick={handleDelete}>
          Permanently Delete This Resource
        </button>
      )}
    </div>
  );
};

export default Edit;
