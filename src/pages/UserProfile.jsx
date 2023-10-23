"use client";
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import ResourceCard from "../component/ResourceCard.jsx";

const UserProfile = () => {
  const { store, actions } = useContext(Context);

  // useEffect(() => {
  //   actions.setOfferings();
  // }, []);

  return (
    <div className="profile-container">
      <div className="user-profile-container">
        <div className="favorites-container">
          <p className="your-favorite-resources text-center">
            Your Favorite Resources
          </p>
          <div className="favorites-col">
            <ul className="favorites-list" style={{ listStyleType: "none" }}>
              {store.favorites.map((result, i) => (
                <li key={i}>
                  <ResourceCard
                    category={result.category}
                    key={result.id}
                    name={result.name}
                    logo={result.logo}
                    image={result.image}
                    description={result.description}
                    id={result.id}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* <div className="favorites-container">
          <p className="your-favorite-resources text-center">
            Your Favorite Free Things
          </p>
          <div className="favorites-col">
            <ul className="favorites-list" style={{ listStyleType: "none" }}>
              {console.log("favoriteOfferings", store.favoriteOfferings)}
              {store.favoriteOfferings.map((result, i) => (
                <li key={i}>
                  <ResourceCard
                    category={result.category}
                    name={result.title}
                    image={result.image}
                    link={"/offering/" + result.offering_id}
                    type="offering"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default UserProfile;
