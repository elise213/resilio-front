import React, { useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import { ResourceInfo } from "../component/ResourceInfo.jsx";
import { SimpleMap2 } from "../component/SimpleMap2.jsx";

const resource = () => {
  const { store, actions } = useContext(Context);
  const params = useParams();

  let resourceId = params.id;
  let resourceData = store.searchResults.filter((elm) => {
    if (elm.id == resourceId) {
      console.log("elm", elm)
      return elm;
    }
  });

  return (

    <div className="offering-details-page">
      {store.schedules}
      {resourceData.map((items) => {
        return (
          <div className="details" key={items.id}>
            <ResourceInfo
              res={items}
            />
          </div>
        );
      })}

    </div>
  );
};
export default resource;
