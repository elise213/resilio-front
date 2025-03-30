import React, { useEffect, useRef, useState } from "react";

const SmartPlacesAutocomplete = ({
  onSelect,
  placeholder,
  defaultValue = "",
}) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [localValue, setLocalValue] = useState(defaultValue);
  const [ready, setReady] = useState(false);

  // Wait until Google Maps Places is available
  useEffect(() => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      const interval = setInterval(() => {
        if (window.google?.maps?.places) {
          console.log("✅ Google Places Library Ready");
          setReady(true);
          clearInterval(interval);
        }
      }, 200);

      return () => clearInterval(interval);
    } else {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready || !inputRef.current) return;

    if (!autocompleteRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          componentRestrictions: { country: ["us"] },
          fields: ["geometry", "formatted_address"],
        }
      );

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        if (place.geometry) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const address = place.formatted_address;
          setLocalValue(address);
          onSelect({ address, latitude: lat, longitude: lng });
        }
      });
    }

    if (defaultValue) {
      inputRef.current.value = defaultValue;
      setLocalValue(defaultValue);
    }
  }, [ready, defaultValue, onSelect]);

  if (!ready) return <div>Loading address autocomplete...</div>;

  return (
    <input
      ref={inputRef}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      placeholder={placeholder || "Type address"}
      className="geo-input"
    />
  );
};

export default SmartPlacesAutocomplete;
