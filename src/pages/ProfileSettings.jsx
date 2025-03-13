import React, { useState, useEffect, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import Styles from "../styles/settings.css";

const ProfileSettings = () => {
  const { store, actions } = useContext(Context);
  const location = useLocation();
  const { userId } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const tokenFromUrl = queryParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    if (userId && store.user_id !== parseInt(userId, 10)) {
      actions.getUserInfo(userId).then((userInfo) => {
        setName(userInfo?.name || "");
        setCity(userInfo?.city || "");
      });
    } else {
      setName(store.name || "");
      setCity(store.city || "");
    }
  }, [userId, store.user_id, store.name, store.city, actions]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const token = tokenFromUrl || sessionStorage.getItem("token");

    try {
      const response = await fetch(
        `${store.current_back_url}/api/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password: newPassword }),
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Password Reset",
          text: "Your password has been reset successfully.",
        });
        setNewPassword("");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to reset password. Please try again.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to reset password. Please try again.",
      });
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");

    try {
      const response = await fetch(
        `${store.current_back_url}/api/update-profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, city }),
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Profile Updated",
          text: "Your profile has been updated successfully.",
        });
        setName("");
        setCity("");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to update profile. Please try again.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update profile. Please try again.",
      });
    }
  };

  return (
    <div className="settings-page">
      <p className="close-settings">
        <Link to={`/`}>
          <span className="material-symbols-outlined">arrow_back_ios</span>
          Back to Search
        </Link>
      </p>
      <div className="settings-container">
        <p className="page-title">Account</p>

        <form onSubmit={handleResetPassword} className="profile-form">
          <div className="form-row">
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button className="settings-submit" type="submit">
            Reset Password
          </button>
        </form>

        <hr />

        <form onSubmit={handleProfileUpdate} className="profile-form">
          <div className="form-row">
            <label htmlFor="name">Display Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <label htmlFor="city">City:</label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <button className="settings-submit" type="submit">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;
