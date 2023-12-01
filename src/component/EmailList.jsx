import React, { useContext, useRef } from "react";
import styles from "../styles/emailList.css";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";
import { Context } from "../store/appContext";

const EmailList = () => {
  const { store, actions } = useContext(Context);
  const form = useRef();
  const SERVICE_ID = "service_betnze8";
  const TEMPLATE_ID = "template_99iigjc";
  const PUBLIC_KEY = "bSrh0TD_khQU1Jash";

  const signUpForMailingList = (e) => {
    e.preventDefault();

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY).then(
      (result) => {
        console.log(result);
        Swal.fire({
          icon: "success",
          title: "Successfully Signed Up!",
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
    <div className="email-list-container">
      {/* <img className="email-logo" src="/img/LOGO2.png" /> */}
      {/* <div className="socials">
        <i className="fa-brands fa-instagram" />
        <i className="fa-brands fa-twitter" />
        <i className="fa-brands fa-facebook-f" />
      </div> */}
      <p className="sign-up">SUBSCRIBE TO OUR NEWSLETTER</p>
      <form
        ref={form}
        onSubmit={signUpForMailingList}
        className="email-list-form"
      >
        <div className="email-list-input-div">
          <input
            type="text"
            id="emailListInput"
            name="email"
            className="emailListInput"
            placeholder="Email Address"
            required
          />
        </div>
        <button className="send-2" type="submit">
          <i className="fa-solid fa-angle-right"></i>
        </button>
      </form>
    </div>
  );
};

export default EmailList;
