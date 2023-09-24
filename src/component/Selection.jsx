import React, { useContext } from 'react';
import { Context } from "../store/appContext";
import styles from "../styles/selection.css"

const Selection = ({
    handleAllKinds,
    allKinds,
    toggleResource,
    moreOpen,
    resources,
    filterByGroup,
    days,
    handleEvent,
    setMoreOpen,
    setFilterByGroup,
    setDropdownOpen,
    handleDontFilterByDay,
    dropdownOpen,
    handleAllGroups,
    allGroups

}) => {
    const { store, actions } = useContext(Context);

    const moreOpenIds = ["food", "health", "shelter", "hygiene", "crisis", "substance", "work", "bathroom", "wifi", "mental", "sex", "legal"];
    const demoIds = ["lgbtq", "women", "seniors", "youth"];

    return (
        <div className="selection">
            {/* Conditionally render Resource Options */}
            <div className="center">
                <button
                    className={`my-schedule-button ${moreOpen ? 'closed' : ''}`} onClick={() => {
                        setMoreOpen(!moreOpen);
                        if (moreOpen) handleAllKinds();
                    }}
                >
                    {moreOpen ? "X" : "Filter By Category"}
                </button>

                {moreOpen &&
                    <div className="more-open-ids">
                        {/* All Kinds Checkbox */}
                        <div className="day-row">
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
                                <label className="my-label" htmlFor="allKinds">All Resources</label>
                            </div>
                        </div>
                        {/* Remaining Checkboxes */}
                        {moreOpenIds.map(optionId => {
                            const option = store.RESOURCE_OPTIONS.find(o => o.id === optionId);
                            return option ? (
                                <div className="day-row" key={option.id}>
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
                                        <label className="my-label" htmlFor={option.id}>{option.label}</label>
                                    </div>
                                </div>
                            ) : null;
                        })}
                    </div>
                }
            </div>

            {/* Conditionally render Demographic Options */}
            <div className="center">
                <button
                    className={`my-schedule-button ${filterByGroup ? 'closed' : ''}`}
                    onClick={() => setFilterByGroup(!filterByGroup)}
                >
                    {filterByGroup ? "X" : "Filter by Demographic"}
                </button>

                {filterByGroup &&
                    <div className="demo-ids">
                        {/* All Groups Checkbox */}
                        <div className="day-row">
                            <div className="my-form-check">
                                <input
                                    className="my-input3"
                                    type="checkbox"
                                    id="allGroups"
                                    value="allGroups"
                                    name="selection"
                                    checked={allGroups}
                                    onChange={handleAllGroups}
                                />
                                <label className="my-label" htmlFor="allGroups">All Groups</label>
                            </div>
                        </div>
                        {/* Remaining Checkboxes */}
                        {demoIds.map(optionId => {
                            const option = store.RESOURCE_OPTIONS.find(o => o.id === optionId);
                            return option ? (
                                <div className="day-row" key={option.id}>
                                    <div className="my-form-check">
                                        <input
                                            className="my-input3"
                                            type="checkbox"
                                            id={option.id}
                                            value={option.id}
                                            name="selection"
                                            checked={resources[option.id]}
                                            onChange={() => toggleResource(option.id)}
                                        />
                                        <label className="my-label" htmlFor={option.id}>{option.label}</label>
                                    </div>
                                </div>
                            ) : null;
                        })}
                    </div>
                }
            </div>

            {/* Conditionally render Day Selection */}
            <div className="center">
                <button
                    className={`my-schedule-button ${dropdownOpen ? 'closed' : ''}`}
                    onClick={() => {
                        if (dropdownOpen) {
                            handleDontFilterByDay();
                        }
                        setDropdownOpen(!dropdownOpen);
                    }}
                >
                    {dropdownOpen ? "X" : "Filter By Day"}
                </button>

                {dropdownOpen &&
                    <div className="day-ids">
                        {/* Any Day Checkbox */}
                        <div className="day-row">
                            <div className="my-form-check">
                                <input
                                    className="my-input2"
                                    type="checkbox"
                                    id="allDays"
                                    value="allDays"
                                    onChange={() => handleEvent("allDays")}
                                    checked={!Object.values(days || {}).some(v => v)}
                                />
                                <label className="my-label" htmlFor="allDays">Any Day</label>
                            </div>
                        </div>
                        {/* Remaining Checkboxes */}
                        {store.daysColumns.flatMap((column, index) =>
                            column.map(day => {
                                if (day === "allDays") return null;  // skip if it's "Any Day"
                                return (
                                    <div key={day} className="day-row">
                                        <div className="my-form-check">
                                            <input
                                                className="my-input2"
                                                type="checkbox"
                                                id={day}
                                                value={day}
                                                onChange={() => handleEvent(day)}
                                                checked={(days && days[day]) || false}
                                            />
                                            <label className="my-label" htmlFor={day}>
                                                {day.charAt(0).toUpperCase() + day.slice(1)}
                                            </label>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                }
            </div>
        </div>
    );
};

export default Selection;





