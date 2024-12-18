import React, { useState, useContext, useCallback, useEffect } from "react";
import { Context } from "../store/appContext";
import ResourceCard from "../component/ResourceCard";
import Modal from "../component/Modal";
import Styles from "../styles/favorites.css";
import { Link } from "react-router-dom";

const Favorites = () => {
  const { store, actions } = useContext(Context);

  return (
    <>
      <p className="close-modal">
        <Link to={`/`}>
          <span className="material-symbols-outlined">arrow_back_ios</span>
          Back to Search
        </Link>
      </p>
      <div className="scroll-favorites">
        <p style={{ marginTop: "50px" }}>YOUR FAVORITE RESOURCES</p>
        <ul>
          {Array.isArray(store.favorites) &&
            store.favorites.map((resource, index) => (
              <ResourceCard key={`${resource.id}-${index}`} item={resource} />
            ))}
        </ul>

        {store.modalIsOpen && (
          <div className="modal-div">
            <Modal />
          </div>
        )}
      </div>
    </>
  );
};

export default Favorites;
