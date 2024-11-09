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
              {store.favorites.map((resource, index) => (
                <li key={i}>
                  <ResourceCard
                    number={index + 1}
                    key={resource.id}
                    item={resource}
                    openModal={openModal}
                    closeModal={closeModal}
                    modalIsOpen={modalIsOpen}
                    setModalIsOpen={setModalIsOpen}
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
