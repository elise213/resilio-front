import React, { useState, useContext, useEffect } from "react";
import styles from "../styles/selection.css";
import { Context } from "../store/appContext";
import Login from "./Login";
import ResourceCard from "./ResourceCard";
import { Switch, FormControlLabel, Tooltip, Icon } from "@mui/material";
import ResilioDropdown from "./ResilioDropdown";
import GeoLocationModal from "./geoLocationModal";
import AuthorizedToolbox from "./AuthorizedToolbox";

const Sidebar = ({
  layout,
  setLayout,
  categories,
  days,
  handleCategoryChange,
  handleDayChange,
  log,
  setLog,
  setIsFilterModalOpen,
  filteredResults2,
  handleBoundsChange,
  resetFilters,
  mapInstance,
  setMapInstance,
  mapsInstance,
  setMapsInstance,
}) => {
  const { store, actions } = useContext(Context);
  const [searchQuery, setSearchQuery] = useState("");
  const [isGeoModalOpen, setIsGeoModalOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState({
    category: false,
    day: false,
  });

  const filteredResources = (searchQuery) => {
    if (!searchQuery) return store.boundaryResults;

    const lowercasedQuery = searchQuery.toLowerCase();
    return store.boundaryResults.filter(
      (resource) =>
        resource.name.toLowerCase().includes(lowercasedQuery) ||
        (resource.description &&
          resource.description.toLowerCase().includes(lowercasedQuery)) ||
        (resource.category &&
          resource.category.toLowerCase().includes(lowercasedQuery))
    );
  };

  const handleToggleChange = (event) => {
    setLayout(event.target.checked ? "fullscreen-map" : "fullscreen-sidebar");
  };

  const authorizedUser = store.authorizedUser;

  useEffect(() => {
    console.log("🟡 Store loadingLocation:", store.loadingLocation);
    console.log("🟡 Store loading Result:", store.loadingLocation);
  }, [store.loadingLocation]);

  const CombinedFilters = ({
    categories = {},
    days = {},
    actions,
    searchQuery,
  }) => {
    if (!actions) {
      console.error("⚠️ Actions prop is missing in CombinedFilters!");
      return null;
    }

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    const activeCategories = Object.keys(categories).filter(
      (key) => categories[key]
    );
    const activeDays = Object.keys(days).filter((key) => days[key]);

    if (
      activeCategories.length === 0 &&
      activeDays.length === 0 &&
      !searchQuery
    )
      return null;

    return (
      <div className="active-filters">
        <p className="filter-title">Filtering by:</p>

        {searchQuery && (
          <div className="filter-group">
            <span className="filter-label">Search</span>
            <div className="filter-list">
              <div className="filter-item">
                {capitalize(searchQuery)}
                <button
                  className="remove-filter"
                  onClick={() => {
                    setSearchQuery("");
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}

        {activeCategories.length > 0 && (
          <div className="filter-group">
            <span className="filter-label">Category</span>
            <div className="filter-list">
              {activeCategories.map((category) => (
                <div key={category} className="filter-item">
                  {capitalize(category)}
                  <button
                    className="remove-filter"
                    onClick={() => {
                      handleCategoryChange(category);
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeDays.length > 0 && (
          <div className="filter-group">
            <span className="filter-label">Day</span>
            <div className="filter-list">
              {activeDays.map((day) => (
                <div key={day} className="filter-item">
                  {capitalize(day)}
                  <button
                    className="remove-filter"
                    onClick={() => {
                      handleDayChange(day);
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // const CombinedFilters = ({ categories = {}, days = {}, actions }) => {
  //   if (!actions) {
  //     console.error("⚠️ Actions prop is missing in CombinedFilters!");
  //     return null;
  //   }

  //   const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  //   const activeCategories = Object.keys(categories).filter(
  //     (key) => categories[key]
  //   );
  //   const activeDays = Object.keys(days).filter((key) => days[key]);

  //   if (activeCategories.length === 0 && activeDays.length === 0) return null;

  //   return (
  //     <div className="active-filters">
  //       <p className="filter-title">Filtering by:</p>

  //       {activeCategories.length > 0 && (
  //         <div className="filter-group">
  //           <span className="filter-label">Category</span>
  //           <div className="filter-list">
  //             {activeCategories.map((category) => (
  //               <div key={category} className="filter-item">
  //                 {capitalize(category)}
  //                 <button
  //                   className="remove-filter"
  //                   onClick={() => {
  //                     handleCategoryChange(category);
  //                   }}
  //                 >
  //                   ✕
  //                 </button>
  //               </div>
  //             ))}
  //           </div>
  //         </div>
  //       )}

  //       {activeDays.length > 0 && (
  //         <div className="filter-group">
  //           <span className="filter-label">Day</span>
  //           <div className="filter-list">
  //             {activeDays.map((day) => (
  //               <div key={day} className="filter-item">
  //                 {capitalize(day)}
  //                 <button
  //                   className="remove-filter"
  //                   onClick={() => {
  //                     handleDayChange(day);
  //                   }}
  //                 >
  //                   ✕
  //                 </button>
  //               </div>
  //             ))}
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   );
  // };

  return (
    <>
      <nav className={`new-navbar ${layout}`}>
        <div className="button-container-sidebar" style={{ display: "flex" }}>
          {!store.loginModalisOpen && (
            <FormControlLabel
              className="switcheroo"
              control={
                <Switch
                  checked={layout === "fullscreen-map"}
                  onChange={handleToggleChange}
                  color="primary"
                  size="small"
                />
              }
              label={layout === "fullscreen-map" ? "Map View" : "List View"}
              labelPlacement="end"
            />
          )}
          <div className="sidebar-dropdowns">
            <Login log={log} setLog={setLog} setLayout={setLayout} />
          </div>
        </div>

        <div className="logo-div">
          <img className="top-logo" src="/assets/OV.png" alt="Resilio Logo" />
        </div>

        {store.loadingResults ? (
          <div className="loading-alert">Loading...</div>
        ) : (
          ""
        )}
        {store.loadingLocation ? (
          <div className="loading-alert">Loading Location...</div>
        ) : (
          ""
        )}

        {!store.loadingResults ? (
          <div className="nav-div">
            <div className="side-by">
              {authorizedUser && <AuthorizedToolbox />}
              <ResilioDropdown />
              <div
                className="search-bar"
                style={{ border: "1px solid black", borderRadius: "2px" }}
              >
                <span className="material-symbols-outlined search-icon">
                  search
                </span>
                <input
                  style={{ width: "100%", border: "none", padding: "1px" }}
                  type="text"
                  placeholder=""
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {/* </Tooltip> */}

              <Tooltip title="Filter Resources" arrow>
                <span
                  onClick={() => setIsFilterModalOpen(true)}
                  className="material-symbols-outlined"
                  style={{
                    cursor: "pointer",
                    color: "black",
                    fontSize: "22px",
                  }}
                >
                  tune
                </span>
              </Tooltip>

              <Tooltip title="Find My Location" arrow>
                <Icon
                  onClick={() => setIsGeoModalOpen(true)}
                  style={{ cursor: "pointer" }}
                  sx={{ fontSize: 20 }}
                >
                  my_location
                </Icon>
              </Tooltip>
            </div>
            <CombinedFilters
              categories={categories}
              days={days}
              actions={actions}
              searchQuery={searchQuery}
            />
            {/* <div className="list-container">
              <ul>
                {(Object.values(categories).some(Boolean) ||
                Object.values(days).some(Boolean)
                  ? filteredResults2 // use filtered only
                  : store.boundaryResults || []
                ).map((resource, index) => (
                  <ResourceCard key={resource.id || index} item={resource} />
                ))}
              </ul>
            </div> */}
            <div className="list-container">
              <ul>
                {(Object.values(categories).some(Boolean) ||
                Object.values(days).some(Boolean)
                  ? filteredResults2 // use filtered only
                  : filteredResources(searchQuery)
                ) // apply search filtering
                  .map((resource, index) => (
                    <ResourceCard key={resource.id || index} item={resource} />
                  ))}
              </ul>
            </div>
          </div>
        ) : (
          ""
        )}
        {store.loadingRestults == false && (
          <p className="no-results">No results found.</p>
        )}
      </nav>
      {isGeoModalOpen && (
        <>
          <div
            className="resilio-overlay"
            onClick={() => {
              setIsGeoModalOpen(false);
              document.body.classList.remove("modal-open");
            }}
          ></div>
          <GeoLocationModal
            setIsGeoModalOpen={setIsGeoModalOpen}
            resetFilters={resetFilters}
            mapInstance={mapInstance}
            setMapInstance={setMapInstance}
            mapsInstance={mapsInstance}
            setMapsInstance={setMapsInstance}
            handleBoundsChange={handleBoundsChange}
          />
        </>
      )}
    </>
  );
};

export default Sidebar;
