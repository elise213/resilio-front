import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import { ResourceInfo } from "../component/ResourceInfo.jsx";

const Resource = () => {
  const { store, actions } = useContext(Context);
  const params = useParams();

  let resourceId = params.id;
  let resourceData = store.searchResults.filter((elm) => {
    if (elm.id === resourceId) {
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
export default Resource;
