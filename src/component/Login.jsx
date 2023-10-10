import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import LoginModal from "./LoginModal";
import styles from "../styles/loginModal.css";

const Login = () => {
  const [log, setLog] = useState("1");
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [is_org, setIs_org] = useState("");
  const { store, actions } = useContext(Context);

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

  useEffect(() => {
    if (openLoginModal) {
      document.body.classList.add("loginModal-open");
    } else {
      document.body.classList.remove("loginModal-open");
    }
  }, [openLoginModal]);

  return (
    <div className={`login-container ${openLoginModal ? "open" : ""}`}>
      <span
        className={`login-container ${openLoginModal ? "open-2" : ""}`}
        type="button"
        onClick={() => (hasToken ? handleLogout() : setOpenLoginModal(true))}
      >
        {!openLoginModal && (hasToken ? "Logout" : "Login")}
      </span>
      {openLoginModal && (
        <>
          <div className="loginModal-overlay"></div>
          <LoginModal
            setOpenLoginModal={setOpenLoginModal}
            log={log}
            email={email}
            name={name}
            setName={setName}
            password={password}
            setPassword={setPassword}
            setLog={setLog}
            is_org={is_org}
            setIs_org={setIs_org}
            setEmail={setEmail}
            handleSelectImage={handleSelectImage}
            handleRegister={handleRegister}
            handleLogin={handleLogin}
          />
        </>
      )}
    </div>
  );
};

export default Login;
