import React, { useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import { ResourceInfo } from "./ResourceInfo";

const Modal = (props) => {
    const { store, actions } = useContext(Context);

    const handleCloseClick = (event) => {
        event.stopPropagation();
        props.closeModal();
    };

    { console.log("ITEM", props.resource) }
    return (
        <div>

            <div className="modal-div">
                <div className="modal-close-div">
                    <p className="x-close" onClick={handleCloseClick}>X</p>
                </div>
                <div className="modal-content">
                    <div className="modal-header">
                        <div className="modal-title-div">
                            <p>{props.resource.name}</p>
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
