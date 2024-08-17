import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import styles from "../styles/loginModal.css";
import Swal from "sweetalert2";
import Button from "@mui/material/Button";

const Login = ({ openLoginModal, setOpenLoginModal }) => {
  const { store, actions } = useContext(Context);

  const [log, setLog] = useState("1");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [email, setEmail] = useState("");
  const [is_org, setIs_org] = useState("");

  console.log("log", log);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = sessionStorage.getItem("token") || store.token;
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
  }, [store.token]);

  const hasToken = store.token;

  async function handleLogin(e) {
    e.preventDefault();
    const loginSuccessful = await actions.login(email, password);
    if (loginSuccessful) {
      setOpenLoginModal(false);
    }
  }

  function handleLogout() {
    actions.logout();
  }

  async function handleForgotPassword(e) {
    e.preventDefault();
    const forgotEmail = e.currentTarget.forgotEmail.value;
    const myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${sessionStorage.getItem("token")}`
    );
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      recipient_email: forgotEmail,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${store.current_back_url}/api/forgot-password`,
        requestOptions
      );
      if (response.ok) {
        const result = await response.json();
        console.log(result);
        Swal.fire({
          icon: "success",
          title: "Email Sent",
          text: "Please check your email to reset your password",
        }).then(() => {
          setOpenLoginModal(false);
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to send reset email. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: error.message,
      });
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    const userCreated = await actions.createUser(
      is_org,
      name,
      email,
      password,
      userAvatar
    );

    if (userCreated) {
      await actions.login(email, password);
      setOpenLoginModal(false);
      setLog("1");
    } else {
      console.error("User creation failed.");
    }
  }

  let field = null;
  if (log == "2") {
    field = (
      <div className="login-modal-content">
        <div className="login-modal-header">
          <span
            className="close-modal"
            onClick={() => {
              setOpenLoginModal(false);
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
              setOpenLoginModal(false);
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

  if (log == "3") {
    field = (
      <div className="login-modal-content ">
        <div className="login-modal-header">
          <span
            className="close-modal"
            onClick={() => {
              setOpenLoginModal(false);
              setLog("1");
            }}
          >
            <span className="material-symbols-outlined">arrow_back_ios</span>
            Back to Search
          </span>
        </div>
        <div className="login-modal-body">
          <form onSubmit={handleForgotPassword}>
            <>
              <div className="form-section">
                <label htmlFor="forgotPasswordEmail" className="form-label">
                  Email
                </label>
                <input
                  type="text"
                  className="form-input"
                  id="forgotPasswordEmail"
                  name="forgotEmail"
                ></input>
              </div>
            </>
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

  return (
    <>
      {!openLoginModal &&
        (isLoggedIn ? (
          <Button
            className="login-button-resilio"
            variant="contained"
            color="primary"
            onClick={() => handleLogout()}
          >
            Log out
          </Button>
        ) : (
          <Button
            className="login-button-resilio"
            variant="contained"
            color="primary"
            onClick={() => setOpenLoginModal(true)}
          >
            Log in
          </Button>
        ))}
      {openLoginModal && <div className="login-div">{field}</div>}
    </>
  );
};

export default Login;
