import React, { useState, useRef, useContext } from "react";
import { Context } from "../store/appContext";
import { Button } from "@mui/material";
import Swal from "sweetalert2";
import emailjs from "emailjs-com";

const SERVICE_ID = "service_5v912b5";
const TEMPLATE_ID = "template_11p5p5t";
const PUBLIC_KEY = "frmUHhhWUG9vtMRit";

const Register = ({ setLog, log }) => {
  const { actions } = useContext(Context);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [is_org, setIs_org] = useState("");
  const [resourceName, setResourceName] = useState("");
  const [resourceCity, setResourceCity] = useState("");
  const formRef = useRef(null);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (is_org === "1" && (!resourceName || !resourceCity)) {
      Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: "Please provide the resource name and city.",
      });
      return;
    }
    try {
      await actions.createUser(is_org, name, email, password);
      Swal.fire({
        icon: "success",
        title: "Account Created",
        text: "You now have an account. Organization verification is pending.",
      });

      // If organization, send verification email
      if (is_org === "1" && resourceName && resourceCity) {
        sendOrgVerificationEmail();
        setLog("1");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: "An error occurred while creating your account.",
      });
    }
  };

  const sendOrgVerificationEmail = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("resourceName", resourceName);
    formData.append("resourceCity", resourceCity);

    try {
      await emailjs.sendForm(
        SERVICE_ID,
        TEMPLATE_ID,
        formRef.current,
        PUBLIC_KEY
      );
      Swal.fire({
        icon: "success",
        title: "Verification Email Sent",
        text: "Your information has been sent for verification.",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to send verification email.",
      });
    }
  };

  return (
    <div className="login-modal-content">
      <div className="login-modal-body">
        <form ref={formRef} onSubmit={handleRegister}>
          <div className="form-section">
            <label htmlFor="name" className="form-label less-margin">
              Name
            </label>
            <input
              type="text"
              className="form-input"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-section">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-input"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
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
              required
            />
          </div>

          <div className="form-section">
            <span className="form-label">
              Do you represent an organization?
            </span>
            <div
              className="form-check"
              style={{ alignSelf: "start", width: "50px" }}
            >
              <input
                className="form-check-input radio"
                type="radio"
                name="orgRadio"
                id="orgRadio1"
                value="1"
                onChange={() => setIs_org("1")}
              />
              <label className="form-label radio-label" htmlFor="orgRadio1">
                Yes
              </label>
            </div>
            <div
              className="form-check"
              style={{ alignSelf: "start", width: "50px" }}
            >
              <input
                className="form-check-input radio"
                type="radio"
                name="orgRadio"
                id="orgRadio2"
                value="0"
                onChange={() => setIs_org("0")}
              />
              <label className="form-label radio-label" htmlFor="orgRadio2">
                No
              </label>
            </div>
          </div>

          {is_org === "1" && (
            <>
              <div className="form-section">
                <label htmlFor="resource_name" className="form-label">
                  Resource Name
                </label>
                <input
                  type="text"
                  className="form-input"
                  id="resource_name"
                  name="resourceName"
                  value={resourceName}
                  onChange={(e) => setResourceName(e.target.value)}
                  required
                />
              </div>
              <div className="form-section">
                <label htmlFor="resource_city" className="form-label">
                  Resource City
                </label>
                <input
                  type="text"
                  className="form-input"
                  id="resource_city"
                  name="resourceCity"
                  value={resourceCity}
                  onChange={(e) => setResourceCity(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <Button variant="contained" color="primary" type="submit">
            Register
          </Button>
        </form>
        <span className="forgot-password" onClick={() => setLog("1")}>
          Return to Login
        </span>
      </div>
    </div>
  );
};

export default Register;
