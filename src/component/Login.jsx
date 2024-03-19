import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import styles from "../styles/loginModal.css";
import Swal from "sweetalert2";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";

const Login = ({ openLoginModal, setOpenLoginModal }) => {
  const { store, actions } = useContext(Context);

  const [log, setLog] = useState("1");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [email, setEmail] = useState("");
  const [is_org, setIs_org] = useState("");

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

  function handleRegister(e) {
    e.preventDefault();
    actions.createUser(is_org, name, email, password, userAvatar);
    setLog("1");
  }

  function handleSelectImage(id) {
    store.avatarImages.forEach((i, idx) => {
      let img = document.querySelector(`#avatar${idx}`);
      img.classList.remove("avatarImageSelected");
    });
    let newselect = document.querySelector(`#avatar${id}`);
    newselect.classList.add("avatarImageSelected");
    setUserAvatar(id);
  }

  let field = null;
  if (log == "2") {
    field = (
      <div className="custom-login-modal-content">
        <div className="custom-login-modal-header">
          <span className="login-close" onClick={() => setLog("1")}>
            {" "}
            <span className="material-symbols-outlined">arrow_back_ios</span>
            Back to log in
          </span>
        </div>
        <div className="custom-login-modal-body">
          <form>
            <div className="">
              <label htmlFor="name" className="custom-form-label less-margin">
                Name
              </label>
              <input
                type="text"
                className="custom-form-control"
                id="name"
                aria-describedby="emailHelp"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></input>
            </div>
            <div className="">
              <label htmlFor="email1" className="custom-form-label">
                Email
              </label>
              <input
                type="email"
                className="custom-form-control"
                id="email"
                aria-describedby="emailHelp"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
            </div>
            <div className="">
              <label htmlFor="password" className="custom-form-label">
                Password
              </label>
              <input
                type="password"
                className="custom-form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></input>
            </div>
            <div className="center-header">
              <span className="custom-form-label" id="exampleloginModalLabel">
                Do you represent an organization?
              </span>
            </div>
            <div className="yes-or-no">
              <div className="custom-form-check">
                <input
                  className="custom-form-check-input radio"
                  type="radio"
                  name="orgRadio"
                  id="orgRadio1"
                  value={is_org}
                  onChange={() => setIs_org("true")}
                />
                <label
                  className="custom-form-label radio-label"
                  htmlFor="exampleRadios1"
                >
                  Yes
                </label>
              </div>

              <div className="custom-form-check">
                <input
                  className="custom-form-check-input radio"
                  type="radio"
                  name="orgRadio"
                  id="orgRadio2"
                  value={is_org}
                  onChange={() => setIs_org("false")}
                />
                <label
                  className="custom-form-label radio-label"
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
              className="submit"
              onClick={handleRegister}
            >
              Register
            </Button>
          </form>
        </div>
      </div>
    );
  }
  if (log == "1") {
    field = (
      <div className="custom-login-modal-content ">
        <div className="custom-login-modal-header">
          <span
            className="login-close"
            onClick={() => setOpenLoginModal(false)}
          >
            <span className="material-symbols-outlined">arrow_back_ios</span>
            Back to Search
          </span>
        </div>
        <div className="custom-login-modal-body">
          <form>
            <>
              {/* <label
                htmlFor="exampleInputEmail1"
                className="custom-form-label margin-cancel"
              >
                Email address
              </label> */}
              <input
                placeholder="Email"
                type="text"
                className="custom-form-control"
                id="exampleInputEmail1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
            </>
            <div className="">
              {/* <label
                htmlFor="exampleInputPassword1"
                className="custom-form-label"
              >
                Password
              </label> */}
              <input
                placeholder="Password"
                type="password"
                className="custom-form-control"
                id="exampleInputPassword1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></input>
            </div>

            <div style={{ width: "100%", marginTop: "10px" }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                className="submit"
                onClick={(e) => handleLogin(e)}
              >
                Log In
              </Button>
            </div>
          </form>
        </div>
        <div className="custom-login-modal-footer">
          <div className="forgot-password" onClick={() => setLog("2")}>
            Register for an account
          </div>
          {/* <div className="forgot-password" onClick={() => setLog("3")}>
            I forgot my password
          </div> */}
        </div>
      </div>
    );
  }

  return (
    <>
      {!openLoginModal &&
        (isLoggedIn ? (
          // <Avatar
          //   className="avatar-material-design"
          //   onClick={handleLogout}
          //   style={{ cursor: "pointer", backgroundColor: "#1976d2" }}
          // >
          //   <i className="fa fa-user" />
          // </Avatar>
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
      {openLoginModal && <div className="centered">{field}</div>}
    </>
  );
};

export default Login;
