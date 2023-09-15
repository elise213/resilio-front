import React from "react";

const Loading = ({ name }) => {
    return (
        <div className="my-resource-card" >
            <div>
                <div className="resource-card-header">
                    {name === "locating" ? (
                        <div className="">
                            <p>
                                <i className="fa-solid fa-bullseye"></i>
                                Finding Your Location...
                                {/* <i className="fa-solid fa-bullseye"></i> */}
                            </p>
                            <p>
                                Please Wait
                            </p>
                        </div>) : ""
                    }
                    {name === "loading" ? (
                        <div className="">
                            <p>
                                Loading Resources...
                            </p>
                        </div>) : ""
                    }
                    {name === "none" ? (
                        <div>
                            <p>
                                No Results
                            </p>
                        </div>
                    ) : ""
                    }
                </div>
            </div>
        </div >
    );
}

export default Loading;