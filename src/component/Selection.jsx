import React, { useContext } from 'react'
import { Context } from "../store/appContext";

const Selection = ({ handleAllKinds, allKinds, toggleResource, moreOpen, resources }) => {
    const { store, actions } = useContext(Context);
    return (
        <div className="selection">
            {store.RESOURCE_OPTIONS.map(option => {
                if (option.id === "allKinds") {
                    return (
                        <div className="day-column" key="allKinds">
                            <div className="my-form-check">
                                <input
                                    className="my-input"
                                    type="checkbox"
                                    id="allKinds"
                                    value="allKinds"
                                    name="selection"
                                    checked={allKinds}
                                    onChange={handleAllKinds}
                                />
                                <label className="my-label" htmlFor="allKinds">
                                    Everything
                                </label>
                            </div>
                        </div>
                    );
                }
                const moreOpenIds = [
                    "hygiene", "crisis", "substance", "work", "bathroom",
                    "wifi", "mental", "sex", "legal", "lgbtq", "women", "seniors", "youth"
                ];
                if (moreOpenIds.includes(option.id) && !moreOpen) {
                    return null; // don't render the checkbox
                }
                return (
                    <div className="day-column" key={option.id}>
                        <div className="my-form-check">
                            <input
                                className="my-input"
                                type="checkbox"
                                id={option.id}
                                value={option.id}
                                name="selection"
                                checked={resources[option.id]}
                                onChange={() => toggleResource(option.id)}
                            />
                            <label className="my-label" htmlFor={option.id}>
                                {option.label}
                            </label>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}

export default Selection
