import React, { useState, useContext, useEffect } from "react";
import Swal from "sweetalert2";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { jwtDecode } from "jwt-decode";
import Styles from "../styles/settings.css";

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

  // Decode JWT and extract user ID
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("✅ Decoded JWT:", decoded);

        // Fix: Extract `id` from `sub` object
        if (
          !decoded.sub ||
          typeof decoded.sub !== "object" ||
          !decoded.sub.id
        ) {
          console.error(
            "❌ Invalid JWT: 'sub' field is missing or incorrect",
            decoded
          );
          setError("Invalid authentication token. Please log in again.");
          return;
        }

        setUserId(decoded.sub.id); // Store user ID
        setEmail(decoded.sub.email || ""); // Store email
      } catch (err) {
        console.error("❌ Error decoding token:", err);
        setError("Invalid token format. Please log in again.");
      }
    }
  }, [token]);

  // Fetch user info on component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!token) {
        setError("Authentication error. Please log in again.");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        console.log("✅ Decoded JWT:", decoded);

        // Fix: Extract `id` from `sub` if it's an object
        const userId =
          typeof decoded.sub === "object" ? decoded.sub.id : decoded.sub;
        if (!userId) {
          throw new Error("Invalid token structure: User ID is missing.");
        }

        setUserId(userId);

        console.log(
          "🔄 Fetching user info from:",
          `${store.current_back_url}/api/me`
        );
        const response = await fetch(`${store.current_back_url}/api/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const userData = await response.json();
        console.log("✅ API Response:", userData);

        if (!response.ok) {
          throw new Error(
            userData.error ||
              userData.msg ||
              "Failed to fetch user information."
          );
        }

        setName(userData.name || "");
        setEmail(userData.email || "");
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
      console.log("📝 Updating profile...");

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
      console.log("✅ Profile Update Response:", result);

      if (!response.ok) {
        throw new Error(result.error || "Failed to update profile.");
      }

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile information has been updated successfully.",
      }).then(() => {
        navigate("/");
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
      console.log("🔄 Authenticating user for password reset...");

      const authResponse = await fetch(`${store.current_back_url}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: currentPassword }),
      });

      const authData = await authResponse.json();
      console.log("✅ Login Response:", authData);

      if (!authResponse.ok) {
        throw new Error("Current password is incorrect.");
      }

      const newToken = authData.access_token;

      console.log("🔄 Sending password reset request...");

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
      console.log("✅ Password Change Response:", result);

      if (!response.ok) {
        throw new Error(result.error || "Failed to reset password.");
      }

      setSuccess(true);
      Swal.fire({
        icon: "success",
        title: "Password Updated",
        text: "Your password has been changed successfully.",
      }).then(() => {
        navigate("/");
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

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-section-2">
          <div className="form-row-profile">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* <div className="form-row-profile">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" value={email} disabled />
          </div> */}

          <div className="form-row-profile">
            <label htmlFor="city">City:</label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateProfile}
            disabled={loading}
            className="update-button"
          >
            {loading ? "Updating..." : "Update Profile"}
          </Button>
        </div>

        <div className="form-section-2">
          {/* <p>Change Password</p> */}
          <div className="form-row-profile">
            <label htmlFor="current-password">Current Password:</label>
            <input
              type="password"
              id="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="form-row-profile">
            <label htmlFor="new-password">New Password:</label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="form-row-profile">
            <label htmlFor="confirm-password">Confirm New Password:</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <Button
            variant="contained"
            color="secondary"
            onClick={handleResetPassword}
            disabled={loading}
            className="update-button"
          >
            {loading ? "Updating..." : "Change Password"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
