import React, { useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import { ResourceInfo } from "./ResourceInfo";

const Modal = (props) => {
    const { store, actions } = useContext(Context);
    const modalClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // e.stopImmediatePropagation();
        return false;
    }
    return (
        <div aria-labelledby="exampleModalLabel" aria-hidden="true" onClick={(e) => modalClick(e)}>
            <div className="modal-dialog modal-xxl">
                <div
                    className="modal fade"
                    id={"exampleModal" + props.id}
                    tabIndex="-1"
                    data-bs-backdrop="static"
                    data-bs-keyboard="false"
                >
                    <div className="modal-dialog modal-xxl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <div className="col-1" id=""></div>
                                <div className="col-10 modal-title-div">
                                    <span className="modal-title" id="exampleModalLabel">
                                        {props.resource.name}
                                    </span>
                                </div>
                                <div className="col-1 close-modal-div">
                                    <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                    ></button>
                                </div>
                            </div>
                            <div className="modal-body d-flex">
                                <div className="modal-div">
                                    <ResourceInfo
                                        id={props.resource.id}
                                        schedule={store.schedule}
                                        res={props.resource}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer resource-card-text justify-content-center">
                                <p>
                                    Is there a problem with this information? {""}
                                    <Link to="/Contact">Let us know</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
