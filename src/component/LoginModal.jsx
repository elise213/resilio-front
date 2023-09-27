import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import styles from "../styles/loginModal.css";
import Swal from "sweetalert2";

const LoginModal = ({
  log,
  setLog,
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  is_org,
  setIs_org,
  handleSelectImage,
  handleRegister,
  setOpenLoginModal,
  handleLogin,
}) => {
  const { store, actions } = useContext(Context);

  console.log("LOG", log);
  let field = null;
  if (log == "2") {
    field = (
      <div className="login-modal-content">
        <div className="login-modal-header">
          <div className="center-header">
            <span className="form-label" id="exampleloginModalLabel">
              {/* Please Register */}
            </span>
          </div>
          <button
            type="button"
            className="btn-close"
            onClick={() => setLog("1")}
          ></button>
        </div>
        <div className="login-modal-body">
          <form>
            <span className="form-label">
              Do you represent an organization?
            </span>
            <div className="yes-or-no">
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
            <div className="">
              <label htmlFor="name" className="form-label less-margin">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                aria-describedby="emailHelp"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></input>
            </div>
            <div className="">
              <label htmlFor="email1" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                aria-describedby="emailHelp"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
            </div>
            <div className="">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></input>
            </div>
            <p className="form-label">Choose your avatar</p>
            <div className="avatar-div">
              {store.avatarImages.map((i, idx) => {
                return (
                  <span
                    key={i}
                    className={`${i} avatarImages`}
                    id={"avatar" + idx}
                    onClick={() => handleSelectImage(idx)}
                  />
                );
              })}
            </div>

            <button
              type="submit"
              className="submit"
              data-bs-dismiss="loginModal"
              style={{ width: "100%" }}
              onClick={(e) => handleRegister(e)}
            >
              Register
            </button>
            <div className="login-modal-footer">
              <div className="forgot-password" onClick={() => setLog("1")}>
                Go back to login
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
  if (log == "1") {
    field = (
      <div className="login-modal-content">
        <div className="login-modal-header">
          <div className="header-div">
            <span className="form-label" id="">
              {/* Please Login */}
            </span>
          </div>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="loginModal"
            aria-label="Close"
            onClick={() => setOpenLoginModal(false)}
          ></button>
        </div>
        <div className="login-modal-body">
          <form>
            <div className="">
              <label
                htmlFor="exampleInputEmail1"
                className="form-label margin-cancel"
              >
                Email address
              </label>
              <input
                type="text"
                className="form-control"
                id="exampleInputEmail1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
            </div>
            <div className="">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></input>
            </div>

            <div style={{ width: "100%" }}>
              <button
                type="submit"
                className="submit"
                onClick={(e) => handleLogin(e)}
              >
                Submit
              </button>
            </div>
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

  return <div className="centered">{field}</div>;
};

export default LoginModal;
