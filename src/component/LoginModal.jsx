import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import styles from "../styles/loginModal.css";

const LoginModal = ({ log, setLog, email, setEmail, setPassword, name, password, is_org, setOpenLoginModal }) => {
    const { store, actions } = useContext(Context);

    console.log("LOG", log)
    let field = null;
    if (log == "2") {
        field = (
            <div className="loginModal-content">
                <div className="loginModal-header">
                    <span className="form-label" id="exampleloginModalLabel">
                        Please Register
                    </span>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="loginModal"
                        aria-label="Close"
                        onClick={() => setLog("1")}
                    ></button>
                </div>
                <div className="loginModal-body">
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
            <div className="loginModal-content">
                <div className="loginModal-header">
                    <span className="form-label" id="">
                        Please Login
                    </span>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="loginModal"
                        aria-label="Close"
                        onClick={() => setOpenLoginModal(false)}
                    ></button>
                </div>
                <div className="loginModal-body">
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
                        <div className="logRegBtnloginModalCont">
                            <div style={{ "width": "100%" }}>
                                <button

                                    type="submit"
                                    className="submit"
                                    data-bs-dismiss="loginModal"
                                    onClick={(e) => handleLogin(e)}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </form>
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
            </div>
        );
    }

    return (
        <div>
            {field}
        </div>
    )
}

export default LoginModal
