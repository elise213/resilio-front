import React from "react";

const Loading = ({ name }) => {

    console.log("name", name);

    return (
        <div className="my-resource-card" >
            <div>
                <div className="resource-card-header">
                    {name === "locating" ? (
                        <div className="card-title-div">
                            <i className="fa-solid fa-bullseye"></i> Locating <i className="fa-solid fa-bullseye"></i>
                        </div>) : ""
                    }
                    {name === "loading" ? (
                        <div className="card-title-div">
                            ...Loading...
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