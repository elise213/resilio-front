import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Avatar, Menu, MenuItem, IconButton, Button } from "@mui/material";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import styles from "../styles/loginModal.css";

const Login = ({ setLayout }) => {
  const { store, actions } = useContext(Context);

  const [log, setLog] = useState("1");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [email, setEmail] = useState("");
  const [is_org, setIs_org] = useState("");
  const [anchorEl, setAnchorEl] = useState(null); // State for dropdown
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(
    store.loginModalIsOpen
  );
  const userId2 = parseInt(sessionStorage.getItem("user_id"), 10);

  useEffect(() => {
    setIsLoginModalOpen(store.loginModalIsOpen);
  }, [store.loginModalIsOpen]);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = sessionStorage.getItem("token") || store.token;
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
  }, [store.token]);

  function handleRegister(e) {
    e.preventDefault();
    actions.createUser(is_org, name, email, password, userAvatar);
    setLog("1");
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    const loginSuccessful = await actions.login(email, password);
    if (loginSuccessful) {
      actions.closeLoginModal();
    }
  };

  const handleLogout = () => {
    actions.logout();
    setAnchorEl(null); // Close dropdown on logout
    setLayout("fullscreen-sidebar");
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const forgotEmail = email; // Use the email state directly

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipient_email: forgotEmail }),
    };

    try {
      const response = await fetch(
        `${store.current_back_url}/api/forgot-password`,
        requestOptions
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Email Sent",
          text: "Please check your email to reset your password",
        }).then(() => {
          actions.closeLoginModal();
        });
      } else {
        const errorMessage =
          response.status === 403
            ? "Authorization failed. Please log in again."
            : "Failed to send reset email. Please try again.";
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "Network error. Please check your internet connection and try again.",
      });
    }
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget); // Open the dropdown
  };

  const handleProfileClose = () => {
    setAnchorEl(null); // Close the dropdown
  };

  let field = null;
  if (log == "2") {
    field = (
      <div className="login-modal-content">
        <div className="login-modal-header">
          <span
            className="close-modal"
            onClick={() => {
              actions.closeLoginModal();
              setLog("1");
            }}
          >
            <span className="material-symbols-outlined">arrow_back_ios</span>
            Back to Search
          </span>
        </div>
        <div className="login-modal-body">
          <form>
            <div className="form-section">
              <label htmlFor="name" className="form-label less-margin">
                Name
              </label>
              <input
                type="text"
                className="form-input"
                id="name"
                aria-describedby="emailHelp"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></input>
            </div>
            <div className="form-section">
              <label htmlFor="email1" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-input"
                id="email"
                aria-describedby="emailHelp"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
            </div>
            <div className="form-section">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-input"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></input>
            </div>
            <div className="form-section">
              <span className="form-label" id="exampleloginModalLabel">
                Do you represent an organization?
              </span>
              <div className="form-check">
                <input
                  className="form-check-input radio"
                  type="radio"
                  name="orgRadio"
                  id="orgRadio1"
                  value={is_org}
                  onChange={() => setIs_org("true")}
                />
                <label
                  className="form-label radio-label"
                  htmlFor="exampleRadios1"
                >
                  Yes
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input radio"
                  type="radio"
                  name="orgRadio"
                  id="orgRadio2"
                  value={is_org}
                  onChange={() => setIs_org("false")}
                />
                <label
                  className="form-label radio-label"
                  htmlFor="exampleRadios1"
                >
                  No
                </label>
              </div>
            </div>

            <Button
              variant="contained"
              color="primary"
              type="submit"
              className="form-button"
              onClick={handleRegister}
            >
              Register
            </Button>
          </form>
          <span
            className="forgot-password"
            onClick={() => {
              setLog("1");
            }}
            style={{ marginTop: "20px" }}
          >
            Return to Login
          </span>
        </div>
      </div>
    );
  }
  if (log == "1") {
    field = (
      <div className="login-modal-content ">
        <div className="login-modal-header">
          <span
            className="close-modal"
            onClick={() => {
              actions.closeLoginModal();
              setLog("1");
            }}
          >
            <span className="material-symbols-outlined">arrow_back_ios</span>
            Back to Search
          </span>
        </div>
        <div className="login-modal-body">
          <form>
            <>
              <div className="form-section">
                <label htmlFor="inputEmail1" className="form-label">
                  Email
                </label>
                <input
                  type="text"
                  className="form-input"
                  id="inputEmail1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></input>
              </div>
            </>
            <div className="form-section">
              <label htmlFor="inputPassword1" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-input"
                id="inputPassword1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></input>
            </div>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className="form-button"
              onClick={(e) => handleLogin(e)}
            >
              Log In
            </Button>
          </form>
        </div>

        <div className="login-modal-footer">
          <div className="forgot-password" onClick={() => setLog("2")}>
            Register for an account
          </div>
          <div className="forgot-password" onClick={() => setLog("3")}>
            I forgot my password
          </div>
        </div>
      </div>
    );
  }

  if (log === "3") {
    field = (
      <div className="login-modal-content">
        <div className="login-modal-header">
          <span
            className="close-modal"
            onClick={() => {
              actions.closeLoginModal();
              setLog("1");
            }}
          >
            <span className="material-symbols-outlined">arrow_back_ios</span>
            Back to Search
          </span>
        </div>
        <div className="login-modal-body">
          <form onSubmit={handleForgotPassword}>
            <div className="form-section">
              <label htmlFor="forgotPasswordEmail" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-input"
                id="forgotPasswordEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="password-submit-div">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                className="form-button"
              >
                Reset Password
              </Button>
            </div>
          </form>
          <span
            className="forgot-password"
            onClick={() => setLog("1")}
            style={{ marginTop: "20px" }}
          >
            Return to Login
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      {!isLoginModalOpen && isLoggedIn ? (
        <>
          {/* Profile Circle for logged-in users */}
          <IconButton onClick={handleProfileClick}>
            <Avatar alt="Profile" src={"/default-avatar.jpg"} />
          </IconButton>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <MenuItem onClick={handleProfileClose}>
              <Link
                to={`/profilesettings/${userId2}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Settings
              </Link>
            </MenuItem>
            <MenuItem onClick={handleProfileClose}>
              <Link
                to={`/profile/${userId2}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  padding: "0 !important",
                }}
              >
                Profile
              </Link>
            </MenuItem>
            <MenuItem onClick={handleProfileClose}>
              <Link
                to="/favorites"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Favorites
              </Link>
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </>
      ) : (
        <Button
          className="login-button-resilio"
          variant="contained"
          color="primary"
          onClick={() => {
            actions.openLoginModal();
            setLayout("fullscreen-sidebar");
          }}
        >
          Log in
        </Button>
      )}
      {isLoginModalOpen && <div className="login-div">{field}</div>}
    </>
  );
};

export default Login;
