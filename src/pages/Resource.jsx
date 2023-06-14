import React, { useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import { ResourceInfo } from "../component/ResourceInfo.jsx";
import { SimpleMap2 } from "../component/SimpleMap2.jsx";

const resource = () => {
  const { store, actions } = useContext(Context);
  const params = useParams();

  console.log("pARAMS NAME", params.id)
  console.log("search reslts", store.searchResults)

  let resourceId = params.id;
  let resourceData = store.searchResults.filter((elm) => {
    if (elm.id == resourceId) {
      console.log("elm", elm)
      return elm;
    }
  });

  return (

    <div className="offering-details-page">

      {resourceData.map((items) => (
        <div className="details" key={items.id}>

          <ResourceInfo
            id={items.id}
            name={items.name}
            description={items.description}
            address={items.address}
            phone={items.phone}
            category={items.category}
            website={items.website}
            picture={items.picture}
            image={items.image}
            image2={items.image2}
            schedule={items.schedule}
            latitude={items.latitude}
            longitude={items.longitude}
          />
        </div>
      ))}

      {/* <div className="row mt-5">
        <SimpleCommentList id={resourceData[0].id} />
      </div>
      <div className="row">
        <SimpleCommentForm id={resourceData[0].id} />
      </div> */}
    </div>
  );
};
export default resource;
