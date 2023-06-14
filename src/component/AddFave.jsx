import React, { useContext, useState, useEffect, createContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

const AddFave = (props) => {
    const { store, actions } = useContext(Context);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isFav, setIsFav] = useState(true);
    const token = sessionStorage.getItem("token");

    useEffect(() => {
        // Check if the current offering or resource is a favorite
        console.log("TYPE", props.type)
        if (props.type === "resource") {
            store.favorites.forEach((fave) => {
                if (fave.name == props.name) {
                    setIsFavorite(true)
                }
            })
        }
        if (props.type === "offering") {
            store.favoriteOfferings.forEach((fave) => {
                if (fave.title == props.name) {
                    setIsFavorite(true)
                }
            })
        }
    }, [store.favorites, store.favoriteOfferings]);

    const handleAddToFavorites = () => {
        if (props.type === "resource") {
            actions.addFavorite(props.name);
        } else if (props.type === "offering") {
            actions.addFavoriteOffering(props.name);
        }
        setIsFavorite(true);
        setIsFav((state) => !state);
    };

    const handleRemoveFromFavorites = () => {
        if (props.type === "resource") {
            actions.removeFavorite(props.name);
        } else if (props.type === "offering") {
            actions.removeFavoriteOffering(props.name);
        }
        setIsFavorite(false);
        setIsFav((state) => !state);
    };

    return (
        <div>
            {token ? (
                <button className="fave-button colored-heart" onClick={!isFavorite ? handleAddToFavorites : handleRemoveFromFavorites}>
                    {!isFavorite ? (<i className="fa-regular fa-heart"></i>) : (<i className="fa-solid fa-heart"></i>)}
                </button>
            ) : null}
        </div>
    );
};

export default AddFave;
