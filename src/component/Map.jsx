import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import { Context } from "../store/appContext";
import GoogleMapReact from "google-map-react";
import Styles from "../styles/map.css";
import ResourceCard from "./ResourceCard";
import { debounce } from "lodash";
import { useIsVisible } from "../hooks/isVisible";

const Map = ({
  layout,
  handleBoundsChange,
  city,
  userLocation,
  setHoveredItem,
  categories,
  days,
  mapCenter,
  mapZoom,
  filteredResults2,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE;
  const { store, actions } = useContext(Context);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const mapsInstanceRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapHasLoaded, setMapHasLoaded] = useState(false);

  const isMapVisible = useIsVisible(mapContainerRef);
  useEffect(() => {
    if (isMapVisible && mapInstanceRef.current && window.google?.maps) {
      console.log("👁 Map is visible — forcing resize...");
      setTimeout(() => {
        window.google.maps.event.trigger(mapInstanceRef.current, "resize");
      }, 200);
    }
  }, [isMapVisible]);

  // const handleMapIdle = () => {
  //   if (!mapInstanceRef.current) return;
  //   const bounds = mapInstanceRef.current.getBounds();
  //   if (!bounds) return;

  //   const ne = bounds.getNorthEast();
  //   const sw = bounds.getSouthWest();
  //   const newBounds = {
  //     ne: { lat: ne.lat(), lng: ne.lng() },
  //     sw: { lat: sw.lat(), lng: sw.lng() },
  //   };

  //   console.log("🟡 Map idle detected, new bounds:", newBounds);
  //   actions.setBoundaryResults(newBounds, categories, days);
  // };

  useEffect(() => {
    if (mapHasLoaded && mapInstanceRef.current) {
      console.log("🛠 Forcing map resize...");
      setTimeout(() => {
        if (window.google?.maps) {
          window.google.maps.event.trigger(mapInstanceRef.current, "resize");
        }
      }, 300);
    }
  }, [mapHasLoaded]);

  useEffect(() => {
    if (store.forcePan) {
      console.log("🚩 Forced pan triggered");
      if (mapInstanceRef.current && mapCenter) {
        mapInstanceRef.current.setCenter(
          new window.google.maps.LatLng(mapCenter.lat, mapCenter.lng)
        );
      }
      actions.setForcePan(false); // reset
    }
  }, [store.forcePan]);

  useEffect(() => {
    if (mapContainerRef.current && city?.center?.lat && city?.center?.lng) {
      setMapReady(true);
    }
  }, [city?.center?.lat, city?.center?.lng, mapContainerRef.current]);

  useEffect(() => {
    if (mapReady && mapInstanceRef.current) {
      setTimeout(() => {
        window.google?.maps?.event?.trigger(mapInstanceRef.current, "resize");
      }, 200);
    }
  }, [mapReady]);

  useEffect(() => {
    if (
      mapHasLoaded &&
      mapInstanceRef.current &&
      mapsInstanceRef.current &&
      !store.boundaryResults?.length &&
      !store.userLocation &&
      !lastBoundsRef.current
    ) {
      const bounds = mapInstanceRef.current.getBounds();
      if (!bounds) return;

      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();

      const newBounds = {
        ne: { lat: ne.lat(), lng: ne.lng() },
        sw: { lat: sw.lat(), lng: sw.lng() },
      };

      console.log("📦 Initial fallback fetch triggered:", newBounds);
      actions.setBoundaryResults(newBounds, categories, days);
    }
  }, [mapHasLoaded, store.userLocation]);

  const Marker = React.memo(
    ({ id, result, markerColor = "red", setHoveredItem }) => {
      const [isHovered, setIsHovered] = useState(false);
      const [closestCornerClass, setClosestCornerClass] = useState("");
      const markerRef = useRef(null);
      const { actions } = useContext(Context);

      const handleMouseEnter = (event) => {
        if (!markerRef.current) return;

        setIsHovered(true);
        setHoveredItem(result);

        const cursorX = event.clientX;
        const cursorY = event.clientY;
        const mapRect = markerRef.current
          .closest(".map-container")
          ?.getBoundingClientRect();
        if (!mapRect) return;

        const isCloserToTop = cursorY < (mapRect.top + mapRect.bottom) / 2;
        const isCloserToLeft = cursorX < (mapRect.left + mapRect.right) / 2;

        const positionClass = isCloserToTop
          ? isCloserToLeft
            ? "corner-top-left"
            : "corner-top-right"
          : isCloserToLeft
          ? "corner-bottom-left"
          : "corner-bottom-right";

        setClosestCornerClass(positionClass);
      };

      const handleMouseLeave = () => {
        setIsHovered(false);
        setHoveredItem(null);
      };

      return (
        <div
          ref={markerRef}
          className="marker"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => {
            if (!result) {
              console.error("Error: result is undefined for marker", id);
              return;
            }
            actions.setSelectedResource(result);
            actions.openModal();
          }}
          style={{
            position: "absolute",
            transform: "translate(-50%, -100%)",
            zIndex: isHovered ? 10 : 1,
          }}
        >
          <div className="marker-icon">
            <i
              className="fa-solid fa-map-pin"
              style={{
                fontSize: "28px",
                color: isHovered ? "lightgreen" : markerColor,
              }}
            ></i>
          </div>

          {isHovered && result && (
            <div
              className={`hover-card ${closestCornerClass}`}
              style={{
                background: "transparent",
                borderRadius: "6px",
                padding: "0px",
                zIndex: 100,
              }}
            >
              <ResourceCard key={result.id} item={result} />
            </div>
          )}
        </div>
      );
    },
    (prevProps, nextProps) => prevProps.id === nextProps.id
  );

  const createMapOptions = (maps) => ({
    scrollwheel: false,
  });

  const forcePanRef = useRef(false);

  useEffect(() => {
    if (!mapInstanceRef.current || !mapsInstanceRef.current || !mapCenter)
      return;

    const map = mapInstanceRef.current;
    const current = map.getCenter();
    const maps = mapsInstanceRef.current;
    const newLatLng = new maps.LatLng(mapCenter.lat, mapCenter.lng);

    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      current,
      newLatLng
    );

    if (!forcePanRef.current && distance < 10) return;

    console.log("📍 Panning to mapCenter:", mapCenter);

    map.setCenter(newLatLng);
  }, [mapCenter]);

  useEffect(() => {
    console.log("💡 Checking map dependencies:", {
      mapReady,
      mapInstance: !!mapInstanceRef.current,
      mapsInstance: !!mapsInstanceRef.current,
      userLocation,
    });

    if (
      !mapReady ||
      !mapInstanceRef.current ||
      !mapsInstanceRef.current ||
      !userLocation
    ) {
      console.warn("⚠️ Waiting for map to be ready and dependencies to exist.");
      return;
    }
    if (!google.maps?.geometry) {
      console.warn("Google Maps Geometry library is missing");
      return;
    }

    const map = mapInstanceRef.current;
    const maps = mapsInstanceRef.current;

    const currentCenter = map.getCenter();
    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      currentCenter,
      new maps.LatLng(userLocation.lat, userLocation.lng)
    );

    if (distance < 500) {
      console.log("🟢 Map already centered. Skipping movement.");
      return;
    }

    console.log("📍 Panning to user location...");
    map.setCenter(new maps.LatLng(userLocation.lat, userLocation.lng));
    map.setZoom(13);
  }, [userLocation, mapReady]);

  const handleApiLoaded = ({ map, maps }) => {
    if (!map || !maps) {
      console.error("❌ Map or Maps not loaded!");
      return;
    }

    console.log("✅ Google Maps API Loaded");

    mapInstanceRef.current = map;
    mapsInstanceRef.current = maps;
    actions.setMapInstance(map);
    actions.setMapsInstance(maps);
    setMapHasLoaded(true);
  };

  useEffect(() => {
    if (!mapInstanceRef.current || !mapsInstanceRef.current || !mapCenter)
      return;

    const map = mapInstanceRef.current;
    const current = map.getCenter();
    const maps = mapsInstanceRef.current;
    const newLatLng = new maps.LatLng(mapCenter.lat, mapCenter.lng);

    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      current,
      newLatLng
    );

    if (distance < 10) return;

    map.setCenter(newLatLng);
  }, [mapCenter]);

  useEffect(() => {
    return () => {
      mapInstanceRef.current = null;
      mapsInstanceRef.current = null;
      setMapReady(false); // clean slate
      console.log("🧹 Cleaned up map refs on unmount");
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && window.google?.maps) {
      setTimeout(() => {
        console.log("🧽 Forcing map redraw...");
        window.google.maps.event.trigger(mapInstanceRef.current, "resize");
      }, 300);
    }
  }, []);

  const MIN_BOUND_CHANGE_DELTA = 0.001; // adjustable sensitivity

  const boundsChangedSignificantly = (oldBounds, newBounds) => {
    if (!oldBounds) return true; // first time
    return (
      Math.abs(oldBounds.ne.lat - newBounds.ne.lat) > MIN_BOUND_CHANGE_DELTA ||
      Math.abs(oldBounds.ne.lng - newBounds.ne.lng) > MIN_BOUND_CHANGE_DELTA ||
      Math.abs(oldBounds.sw.lat - newBounds.sw.lat) > MIN_BOUND_CHANGE_DELTA ||
      Math.abs(oldBounds.sw.lng - newBounds.sw.lng) > MIN_BOUND_CHANGE_DELTA
    );
  };

  const lastBoundsRef = useRef(null);

  const skipNextRef = useRef(false);

  const currentZoomRef = useRef(null);

  const handleMapChange = useCallback(
    debounce(({ bounds, center, zoom }) => {
      if (!bounds || !bounds.ne || !bounds.sw) return;

      const newBounds = {
        ne: { lat: bounds.ne.lat, lng: bounds.ne.lng },
        sw: { lat: bounds.sw.lat, lng: bounds.sw.lng },
      };

      const zoomChanged = zoom !== currentZoomRef.current;
      currentZoomRef.current = zoom;

      if (
        !boundsChangedSignificantly(lastBoundsRef.current, newBounds) &&
        !zoomChanged
      ) {
        console.log(
          "🟣 Bounds and zoom changed insignificantly, skipping fetch."
        );
        return;
      }

      console.log("🟢 Map movement or zoom detected");
      lastBoundsRef.current = newBounds;
      actions.setBoundaryResults(newBounds, categories, days);
    }, 1000),
    [categories, days]
  );

  // const handleMapChange = useCallback(
  //   debounce(({ bounds }) => {
  //     if (skipNextRef.current) {
  //       console.log("⏩ Skipping fetch due to programmatic move.");
  //       skipNextRef.current = false;
  //       return;
  //     }

  //     if (!bounds || !bounds.ne || !bounds.sw) return;

  //     const newBounds = {
  //       ne: { lat: bounds.ne.lat, lng: bounds.ne.lng },
  //       sw: { lat: bounds.sw.lat, lng: bounds.sw.lng },
  //     };

  //     if (!boundsChangedSignificantly(lastBoundsRef.current, newBounds)) {
  //       console.log("🟣 Bounds changed insignificantly, skipping fetch.");
  //       return;
  //     }

  //     console.log("🟢 Significant map movement detected:", newBounds);
  //     lastBoundsRef.current = newBounds;
  //     actions.setBoundaryResults(newBounds, categories, days);
  //   }, 1000),
  //   [categories, days]
  // );

  // const handleMapChange = useCallback(
  //   debounce(({ bounds, center, zoom }) => {
  //     if (!bounds || !bounds.ne || !bounds.sw) return;

  //     const newBounds = {
  //       ne: { lat: bounds.ne.lat, lng: bounds.ne.lng },
  //       sw: { lat: bounds.sw.lat, lng: bounds.sw.lng },
  //     };

  //     if (!boundsChangedSignificantly(lastBoundsRef.current, newBounds)) {
  //       console.log("🟣 Bounds changed insignificantly, skipping fetch.");
  //       return;
  //     }

  //     console.log("🟢 Significant map movement detected:", newBounds);
  //     lastBoundsRef.current = newBounds;
  //     actions.setBoundaryResults(newBounds, categories, days);
  //   }, 1000), // debounce time
  //   [categories, days]
  // );

  // const defaultCenter = useMemo(
  //   () => ({
  //     lat: city?.center?.lat || 34.0522,
  //     lng: city?.center?.lng || -118.2437,
  //   }),
  //   [city.center]
  // );

  // const debouncedHandleBoundsChange = useMemo(
  //   () => debounce(handleBoundsChange, 1000), // or even 1500ms
  //   [handleBoundsChange]
  // );

  const filtersAreActive =
    Object.values(categories || {}).some(Boolean) ||
    Object.values(days || {}).some(Boolean);

  const listToRender = filtersAreActive
    ? filteredResults2 || []
    : store.boundaryResults || [];

  return (
    <div className={`map-frame`}>
      <div
        // key={`${layout}`}
        ref={mapContainerRef}
        className={`map-container${layout}`}
        style={{ height: "100%", width: "100%" }}
      >
        {mapCenter?.lat && (
          <GoogleMapReact
            bootstrapURLKeys={{
              key: import.meta.env.VITE_GOOGLE,
              libraries: ["places", "geometry"],
            }}
            key={`map`}
            options={createMapOptions}
            center={mapCenter}
            zoom={mapZoom}
            defaultZoom={11}
            onChange={handleMapChange}
            onGoogleApiLoaded={handleApiLoaded}
            yesIWantToUseGoogleMapApiInternals={true}
            ootstrapURLKeys={{ key: apiKey, libraries: ["places", "geometry"] }}
          >
            {listToRender.map((result, i) => (
              <Marker
                lat={result.latitude}
                lng={result.longitude}
                text={result.name}
                key={result.id || i}
                id={result.id}
                result={result}
                setHoveredItem={setHoveredItem}
              />
            ))}
            {userLocation && (
              <Marker
                lat={userLocation.lat}
                lng={userLocation.lng}
                text="You are here!"
                markerColor="maroon"
                setHoveredItem={setHoveredItem}
              />
            )}
          </GoogleMapReact>
        )}
      </div>
    </div>
  );
};

export default React.memo(Map);
