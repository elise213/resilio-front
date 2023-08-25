import React, { useState, useContext, useRef, useEffect } from "react"; import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import { ResourceInfo } from "./ResourceInfo";

const Modal = (props) => {
    const { store, actions } = useContext(Context);
    const modalContentRef = useRef(null);

    console.log("PROPS", props)

    let icon = "";
    let categories = props.resource.category;
    if (typeof categories === "string" && categories.includes(",")) {
        categories = categories.split(",").map(cat => cat.trim());
    }
    else if (typeof categories === "string") {
        categories = [categories];
    }
    else if (!Array.isArray(categories)) {
        categories = [];
    }
    if (categories.includes("health")) {
        icon = "fa-solid fa-stethoscope";
    } else if (categories.includes("food")) {
        icon = "fa-solid fa-bowl-rice";
    } else if (categories.includes("hygiene")) {
        icon = "fa-solid fa-soap";
    } else if (categories.includes("bathroom")) {
        icon = "fa-solid fa-toilet";
    } else if (categories.includes("work")) {
        icon = "fa-solid fa-briefcase";
    } else if (categories.includes("wifi")) {
        icon = "fa-solid fa-wifi";
    } else if (categories.includes("crisis")) {
        icon = "fa-solid fa-exclamation-triangle";
    } else if (categories.includes("substance")) {
        icon = "fa-solid fa-pills";
    } else if (categories.includes("legal")) {
        icon = "fa-solid fa-gavel";
    } else if (categories.includes("sex")) {
        icon = "fa-solid fa-heart";
    } else if (categories.includes("mental")) {
        icon = "fa-solid fa-brain";
    } else if (categories.includes("women")) {
        icon = "fa-solid fa-female";
    } else if (categories.includes("youth")) {
        icon = "fa-solid fa-child";
    } else if (categories.includes("seniors")) {
        icon = "fa-solid fa-blind";
    } else if (categories.includes("lgbtq")) {
        icon = "fa-solid fa-rainbow";
    } else if (categories.includes("shelter")) {
        icon = "fa-solid fa-person-shelter";
    } else {
        icon = "fa-solid fa-question";
    }

    const handleCloseClick = (event) => {
        event.stopPropagation();
        props.closeModal();
    };

    useEffect(() => {
        console.log("Inside useEffect: ", modalContentRef.current);

        const handleOutsideClick = (event) => {
            if (modalContentRef.current && !modalContentRef.current.contains(event.target)) {
                console.log("Clicked outside the modal!");
                props.closeModal();
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);


    return (
        <div>
            <div className="modal-div" >
                <div className="modal-content" ref={modalContentRef}>
                    <div className="modal-header">
                        <div className="modal-close-div">
                            <p className="x-close" onClick={handleCloseClick}>X</p>
                        </div>
                        <div className="modal-title-div">
                            <p>{props.resource.name}</p>
                            <i className={`${icon} card-icon-2`} />
                        </div>
                    </div>
                    <div className="modal-body">
                        <ResourceInfo
                            id={props.resource.id}
                            schedule={store.schedule}
                            res={props.resource}
                        />
                        <div className="modal-footer">
                            <p>
                                Is there a problem with this information? {""}
                                <Link to="/Contact">Let us know</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Modal;
