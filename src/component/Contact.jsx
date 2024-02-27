"use client";
import React, { useState, useContext, useRef, useEffect } from "react";
import styles from "../styles/contact.css";
import CircleType from "circletype";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";
import Button from "@mui/material/Button";

const Contact = () => {
  const circleInstance = useRef();
  const form = useRef();
  const SERVICE_ID = "service_betnze8";
  const TEMPLATE_ID = "template_99iigjc";
  const PUBLIC_KEY = "bSrh0TD_khQU1Jash";

  // useEffect(() => {
  //   let circle1;
  //   if (circleInstance.current) {
  //     circle1 = new CircleType(circleInstance.current).radius(300);
  //   }
  //   return () => {
  //     circle1 && circle1.destroy();
  //   };
  // }, []);

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
      {/* <div className="contact-call">
        <span className="circle-font scroll-title" ref={circleInstance}>
          Get In Touch !
        </span>
      </div> */}

      <form ref={form} onSubmit={sendEmail} className="contact-form">
        <div className="contact-form-div">
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
        </div>
        <div className="contact-form-div">
          <div className="form-col-full">
            <textarea
              id="contactTextArea"
              name="message"
              className="form-control"
              placeholder="Message"
            ></textarea>
          </div>
        </div>

        <div className="contact-submit">
          <Button
            variant="contained"
            color="primary"
            className="submit"
            type="submit"
          >
            SEND
          </Button>
        </div>
      </form>
    </>
  );
};

export default Contact;
