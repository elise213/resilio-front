import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';


const Edit = () => {
    const { id } = useParams();
    const apiKey = import.meta.env.VITE_GOOGLE;
    const [isGoogleMapsLoaded, setGoogleMapsLoaded] = useState(false);
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);
    const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const initialDaysState = daysOfWeek.reduce((acc, day) => {
        acc[day] = { start: "", end: "" };
        return acc;
    }, {});
    const initialFormData = {
        name: "",
        address: "",
        phone: "",
        category: [],
        website: "",
        description: "",
        latitude: null,
        longitude: null,
        image: "",
        image2: "",
        days: initialDaysState,
    };
    const [formData, setFormData] = useState(initialFormData || {});

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

    useEffect(() => {
        const fetchResourceData = async () => {
            try {
                const data = await actions.getResource(id);
                console.log("data", data);
                if (data) {
                    setFormData(prevData => ({
                        ...initialFormData,
                        ...data,
                        category: data.category ? data.category.split(", ") : [], // Ensuring category is an array
                    }));
                    console.log(formData)
                } else {
                    console.error("Data is null");
                }
            } catch (error) {
                console.error("Error fetching the resource data:", error);
            }
        };
        fetchResourceData();
    }, [actions, id]);

    useEffect(() => {
        // This will run only if the address changes
        if (formData.address) {
            handleSelect(formData.address);
        }
    }, [formData.address]);

    const handleSelect = async address => {
        handleChange("address", address);
        try {
            const results = await geocodeByAddress(address);
            const latLng = await getLatLng(results[0]);
            handleChange("latitude", latLng.lat ? latLng.lat.toString() : null);
            handleChange("longitude", latLng.lng ? latLng.lng.toString() : null);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let categoryArray;
        if (Array.isArray(formData.category)) {
            categoryArray = formData.category;
        } else if (typeof formData.category === 'string') {
            categoryArray = [formData.category];
        } else {
            console.error("formData.category is neither an array nor a string:", formData.category);
            return;
        }

        const categoryString = categoryArray.join(", ");

        const modifiedFormData = {
            ...formData,
            category: categoryString,
            days: Object.fromEntries(Object.entries(formData.days).map(([day, times]) => [
                day,
                {
                    start: formatTime(times.start),
                    end: formatTime(times.end),
                },
            ])),
        };
        console.log("Submitting with id: ", id);
        try {
            await actions.editResource(id, modifiedFormData, navigate);
            alert("Resource Updated");
            resetForm();
            navigate("/");
        } catch (error) {
            console.error("Error updating the resource:", error);
        }
    };


    const handleChange = (field, value) => {
        setFormData(prevData => ({ ...prevData, [field]: value }));
    };

    const handleCategoryChange = (value) => {
        setFormData(prevData => {
            if (prevData && prevData.category) {
                const hasCategory = prevData.category.includes(value);
                return {
                    ...prevData,
                    category: hasCategory ? prevData.category.filter(category => category !== value) : [...prevData.category, value]
                };
            } else {
                return {
                    ...prevData,
                    category: [value]
                };
            }
        });
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
        setFormData(initialFormData);
    };

    if (!formData) {
        return <div>Loading...</div>;
    }
    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => setGoogleMapsLoaded(true);
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, [apiKey]);

    const formatTime = (time) => {
        if (time) {
            const [hour, minute] = time.split(':');
            return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
        }
        return "";
    };

    console.log("form data", formData)
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
                        value={formData.name || ""}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Resource Name"
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="address">Address</label>
                    {isGoogleMapsLoaded && (
                        <PlacesAutocomplete
                            value={formData.address || ""}
                            onChange={(address) => handleChange("address", address)}
                            onSelect={handleSelect}
                        >
                            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                <div>
                                    <input
                                        {...getInputProps({
                                            className: 'geo-input',
                                            id: 'address',
                                            placeholder: 'Resource Address',
                                        })}
                                    />
                                    <div>
                                        {loading ? <div>Loading...</div> : null}
                                        {suggestions.map((suggestion, index) => {
                                            console.log(suggestions);
                                            const className = suggestion.active
                                                ? 'suggestion-item--active'
                                                : 'suggestion-item';
                                            return (
                                                <div
                                                    {...getSuggestionItemProps(suggestion, {
                                                        className,
                                                    })}
                                                    key={index}
                                                >
                                                    {suggestion.description}
                                                </div>
                                            );
                                        })}

                                    </div>
                                </div>
                            )}
                        </PlacesAutocomplete>)}
                </div>

                <div className="input-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        className="geo-input"
                        id="description"
                        rows="3"
                        value={formData.description || ""}
                        onChange={(e) => handleChange("description", e.target.value)}
                    ></textarea>
                </div>
                <div className="input-group">
                    <label htmlFor="website">Website</label>
                    <input
                        className="geo-input"
                        id="website"
                        name="website"
                        type="text"
                        value={formData.website || ""}
                        onChange={(e) => handleChange("website", e.target.value)}
                        placeholder="Resource Website URL"
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="image">image 1</label>
                    <input
                        className="geo-input"
                        id="image"
                        name="image"
                        type="text"
                        value={formData.image || ""}
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
                        value={formData.image2 || ""}
                        onChange={(e) => handleChange("image2", e.target.value)}
                        placeholder="URL for image 2"
                    />
                </div>

                <div className="input-group">
                    {categories.map(resource => (
                        <div key={resource.id} className="checkbox-group">
                            <input
                                type="checkbox"
                                name="category"
                                id={`resource${resource.id}`}
                                value={resource.value || ""}
                                checked={!!formData?.category?.includes(resource.value)}
                                onChange={() => handleCategoryChange(resource.value)}
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
                            value={formatTime(formData.days[day]?.start) || ""}
                            onChange={(e) => handleTimeChange(day, "start", e.target.value)}
                        />
                        <span> until </span>
                        <input
                            className="geo-input time-input"
                            type="time"
                            id={`${day}End`}
                            name={`${day}End`}
                            value={formatTime(formData.days[day]?.end) || ""}
                            onChange={(e) => handleTimeChange(day, "end", e.target.value)}
                        />
                    </div>
                ))}

                <button className="geo-button" type="submit">Update</button>

            </form>
        </div>
    );
};

export default Edit;


// {/* <div className="input-group">
//                     <label htmlFor="latitude">Latitude</label>
//                     <input
//                         className="geo-input"
//                         id="latitude"
//                         name="latitude"
//                         type="text"
//                         value={formData.latitude || ""}
//                         onChange={(e) => handleChange("latitude", e.target.value)}
//                         title="Provide the latitude"
//                     />
//                 </div>

//                 <div className="input-group">
//                     <label htmlFor="longitude">Longitude</label>
//                     <input
//                         className="geo-input"
//                         id="longitude"
//                         name="longitude"
//                         type="text"
//                         value={formData.longitude || ""}
//                         onChange={(e) => handleChange("longitude", e.target.value)}
//                         title="Provide the longitude"
//                     />
//                 </div> */}