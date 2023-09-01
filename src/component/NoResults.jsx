import React from "react";

export const NoResults = () => {

    return (
        <div className="my-resource-card" >
            <div className="">
                <div className="resource-card-header">
                    <div className="card-title-div">
                        <p className="resource-title">No Results</p>
                        <div className="">
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </div>
                    </div>
                </div>
                <div className="card-image-container">
                    {/* <iframe src="https://giphy.com/embed/GmWeN9bM2VCIlxoIfw" width="100%" height="auto" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/infinity-spiral-psyshow-GmWeN9bM2VCIlxoIfw">via GIPHY</a></p> */}
                    {/* <img className="card-img" src={props.item.image} alt="profile picture" /> */}
                </div>
            </div>
        </div>
    );
}
