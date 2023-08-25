import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

const Create = () => {
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);
    const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

    const categories = [
        { id: 'F', value: 'food', label: 'Food' },
        { id: 'Sh', value: 'shelter', label: 'Shelter' },
        { id: 'H', value: 'health', label: 'Health' },
        { id: 'Hy', value: 'hygiene', label: 'Hygiene' },
        { id: 'Wi', value: 'wifi', label: 'WiFi' },
        { id: 'C', value: 'crisis', label: 'Crisis Support' },
        { id: 'Su', value: 'substance', label: 'Substance Support' },
        { id: 'B', value: 'bathroom', label: 'Bathroom' },
        { id: 'Le', value: 'legal', label: 'Legal Services' },
        { id: 'Sex', value: 'sex', label: 'Sexual Health' },
        { id: 'Me', value: 'mental', label: 'Mental Health' },
        { id: 'Wo', value: 'women', label: 'Women' },
        { id: 'Y', value: 'youth', label: 'Youth' },
        { id: 'Sn', value: 'seniors', label: 'Seniors' },
        { id: 'Lg', value: 'lgbtq', label: 'LGBTQ' },
    ];

    const [formData, setFormData] = useState({
        name: "",
        address: "",
        phone: "",
        category: "",
        website: "",
        description: "",
        latitude: "",
        longitude: "",
        image: "",
        image2: "",
        days: {
            monday: { start: "", end: "" },
            tuesday: { start: "", end: "" },
            wednesday: { start: "", end: "" },
            thursday: { start: "", end: "" },
            friday: { start: "", end: "" },
            saturday: { start: "", end: "" },
            sunday: { start: "", end: "" },
        },
    });

    console.log("FORM DATA", formData)

    function handleSubmit(e) {
        e.preventDefault();
        actions.createResource(formData);
        alert("Resource Created");
        resetForm();
        navigate("/");
    }

    const handleChange = (field, value) => {
        setFormData(prevData => ({ ...prevData, [field]: value }));
    };

    const handleTimeChange = (day, timeType, value) => {
        setFormData(prevData => ({
            ...prevData,
            days: {
                ...prevData.days,
                [day]: {
                    ...prevData.days[day],
                    [timeType]: value
                }
            }
        }));
    };

    const resetForm = () => {
        setFormData({
            ...formData,
            name: "",
            address: "",
            phone: "",
            category: "",
            website: "",
            description: "",
            latitude: "",
            longitude: "",
            image: "",
            image2: ""
        });
    };

    return (
        <div className="form-container">
            <form className="geo-form" onSubmit={handleSubmit}>

                <div className="input-group">
                    <label htmlFor="name">Name</label>
                    <input
                        className="geo-input"
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Resource Name"
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="address">Address</label>
                    <input
                        className="geo-input"
                        id="address"
                        name="address"
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleChange("address", e.target.value)}
                        placeholder="Resource Address"
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        className="geo-input"
                        id="description"
                        rows="3"
                        value={formData.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                    ></textarea>
                </div>

                <div className="input-group">
                    <label htmlFor="image">image 1</label>
                    <input
                        className="geo-input"
                        id="image"
                        name="image"
                        type="text"
                        value={formData.image}
                        onChange={(e) => handleChange("image", e.target.value)}
                        placeholder="URL for image 1"
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="image2">image 2</label>
                    <input
                        className="geo-input"
                        id="image2"
                        name="image2"
                        type="text"
                        value={formData.image2}
                        onChange={(e) => handleChange("image2", e.target.value)}
                        placeholder="URL for image 2"
                    />
                </div>

                <div className="input-group">
                    {categories.map(resource => (
                        <div key={resource.id} className="radio-group">
                            <input
                                type="radio"
                                name="category"
                                id={`resource${resource.id}`}
                                value={resource.value}
                                checked={formData.category === resource.value}
                                onChange={() => handleChange("category", resource.value)}
                            />
                            <label htmlFor={`resource${resource.id}`}>
                                {resource.label}
                            </label>
                        </div>
                    ))}
                </div>

                {daysOfWeek.map(day => (
                    <div key={day} className="input-group time-group">
                        <label htmlFor={`${day}Start`}>{day.charAt(0).toUpperCase() + day.slice(1)} from </label>
                        <input
                            className="geo-input time-input"
                            type="time"
                            id={`${day}Start`}
                            name={`${day}Start`}
                            value={formData.days[day].start}
                            onChange={(e) => handleTimeChange(day, "start", e.target.value)}
                        />
                        <span> until </span>
                        <input
                            className="geo-input time-input"
                            type="time"
                            id={`${day}End`}
                            name={`${day}End`}
                            value={formData.days[day].end}
                            onChange={(e) => handleTimeChange(day, "end", e.target.value)}
                        />
                    </div>
                ))}

                <div className="input-group">
                    <label htmlFor="latitude">Latitude</label>
                    <input
                        className="geo-input"
                        id="latitude"
                        name="latitude"
                        type="text"
                        value={formData.latitude}
                        onChange={(e) => handleChange("latitude", e.target.value)}
                        title="Provide the latitude"
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="longitude">Longitude</label>
                    <input
                        className="geo-input"
                        id="longitude"
                        name="longitude"
                        type="text"
                        value={formData.longitude}
                        onChange={(e) => handleChange("longitude", e.target.value)}
                        title="Provide the longitude"
                    />
                </div>

                <button className="geo-button" type="submit">Submit</button>

            </form>
        </div>
    );
};

export default Create;