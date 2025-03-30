import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useState } from "react";

export const useGoogleMapsLoader = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE,
      libraries: ["places", "geometry"],
    });

    loader
      .load()
      .then(() => {
        console.log("✅ Google Maps API Loaded");
        setLoaded(true);
      })
      .catch((err) => {
        console.error("Google Maps failed to load:", err);
      });
  }, []);

  return loaded;
};
