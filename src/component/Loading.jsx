import React from "react";

export const Loading = () => {
    return (
        <div className="my-resource-card" >
            <div>
                <div className="resource-card-header">
                    <div className="card-title-div">
                        <p className="resource-title">Loading</p>
                        <div>
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </div>
                    </div>
                </div>
                <div className="card-image-container">
                </div>
            </div>
        </div>
    );
}
