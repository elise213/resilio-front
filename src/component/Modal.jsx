import React, { useState, useContext, useRef, useEffect } from "react"; import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import { ResourceInfo } from "./ResourceInfo";

const Modal = (props) => {
    const { store, actions } = useContext(Context);
    const modalContentRef = useRef(null);

    const getIconForCategory = (category) => {
        switch (category) {
            case "health": return "fa-solid fa-stethoscope";
            case "food": return "fa-solid fa-bowl-rice";
            case "hygiene": return "fa-solid fa-soap";
            case "bathroom": return "fa-solid fa-toilet";
            case "work": return "fa-solid fa-briefcase";
            case "wifi": return "fa-solid fa-wifi";
            case "crisis": return "fa-solid fa-exclamation-triangle";
            case "substance": return "fa-solid fa-pills";
            case "legal": return "fa-solid fa-gavel";
            case "sex": return "fa-solid fa-heart";
            case "mental": return "fa-solid fa-brain";
            case "women": return "fa-solid fa-female";
            case "youth": return "fa-solid fa-child";
            case "seniors": return "fa-solid fa-blind";
            case "lgbtq": return "fa-solid fa-rainbow";
            case "shelter": return "fa-solid fa-person-shelter";
            default: return "fa-solid fa-question";
        }
    };

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

    const icons = categories.map(getIconForCategory);

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
                    {/* <div className="modal-header">
                        <div className="modal-close-div">
                            <p className="x-close" onClick={handleCloseClick}>X</p>
                        </div>
                        <div className="modal-title-div">
                            <p>{props.resource.name}</p>
                            <i className={`${icon} card-icon-2`} />
                        </div>
                    </div> */}
                    <div className="modal-header">
                        <div className="modal-close-div">
                            <p className="x-close" onClick={handleCloseClick}>X</p>
                        </div>
                        <div className="modal-title-div">
                            <p>{props.resource.name}</p>
                            {icons.map((icon, index) => <i key={index} className={`${icon} card-icon-2`} />)}
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
