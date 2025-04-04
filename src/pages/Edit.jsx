import React, { useState, useContext, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import Swal from "sweetalert2";
import styles from "../styles/edit.css";
import SmartPlacesAutocomplete from "../component/SmartPlacesAutocomplete";
import { Link } from "react-router-dom";

const Edit = () => {
  const { store, actions } = useContext(Context);
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignedUsers, setAssignedUsers] = useState([]);

  console.log("👤 Logged in user ID:", store.user_id);
  console.log("✅ Authorized user IDs:", store.authorizedUserIds);

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
    user_ids: [],
    newUserId: "",
  };

  const [formData, setFormData] = useState(initialFormData || {});
  const CATEGORY_OPTIONS = store.CATEGORY_OPTIONS || [];
  const categories = CATEGORY_OPTIONS;

  const handleRemoveUserId = (userId) => {
    setFormData((prev) => ({
      ...prev,
      user_ids: prev.user_ids.filter((id) => id !== userId),
    }));
  };

  // useEffect(() => {
  //   const fetchResourceData = async () => {
  //     try {
  //       const resourceData = await actions.getResource(id);
  //       const assignedUsers = await actions.getResourceUsers(id);
  //       const loggedInUserId = store.user_id;
  //       const isAuthorized =
  //         store.authorizedUserIds.includes(Number(loggedInUserId)) ||
  //         assignedUsers.some(
  //           (user) => Number(user.id) === Number(loggedInUserId)
  //         );

  //       if (!isAuthorized) {
  //         Swal.fire({
  //           icon: "error",
  //           title: "Access Denied",
  //           text: "You are not authorized to edit this resource.",
  //         });
  //         navigate("/");
  //         return;
  //       }

  //       setFormData({
  //         ...initialFormData,
  //         ...resourceData,
  //         category: resourceData.category
  //           ? resourceData.category.split(", ")
  //           : [],
  //         user_ids: assignedUsers.map((user) => user.id) || [],
  //         schedule: resourceData.schedule || initialDaysState,
  //       });
  //       setAssignedUsers(assignedUsers);
  //     } catch (error) {
  //       console.error("🚨 Error fetching data:", error);
  //     }
  //   };
  //   fetchResourceData();
  // }, [id, store.user_id, navigate]);

  useEffect(() => {
    const fetchResourceData = async () => {
      try {
        const resourceData = await actions.getResource(id);
        const response = await actions.getResourceUsers(id);
        const assignedUsers = Array.isArray(response) ? response : [];

        console.log("📦 resourceData:", resourceData);
        console.log("👥 assignedUsers (from API):", assignedUsers);

        const loggedInUserId = store.user_id;

        const isAuthorized =
          store.authorizedUserIds.includes(Number(loggedInUserId)) ||
          formData.user_ids.map(Number).includes(Number(loggedInUserId));
        // store.authorizedUserIds.includes(Number(loggedInUserId)) ||
        // assignedUsers.some(
        //   (user) => Number(user.id) === Number(loggedInUserId)
        // );

        if (!isAuthorized) {
          Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "You are not authorized to edit this resource.",
          });
          navigate("/");
          return;
        }

        setFormData({
          ...initialFormData,
          ...resourceData,
          category: resourceData.category
            ? resourceData.category.split(", ")
            : [],
          user_ids: assignedUsers.map((user) => user.id) || [],
          schedule: resourceData.schedule || initialDaysState,
        });

        setAssignedUsers(assignedUsers);
      } catch (error) {
        console.error("🚨 Error fetching data:", error);
      }
    };

    fetchResourceData();
  }, [id, store.user_id, navigate]);

  const handleAddUserId = () => {
    const newUserId = parseInt(formData.newUserId);
    if (!newUserId || formData.user_ids.includes(newUserId)) return;
    setFormData((prev) => ({
      ...prev,
      user_ids: [...prev.user_ids, newUserId],
      newUserId: "",
    }));
  };

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this resource? This action cannot be undone."
    );
    if (confirm) {
      await actions.deleteResource(id, navigate);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const loggedInUserId = store.user_id;
  //   console.log("🧾 Submitting form");
  //   console.log("👤 Logged in user ID:", loggedInUserId, typeof loggedInUserId);
  //   console.log("👥 Current authorized user IDs:", formData.user_ids);

  //   if (!formData.user_ids.map(Number).includes(Number(loggedInUserId))) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Access Denied",
  //       text: "You do not have permission to edit this resource.",
  //     });
  //     return;
  //   }

  //   if (!formData.latitude || !formData.longitude) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Address Required",
  //       text: "Please select a valid address from Google suggestions.",
  //     });
  //     return;
  //   }

  //   try {
  //     const success = await actions.editResource(id, formData, navigate);
  //     if (success) {
  //       actions.closeModal();
  //       navigate("/");
  //     }
  //   } catch (error) {
  //     console.error("🚨 Error updating the resource:", error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loggedInUserId = Number(store.user_id);
    console.log("🧾 Submitting form");
    console.log("👤 Logged in user ID:", loggedInUserId);
    console.log("✅ store.authorizedUserIds:", store.authorizedUserIds);
    console.log("👥 formData.user_ids:", formData.user_ids);

    const isAuthorized =
      store.authorizedUserIds.includes(loggedInUserId) ||
      formData.user_ids.map(Number).includes(loggedInUserId);

    console.log("🔐 isAuthorized:", isAuthorized);

    if (!isAuthorized) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "You do not have permission to edit this resource.",
      });
      return;
    }

    if (!formData.latitude || !formData.longitude) {
      Swal.fire({
        icon: "error",
        title: "Address Required",
        text: "Please select a valid address from Google suggestions.",
      });
      return;
    }

    try {
      const success = await actions.editResource(id, formData, navigate);
      if (success) {
        actions.closeModal();
        navigate("/");
      }
    } catch (error) {
      console.error("🚨 Error updating the resource:", error);
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
          [timeType]: value === "" ? null : value,
        },
      },
    }));
  };

  if (!formData) return <div>Loading...</div>;

  return (
    <>
      <p className="close-modal">
        <Link to={`/`}>
          <span className="material-symbols-outlined">arrow_back_ios</span>
          Back to Search
        </Link>
      </p>
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

          {store.authorizedUserIds?.includes(store.user_id) &&
            formData.user_ids && (
              <div className="input-group">
                <label>Approved Users</label>
                <ul>
                  {formData.user_ids.map((userId) => (
                    <li key={userId}>
                      User ID: {userId}{" "}
                      <button
                        type="button"
                        onClick={() => handleRemoveUserId(userId)}
                      >
                        ❌ Remove
                      </button>
                    </li>
                  ))}
                </ul>
                <input
                  className="geo-input"
                  type="number"
                  value={formData.newUserId || ""}
                  onChange={(e) => handleChange("newUserId", e.target.value)}
                  placeholder="Enter user ID to add"
                />
                <button type="button" onClick={handleAddUserId}>
                  ➕ Add User ID
                </button>
              </div>
            )}

          {/* {store.authorizedUserIds.includes(store.user_id) && (
            <div className="input-group">
              <label>Approved Users</label>
              <ul>
                {formData.user_ids.map((userId) => (
                  <li key={userId}>
                    User ID: {userId}{" "}
                    <button
                      type="button"
                      onClick={() => handleRemoveUserId(userId)}
                    >
                      ❌ Remove
                    </button>
                  </li>
                ))}
              </ul>
              <input
                className="geo-input"
                type="number"
                value={formData.newUserId || ""}
                onChange={(e) => handleChange("newUserId", e.target.value)}
                placeholder="Enter user ID to add"
              />
              <button type="button" onClick={handleAddUserId}>
                ➕ Add User ID
              </button>
            </div>
          )} */}

          <div className="input-group">
            <label htmlFor="geo-input">Address</label>
            <SmartPlacesAutocomplete
              defaultValue={formData.address}
              placeholder="Type address"
              onSelect={({ address, latitude, longitude }) => {
                handleChange("address", address);
                handleChange("latitude", latitude);
                handleChange("longitude", longitude);
              }}
            />
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
                <label htmlFor={`resource${resource.id}`}>
                  {resource.label}
                </label>
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
                value={formData.days[day]?.start || ""}
                onChange={(e) => handleTimeChange(day, "start", e.target.value)}
              />
              <span> until </span>
              <input
                className="geo-input time-input"
                type="time"
                id={`${day}End`}
                name={`${day}End`}
                value={formData.days[day]?.end || ""}
                onChange={(e) => handleTimeChange(day, "end", e.target.value)}
              />
              <button
                className="clear-button"
                type="button"
                onClick={() => {
                  handleTimeChange(day, "start", null);
                  handleTimeChange(day, "end", null);
                }}
              >
                ❌ Clear {day.charAt(0).toUpperCase() + day.slice(1)}
              </button>
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
                handleChange("updated", `${selectedDate}T00:00:00Z`);
              }}
            />
          </div>

          {store.authorizedUser || formData.user_ids.includes(store.user_id) ? (
            <button
              className="apply-button"
              style={{ backgroundColor: "lightgreen", marginTop: "40px" }}
              type="submit"
            >
              Update
            </button>
          ) : (
            <p style={{ color: "red" }}>
              You do not have permission to edit this resource.
            </p>
          )}
        </form>

        {[1, 3, 4, 8].includes(store.user_id) && (
          <button className="delete-button" onClick={handleDelete}>
            Permanently Delete This Resource
          </button>
        )}
      </div>
    </>
  );
};

export default Edit;
