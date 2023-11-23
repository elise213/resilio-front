"use client";
import React, { useState, useContext, useRef, useEffect } from "react";
import styles from "../styles/contact.css";
import CircleType from "circletype";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";

const Contact = () => {
  const circleInstance = useRef();
  const form = useRef();
  const SERVICE_ID = "service_betnze8";
  const TEMPLATE_ID = "template_99iigjc";
  const PUBLIC_KEY = "bSrh0TD_khQU1Jash";

  useEffect(() => {
    let circle1;
    if (circleInstance.current) {
      circle1 = new CircleType(circleInstance.current).radius(300);
    }
    return () => {
      circle1 && circle1.destroy();
    };
  }, []);

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
    <div className="contact-page">
      <div className="contact-call">
        <span className="circle-font scroll-title" ref={circleInstance}>
          Get In Touch !
        </span>
      </div>

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
            {/* <label className="" htmlFor="emailInput">
              Email
            </label> */}
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
            {/* <label className="" htmlFor="contactTextArea">
              Message
            </label> */}
            <textarea
              id="contactTextArea"
              name="message"
              className="form-control"
              placeholder="Messagge"
            ></textarea>
          </div>
        </div>
        <div className="form-col-full">
          <button className="submit" type="submit">
            SEND
          </button>
        </div>
      </form>
      {/* <Image className="contact-sticker" src="/../public/img/rewind.png" height={100} width={100} alt="" /> */}
    </div>
  );
};

export default Contact;

{
  /* <form id="contact_form" name="contact_form" method="post" className="contact-form">
                <div className="form-row">
                    <div className="form-col">
                        <label className="label">Name</label>
                        <input type="text" required maxLength="50" className="form-control" id="first_name" name="first_name" />
                    </div>
                    <div className="form-col">
                        <label className="label" htmlFor="email_addr">Email address</label>
                        <input type="email" required maxLength="50" className="form-control" id="email_addr" name="email" />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-col-full">
                        <label className="label" htmlFor="message">Message</label>
                        <textarea className="form-control message" id="message" name="message" rows="3"></textarea>
                    </div>
                    <div className="form-row">
                        <button type="submit" className="send-button">Send</button>
                    </div>
                </div>
            </form> */
}

// ____

//     return (
//         <form ref={form} onSubmit={sendEmail} className='contact-form'>
//             <div className='contact-form-top'>
//                 <div className="form-div">
//                     <label className='text-color' htmlFor="nameInput">Name</label>
//                     <input type="text" id='nameInput' name="name" className="form-control"/>
//                 </div>
//                 <div className="form-div">
//                     <label className='text-color' htmlFor="emailInput">Email</label>
//                     <input type="text" id='emailInput' name='email'  className="form-control"/>
//                 </div>
//             </div>
//             <div className='contact-form-mid'>
//                 <label className='text-color' htmlFor="contactTextArea">Message</label>
//                 <textarea id="contactTextArea" name='message' className="form-control"></textarea>
//             </div>
//             <button className='contact-send-btn' type='submit'>SEND</button>
//         </form>
//     )
// }

// export default Form
