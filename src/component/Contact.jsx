"use client";
import React, { useState, useContext, useRef, useEffect } from "react";
import styles from "../styles/contact.css";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";

const Contact = () => {
  const form = useRef();
  const SERVICE_ID = "service_5v912b5";
  const TEMPLATE_ID = "template_u7nitmj";
  const PUBLIC_KEY = "frmUHhhWUG9vtMRit";

  const sendEmail = (e) => {
    e.preventDefault();
    console.log(form.current);
    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY).then(
      (result) => {
        console.log(result);
        Swal.fire({
          icon: "success",
          title: "Message Sent Successfully",
        });
      },
      (error) => {
        console.log(error.text);
        Swal.fire({
          icon: "error",
          title: "Ooops, something went wrong",
          text: error.text,
        });
      }
    );
    e.target.reset();
  };

  return (
    <>
      <form ref={form} onSubmit={sendEmail} className="contact-form">
        <div className="form-col">
          <input
            type="text"
            id="nameInput"
            name="name"
            className="form-control"
            placeholder="Name"
          />
        </div>
        <div className="form-col">
          <input
            type="text"
            id="emailInput"
            name="email"
            className="form-control"
            placeholder="Email address"
          />
        </div>
        <div className="form-col-full">
          <textarea
            id="contactTextArea"
            name="message"
            className="form-control"
            placeholder="Message"
          ></textarea>
        </div>
        <button
          className="apply-button"
          type="submit"
          style={{ marginTop: "20px", marginLeft: "5px" }}
        >
          SEND
        </button>
      </form>
    </>
  );
};

export default Contact;
