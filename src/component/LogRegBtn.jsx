import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";

const LogRegBtn = () => {
  const [log, setLog] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [name, setName] = useState("");
  const [is_org, setIs_org] = useState("");
  const { store, actions } = useContext(Context);

  function handleLogin(e) {
    e.preventDefault();
    actions.login(email, password);
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
      <div className="modal-content">
        <div className="modal-header">
          <span className="form-label" id="exampleModalLabel">
            Register
          </span>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            onClick={() => setLog("1")}
          ></button>
        </div>
        <div className="modal-body">
          <form>
            <span className="form-label">Do you represent an organization?</span>
            <div className="d-flex justify-content-center">
              <div className="form-check m-2">
                <input
                  className="form-check-input radio"
                  type="radio"
                  name="orgRadio"
                  id="orgRadio1"
                  value={is_org}
                  onChange={() => setIs_org("true")}
                />
                <label className="form-check-label radio-label" htmlFor="exampleRadios1">
                  Yes
                </label>
              </div>

              <div className="form-check m-2">
                <input
                  className="form-check-input radio"
                  type="radio"
                  name="orgRadio"
                  id="orgRadio2"
                  value={is_org}
                  onChange={() => setIs_org("false")}
                />
                <label className="form-check-label radio-label" htmlFor="exampleRadios1">
                  No
                </label>
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Name
              </label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></input>
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
            </div>
            <div className="mb-3">
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
            <div className="mb-3">
              <p>Choose your avatar</p>
              {store.avatarImages.map((i, idx) => {
                return (
                  <span
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
              data-bs-dismiss="modal"
              style={{ width: "100%" }}
              onClick={(e) => handleRegister(e)}
            >
              Register
            </button>
            <div className="mt-3" style={{ width: "100%", textAlign: "center" }}>
              <a className="forgot-password" onClick={() => setLog("1")}>
                Go back to login
              </a>
            </div>
          </form>
        </div>
      </div>
    );
  } if (log == "1") {
    field = (
      <div className="modal-content">
        <div className="modal-header">
          <span className="form-label" id="">
            Please Login
          </span>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">
          <form>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Email address
              </label>
              <input
                type="text"
                className="form-control"
                id="exampleInputEmail1"
                // aria-describedby="emailHelp"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
            </div>
            <div className="mb-3">
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
            <div className="logRegBtnModalCont">
              <div style={{ "width": "100%" }}>
                <button

                  type="submit"
                  className="submit"
                  data-bs-dismiss="modal"
                  onClick={(e) => handleLogin(e)}
                >
                  Submit
                </button>
              </div>
              <div>
                <div
                  className="forgot-password"
                  onClick={() => setLog("2")}
                >
                  Register for an account
                </div>
                <div className="forgot-password"
                  onClick={() => setLog("3")}>
                  I forgot my password
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
  if (log == "3") {
    field = (
      <div className="modal-content">
        <div className="modal-header">
          <span className="form-label" id="">
            Forgot Password
          </span>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">
          <form>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Email address
              </label>
              <input
                type="text"
                className="form-control"
                id="exampleInputEmail1"
                // aria-describedby="emailHelp"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
            </div>
            <div className="logRegBtnModalCont">
              <div style={{ "width": "100%" }}>
                <button

                  type="submit"
                  className="submit"
                  data-bs-dismiss="modal"
                // onClick={(e) => handleLogin(e)}
                >
                  Send recovery email
                </button>
              </div>
              <div>
                <div
                  className="forgot-password"
                  onClick={() => setLog("1")}
                >
                  Back to Login
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>)
  }
  return (
    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
      <span
        type="button"
        className="btn nav-btn"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        LOGIN
      </span>
      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">{field}</div>
      </div>
    </div>
  );
};
export default LogRegBtn;
