import React, { useState, useContext, useEffect } from "react";
import Swal from "sweetalert2";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";

const ProfileSettings = () => {
  const { store, actions } = useContext(Context);
  const token = store.token; // Get token from context
  const navigate = useNavigate();

  // State for user profile fields
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch user info on component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!token) {
        setError("Authentication error. Please log in again.");
        return;
      }

      try {
        const response = await fetch(`${store.current_back_url}/api/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user information.");
        }

        const userData = await response.json();
        setUserId(userData.id);
        setName(userData.name);
        setEmail(userData.email);
        setCity(userData.city || "");
      } catch (err) {
        console.error("❌ Fetch user error:", err);
        setError(err.message || "Failed to fetch user data.");
      }
    };

    fetchUserInfo();
  }, [store.current_back_url, token]);

  // Update profile information
  const handleUpdateProfile = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${store.current_back_url}/api/update-profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, city }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update profile.");
      }

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile information has been updated successfully.",
      }).then(() => {
        navigate("/"); // Redirect after update
      });
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      setError(error.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const handleResetPassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const authResponse = await fetch(`${store.current_back_url}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: currentPassword }),
      });

      const authData = await authResponse.json();
      if (!authResponse.ok) {
        throw new Error("Current password is incorrect.");
      }

      const newToken = authData.access_token;

      const response = await fetch(
        `${store.current_back_url}/api/change-password`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${newToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: newPassword }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to reset password.");
      }

      setSuccess(true);
      Swal.fire({
        icon: "success",
        title: "Password Updated",
        text: "Your password has been changed successfully.",
      }).then(() => {
        navigate("/"); // Redirect after password reset
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("❌ Error:", error);
      setError(error.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <p className="close-modal">
        <Link to={`/`}>
          <span className="material-symbols-outlined">arrow_back_ios</span>
          Back to Search
        </Link>
      </p>
      <p className="page-title">Settings</p>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-row-profile">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-row-profile">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-row-profile">
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <button onClick={handleUpdateProfile} disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>

        <h3>Change Password</h3>

        <div className="form-row-profile">
          <label htmlFor="currentPassword">Current Password:</label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-row-profile">
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-row-profile">
          <label htmlFor="confirmPassword">Confirm New Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button onClick={handleResetPassword} disabled={loading}>
          {loading ? "Updating..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;
