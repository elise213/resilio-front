
import React, { useState, useContext } from "react";
// import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext"
import { ResourceInfo } from "./ResourceInfo"
// import { SimpleMap2 } from "./SimpleMap2"

const Modal = (props) => {
    const { store, actions } = useContext(Context);

    return (
        <div>
            <div className="modal-dialog modal-xxl">
                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-xxsl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <div className="col-3" id="">{""}</div>
                                <div className='col-6 modal-title-div'>
                                    <span className="modal-title" id="exampleModalLabel">{props.resource.name}</span>
                                </div>
                                <div className='col-3 close-modal-div'>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                            </div>

                            <div className="modal-body d-flex">
                                <div className="offering-details-page">
                                    <div className="details">
                                        <ResourceInfo
                                            id={props.resource.id}
                                            name={props.resource.name}
                                            description={props.resource.description}
                                            address={props.resource.address}
                                            phone={props.resource.phone}
                                            category={props.resource.category}
                                            website={props.resource.website}
                                            picture={props.resource.picture}
                                            image={props.resource.image}
                                            image2={props.resource.image2}
                                            schedule={store.schedule}
                                            latitude={props.resource.latitude}
                                            longitude={props.resource.longitude}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                {/* <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal
