"use client";
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import ResourceCard from "../component/ResourceCard.jsx";

const UserProfile = () => {
  const { store, actions } = useContext(Context);

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
      </div>
    </div>
  );
};

export default UserProfile;
