import React, { useState, useContext, useCallback, useEffect } from "react";
import { Context } from "../store/appContext";
import ResourceCard from "../component/ResourceCard";
import Modal from "../component/Modal";
import Styles from "../styles/favorites.css";
import { Link } from "react-router-dom";

const Favorites = () => {
  const { store, actions } = useContext(Context);

  console.log("favorites", store.favorites);
  return (
    <>
      <div className="favorites-page">
        <p className="close-modal">
          <Link to={`/`}>
            <span className="material-symbols-outlined">arrow_back_ios</span>
            Back to Search
          </Link>
        </p>
        <div className="scroll-favorites">
          <p style={{ marginTop: "40px" }}>YOUR FAVORITE RESOURCES</p>
          <ul>
            {Array.isArray(store.favorites) &&
              store.favorites.map((resource, index) => (
                <ResourceCard key={`${resource.id}-${index}`} item={resource} />
              ))}
          </ul>

          {store.modalIsOpen && (
            <>
              <div
                className="resilio-overlay"
                onClick={() => {
                  actions.closeModal();
                  document.body.classList.remove("modal-open");
                }}
              ></div>
              <div className="modal-div">
                <Modal />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Favorites;
