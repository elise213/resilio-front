import React, { useState, useContext, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import styles from "../styles/edit.css";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

const Edit = () => {
  const { id } = useParams();
  const apiKey = import.meta.env.VITE_GOOGLE;
  const [isGoogleMapsLoaded, setGoogleMapsLoaded] = useState(false);
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
    latitude: null,
    longitude: null,
    image: "",
    image2: "",
    days: initialDaysState,
  };
  const [formData, setFormData] = useState(initialFormData || {});

  const CATEGORY_OPTIONS = store.CATEGORY_OPTIONS || [];
  const GROUP_OPTIONS = store.GROUP_OPTIONS || [];

  const COMBINED_OPTIONS = useMemo(
    () => [...CATEGORY_OPTIONS, ...GROUP_OPTIONS],
    [CATEGORY_OPTIONS, GROUP_OPTIONS]
  );

  const categories = COMBINED_OPTIONS;

  const [unrecognizedCategories, setUnrecognizedCategories] = useState([]);

  useEffect(() => {
    const fetchResourceData = async () => {
      try {
        const data = await actions.getResource(id);
        if (data) {
          // Assuming data.category is a string of category values separated by commas
          const initialCategories = data.category
            ? data.category.split(", ")
            : [];
          const knownCategoryValues = new Set(
            COMBINED_OPTIONS.map((option) => option.value)
          );

          // Initialize an array for unrecognized categories
          const _unrecognizedCategories = initialCategories
            .filter((category) => !knownCategoryValues.has(category))
            .map((category) => ({ category, keep: null })); // null indicates no decision made yet

          setUnrecognizedCategories(_unrecognizedCategories);

          // Proceed to set recognized categories and other form data
          const recognizedCategories = initialCategories.filter((category) =>
            knownCategoryValues.has(category)
          );
          setFormData((prevData) => ({
            ...initialFormData,
            ...data,
            category: recognizedCategories,
          }));
        } else {
          console.error("Data is null");
        }
      } catch (error) {
        console.error("Error fetching the resource data:", error);
      }
    };
    fetchResourceData();
  }, [actions, id, COMBINED_OPTIONS]);

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

  const handleUnrecognizedCategoryChange = (index, value) => {
    setUnrecognizedCategories((current) =>
      current.map((item, i) =>
        i === index ? { ...item, keep: value === "keep" } : item
      )
    );
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

    let categoryArray;
    if (Array.isArray(formData.category)) {
      categoryArray = formData.category;
    } else if (typeof formData.category === "string") {
      categoryArray = [formData.category];
    } else {
      console.error(
        "formData.category is neither an array nor a string:",
        formData.category
      );
      return;
    }

    const categoryString = categoryArray.join(", ");

    const modifiedFormData = {
      ...formData,
      category: categoryString,
      days: Object.fromEntries(
        Object.entries(formData.days).map(([day, times]) => [
          day,
          {
            start: formatTime(times.start),
            end: formatTime(times.end),
          },
        ])
      ),
    };
    console.log("Submitting with id: ", id);
    try {
      await actions.editResource(id, modifiedFormData, navigate);
      resetForm();
      navigate("/");
    } catch (error) {
      console.error("Error updating the resource:", error);
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

  // console.log("form data", formData);
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
          <label htmlFor="address">Address</label>

          {isGoogleMapsLoaded && (
            // <PlacesAutocomplete
            //   value={formData.address || ""}
            //   // onChange={(address) => handleChange("address", address)}
            //   onChange={handleAddressChange}
            //   onSelect={handleSelect}
            // >
            //   {({
            //     getInputProps,
            //     suggestions,
            //     getSuggestionItemProps,
            //     loading,
            //   }) => (
            //     <div>
            //       <input
            //         {...getInputProps({
            //           className: "geo-input",
            //           id: "address",
            //           placeholder: "Resource Address",
            //         })}
            //       />
            //       <div>
            //         {loading ? <div>Loading...</div> : null}
            //         {suggestions.map((suggestion, index) => {
            //           const className = suggestion.active
            //             ? "suggestion-item--active"
            //             : "suggestion-item";
            //           return (
            //             <div
            //               {...getSuggestionItemProps(suggestion, {
            //                 className,
            //               })}
            //               key={index}
            //             >
            //               {suggestion.description}
            //             </div>
            //           );
            //         })}
            //       </div>
            //     </div>
            //   )}
            // </PlacesAutocomplete>
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
                  <input {...getInputProps({ placeholder: "Type address" })} />
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
          {unrecognizedCategories.map((item, index) => (
            <div key={index}>
              <div>{`Unrecognized Category: ${item.category}`}</div>
              <div
                onChange={(e) =>
                  handleUnrecognizedCategoryChange(index, e.target.value)
                }
              >
                <input type="radio" value="keep" name={item.category} /> Keep
                <input type="radio" value="delete" name={item.category} />{" "}
                Delete
              </div>
            </div>
          ))}
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

        <button className="geo-button" type="submit">
          Update
        </button>
      </form>

      <button className="delete-button" onClick={handleDelete}>
        Permanently Delete This Resource
      </button>
    </div>
  );
};

export default Edit;
