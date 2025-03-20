const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      abortController: null,
      abortController2: null,
      avatarID: null,
      AuthorizedUserIds: [1, 3, 4],
      authorizedUser: false,
      aboutModalIsOpen: false,
      modalIsOpen: false,
      loginModalIsOpen: false,
      userLocation: {},
      donationModalIsOpen: false,
      contactModalIsOpen: false,
      boundaryResults: [],
      categorySearch: [],
      mapInstance: null,
      mapsInstance: null,
      loadingLocation: false,
      loadingResults: false,
      selectedResource: null,
      googleApiKey: import.meta.env.VITE_GOOGLE,
      bounds: null,
      averageRating: 0,
      comments: [],
      CATEGORY_OPTIONS: [
        { id: "food", value: "food", label: "Food" },
        { id: "health", value: "health", label: "Medical Care" },
        { id: "shelter", value: "shelter", label: "Shelter" },
        { id: "hygiene", value: "hygiene", label: "Showers" },
        { id: "crisis", value: "crisis", label: "Crisis Support" },
        { id: "mental", value: "mental", label: "Mental Health" },
        { id: "work", value: "work", label: "Work" },
        { id: "bathroom", value: "bathroom", label: "Bathrooms" },
        { id: "wifi", value: "wifi", label: "WiFi" },
        { id: "substance", value: "substance", label: "Drug Use" },
        { id: "sex", value: "sex", label: "Sexual Health" },
        { id: "legal", value: "legal", label: "Legal Support" },
        { id: "lgbtq", value: "lgbtq", label: "LGBTQ+" },
        { id: "women", value: "women", label: "Women" },
        { id: "seniors", value: "seniors", label: "Seniors" },
        { id: "babies", value: "babies", label: "Babies and Toddlers" },
        { id: "kids", value: "kids", label: "Youth < 18" },
        { id: "youth", value: "youth", label: "Youth 18-24" },
        { id: "vets", value: "vets", label: "Veterans" },
        { id: "migrant", value: "migrant", label: "Refugees & Migrants" },
      ],

      daysOfWeek: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],

      DAY_OPTIONS: [
        { id: "monday", label: "Monday" },
        { id: "tuesday", label: "Tuesday" },
        { id: "wednesday", label: "Wednesday" },
        { id: "thursday", label: "Thursday" },
        { id: "friday", label: "Friday" },
        { id: "saturday", label: "Saturday" },
        { id: "sunday", label: "Sunday" },
      ],
      checked: false,
      commentsList: [],
      current_front_url: import.meta.env.VITE_FRONTEND_URL,
      current_back_url: import.meta.env.VITE_BACKEND_URL,
      favorites: [],
      favoriteOfferings: [],
      isLargeScreen: false,
      is_org: null,
      latitude: null,
      longitude: null,
      loading: false,
      mapResults: [],
      name: null,
      offerings: [],
      token: null,
      user_id: null,
      schedules: [],
      selectedResource: [],
      losAngeles: [
        {
          center: { lat: 34.0522, lng: -118.2437 },
          bounds: {
            ne: { lat: 34.24086583325125, lng: -117.80047032470705 },
            sw: { lat: 33.86311337069103, lng: -118.68692967529368 },
          },
        },
      ],

      austin: [
        {
          center: { lat: 30.2672, lng: -97.7431 },
          bounds: {
            ne: { lat: 30.456076231280107, lng: -97.29987032470669 },
            sw: { lat: 30.07832376871989, lng: -98.18632967529331 },
          },
        },
      ],

      categoryCounts: {},
      dayCounts: {},
    },
    actions: {
      setMapInstance: (map) => {
        setStore({ mapInstance: map });
      },
      setMapsInstance: (maps) => {
        setStore({ mapsInstance: maps });
      },
      getMapInstance: () => getStore().mapInstance,
      getMapsInstance: () => getStore().mapsInstance,
      setStore: (newState) => {
        setStore((prevState) => ({ ...prevState, ...newState }));
      },
      updateBounds: (bounds) => {
        setStore({ bounds });
      },
      setSelectedResource: (resource) => {
        sessionStorage.setItem("selectedResource", JSON.stringify(resource));
        setStore({ selectedResource: resource });
      },

      openModal: () => {
        console.log("called from flux - open");
        setStore({ modalIsOpen: true });
      },

      closeModal: () => {
        setStore({ modalIsOpen: false });
      },

      openLoginModal: () => {
        console.log("called from flux - open login");
        setStore({ loginModalIsOpen: true });
      },

      closeLoginModal: () => {
        setStore({ loginModalIsOpen: false });
      },

      openAboutModal: () => {
        setStore({ aboutModalIsOpen: true });
      },

      closeAboutModal: () => {
        setStore({ aboutModalIsOpen: false });
      },

      openDonationModal: () => {
        setStore({ donationModalIsOpen: true });
      },

      closeDonationModal: () => {
        setStore({ donationModalIsOpen: false });
      },

      openContactModal: () => {
        setStore({ contactModalIsOpen: true });
      },

      closeContactModal: () => {
        setStore({ contactModalIsOpen: false });
      },

      setCategoryCounts: (categoryCounts) => {
        setStore({
          categoryCounts: categoryCounts,
        });
      },
      setDayCounts: (dayCounts) => {
        setStore({
          dayCounts: dayCounts,
        });
      },
      clearSelectedCategory: (category) => {
        setCategories((prevCategories) => {
          const updatedCategories = { ...prevCategories, [category]: false };

          setStore({ loadingResults: true });

          setBoundaryResults(city.bounds, updatedCategories, days)
            .then(() => setStore({ loadingResults: false }))
            .catch(() => actions.setStore({ loadingResults: false }));

          return updatedCategories;
        });
      },

      clearSelectedDay: (day) => {
        setDays((prevDays) => {
          const updatedDays = { ...prevDays, [day]: false };

          setStore({ loadingResults: true });

          setBoundaryResults(city.bounds, categories, updatedDays)
            .then(() => actions.setStore({ loadingResults: false }))
            .catch(() => actions.setStore({ loadingResults: false }));

          return updatedDays;
        });
      },

      debounce: (func, delay) => {
        let timerId;
        return (...args) => {
          clearTimeout(timerId);
          timerId = setTimeout(() => {
            func(...args);
          }, delay);
        };
      },

      checkAuthorizedUser: () => {
        const store = getStore();
        const userId = store.user_id; // Get user ID from store

        if (userId && store.AuthorizedUserIds.includes(userId)) {
          setStore({ authorizedUser: true });
          sessionStorage.setItem("authorizedUser", "true"); // ✅ Save in session storage
          console.log("✅ User is authorized.");
        } else {
          setStore({ authorizedUser: false });
          sessionStorage.setItem("authorizedUser", "false"); // ❌ Save in session storage
          console.log("❌ User is NOT authorized.");
        }
      },

      handleRemoveUserId: (userId) => {
        const store = getStore();

        // Check if the user exists in the AuthorizedUserIds list
        if (store.AuthorizedUserIds.includes(userId)) {
          const updatedList = store.AuthorizedUserIds.filter(
            (id) => id !== userId
          );

          setStore({ AuthorizedUserIds: updatedList });

          console.log(`🚨 User ID ${userId} removed from Authorized Users.`);
          Swal.fire(
            "Removed",
            `User ID ${userId} has been removed.`,
            "success"
          );
        } else {
          console.warn(`⚠️ User ID ${userId} not found in Authorized Users.`);
          Swal.fire("Error", `User ID ${userId} not found.`, "error");
        }
      },

      checkLoginStatus: async () => {
        const token = sessionStorage.getItem("token");
        const user_id = sessionStorage.getItem("user_id"); // Retrieve user_id
        const current_back_url = getStore().current_back_url;

        if (!token || !user_id) {
          console.warn("No token or user ID found, logging out user.");
          setStore({
            token: null,
            user_id: null,
            name: null,
            is_org: null,
            avatarID: null,
            favorites: [],
            is_logged_in: false,
            authorizedUser: false, // Reset authorized user status
          });
          return false;
        }

        try {
          console.log(`📡 Fetching user info for ID: ${user_id}`);
          const response = await fetch(
            `${current_back_url}/api/user/${user_id}`,
            {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          console.log("📥 Response Status:", response.status);

          if (!response.ok) {
            console.warn("Invalid token or user not found, logging out user.");
            // getActions().logout();
            return false;
          }

          const data = await response.json();
          console.log("✅ User info fetched successfully:", data);

          // Save user info in session storage
          sessionStorage.setItem("user_id", data.id);
          sessionStorage.setItem("name", data.name);
          sessionStorage.setItem("is_org", data.is_org);
          sessionStorage.setItem("avatar", data.avatarID);
          sessionStorage.setItem("favorites", JSON.stringify(data.favorites));
          sessionStorage.setItem("is_logged_in", true);

          // Update store with user details
          setStore({
            user_id: data.id,
            name: data.name,
            is_org: data.is_org,
            avatarID: data.avatarID,
            favorites: data.favorites || [],
            is_logged_in: true,
          });

          // ✅ Check if user is authorized
          const store = getStore();
          if (store.AuthorizedUserIds.includes(data.id)) {
            setStore({ authorizedUser: true });
            console.log("✅ User is authorized.");
          } else {
            setStore({ authorizedUser: false });
            console.log("❌ User is NOT authorized.");
          }

          return true;
        } catch (error) {
          console.error("🚨 Error checking login status:", error);
          return false;
        }
      },

      // checkLoginStatus: async () => {
      //   const token = sessionStorage.getItem("token");
      //   const current_back_url = getStore().current_back_url;

      //   if (!token) {
      //     // No token found, user is not logged in
      //     setStore({
      //       token: null,
      //       user_id: null,
      //       name: null,
      //       is_org: null,
      //       avatarID: null,
      //       favorites: [],
      //       is_logged_in: false,
      //     });
      //     return false;
      //   }

      //   try {
      //     const response = await fetch(`${current_back_url}/api/user-info`, {
      //       method: "GET",
      //       headers: { Authorization: `Bearer ${token}` },
      //     });

      //     if (response.status !== 200) {
      //       console.warn("Invalid token, logging out user.");
      //       getActions().logout();
      //       return false;
      //     }

      //     const data = await response.json();

      //     // Save user info in session storage
      //     sessionStorage.setItem("user_id", data.user_id);
      //     sessionStorage.setItem("name", data.name);
      //     sessionStorage.setItem("is_org", data.is_org);
      //     sessionStorage.setItem("avatar", data.avatarID);
      //     sessionStorage.setItem("favorites", JSON.stringify(data.favorites));
      //     sessionStorage.setItem("is_logged_in", true);

      //     // Update store with user details
      //     setStore({
      //       // token: token,
      //       user_id: data.user_id,
      //       name: data.name,
      //       is_org: data.is_org,
      //       avatarID: data.avatarID,
      //       favorites: data.favorites || [],
      //       is_logged_in: true,
      //     });

      //     return true;
      //   } catch (error) {
      //     console.error("Error checking login status:", error);
      //     // getActions().logout();
      //     return false;
      //   }
      // },

      processCategory: (category) => {
        let categories = category;
        if (typeof categories === "string" && categories.includes(",")) {
          categories = categories.split(",").map((cat) => cat.trim());
        } else if (typeof categories === "string") {
          categories = [categories];
        } else if (!Array.isArray(categories)) {
          categories = [];
        }
        return categories;
      },

      getFormattedSchedule: (schedule) => {
        const formattedSchedule = {};
        Object.keys(schedule).forEach((day) => {
          if (schedule[day] && schedule[day].start && schedule[day].end) {
            const start = formatTime(schedule[day].start);
            const end = formatTime(schedule[day].end);
            formattedSchedule[day] = `${start} - ${end}`;
          } else {
            formattedSchedule[day] = "Closed";
          }
        });
        return formattedSchedule;
      },

      formatTime: (time) => {
        if (!time || time.toLowerCase() === "closed") {
          return "Closed";
        }
        const [hour, minute] = time.split(":");
        const hourInt = parseInt(hour, 10);
        const isPM = hourInt >= 12;
        const formattedHour = isPM
          ? hourInt > 12
            ? hourInt - 12
            : hourInt
          : hourInt === 0
          ? 12
          : hourInt;
        return `${formattedHour}:${minute} ${isPM ? "PM" : "AM"}`;
      },

      // ________________________________________________________________LOGIN/TOKEN

      // getToken: () => {
      //   const token = sessionStorage.getItem("token");
      //   const favorites = JSON.parse(sessionStorage.getItem("favorites"));
      //   if (token && token.length) {
      //     setStore({ token: token, favorites: favorites || [] });
      //   }
      // },

      getToken: () => {
        const token = sessionStorage.getItem("token");
        // const favorites = JSON.parse(sessionStorage.getItem("favorites")) || [];
        // const user_id = sessionStorage.getItem("user_id");
        // const name = sessionStorage.getItem("name");
        // const is_org = sessionStorage.getItem("is_org");

        if (token && token.length) {
          setStore({
            token: token,
            // favorites: favorites,
            // user_id: user_id ? parseInt(user_id) : null,
            // name: name || null,
            // is_org: is_org ? parseInt(is_org) : null,
          });
        }
      },

      login: async (email, password) => {
        try {
          const current_back_url = getStore().current_back_url;
          const opts = {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
              password: password,
            }),
          };
          const response = await fetch(`${current_back_url}/api/login`, opts);

          if (response.status !== 200) {
            Swal.fire({
              icon: "error",
              title: "",
              text: "Incorrect email or password",
            });
            return false;
          }

          const data = await response.json();
          const fullFavorites = data.favorites.map((fav) => ({
            ...fav.resource,
          }));

          sessionStorage.setItem("token", data.access_token);
          sessionStorage.setItem("is_org", data.is_org);
          sessionStorage.setItem("name", data.name);
          sessionStorage.setItem("avatar", parseInt(data.avatar));
          sessionStorage.setItem("favorites", JSON.stringify(fullFavorites));
          sessionStorage.setItem("user_id", data.user_id);

          setStore({
            token: data.access_token,
            is_org: data.is_org,
            avatarID: data.avatar,
            name: data.name,
            favorites: fullFavorites,
            user_id: data.user_id,
          });

          Swal.fire({
            icon: "success",
            title: "Logged in Successfully",
          });

          return true;
        } catch (error) {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "Something went wrong",
            text: error.message,
          });

          return false;
        }
      },

      logout: () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("is_org");
        sessionStorage.removeItem("name");
        sessionStorage.removeItem("favorites");
        setStore({ token: null, is_org: null, name: null, favorites: null });

        Swal.fire({
          icon: "success",
          title: "Logged out Successfully",
        });
      },

      createUser: async (is_org, name, email, password, userAvatar) => {
        const current_back_url = getStore().current_back_url;
        const opts = {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            is_org: is_org,
            name: name,
            email: email,
            password: password,
            userAvatar: userAvatar,
          }),
        };
        try {
          const response = await fetch(
            current_back_url + "/api/createUser",
            opts
          );
          if (response.status >= 400) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "There has been an error while creating the user.",
            });
            return false;
          }
          const data = await response.json();
          if (data.status == "true") {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "User created successfully!",
            });
          }
          return true;
        } catch (error) {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `An error occurred: ${error.message}`,
          });
        }
      },

      resetPassword: async (newPassword) => {
        try {
          const current_back_url = getStore().current_back_url;
          const token = getStore().token;
          console.log("Token being sent:", token);
          console.log("Session Token:", sessionStorage.getItem("token"));

          const opts = {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              password: newPassword,
            }),
          };

          const response = await fetch(
            `${current_back_url}/api/change-password`,
            opts
          );

          if (response.status !== 200) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Failed to reset password",
            });
            return false;
          }

          const result = await response.json();
          console.log(result);

          Swal.fire({
            icon: "success",
            title: "Password Reset Successfully",
          }).then(() => {
            window.location.href = "/";
          });

          return true;
        } catch (error) {
          console.error("Error:", error);
          Swal.fire({
            icon: "error",
            title: "Something went wrong",
            text: error.message,
          });

          return false;
        }
      },

      getAllUsers: async () => {
        const current_back_url = getStore().current_back_url;
        try {
          const response = await fetch(`${current_back_url}/api/getAllUsers`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            console.error("Failed to fetch users:", response.status);
            return [];
          }

          const data = await response.json();
          return data.users || []; // Ensure it returns an array of users
        } catch (error) {
          console.error("Error fetching users:", error);
          return [];
        }
      },

      // ________________________________________________________________RESOURCES

      fetchResources: async (bounds) => {
        const store = getStore();

        if (!bounds || !bounds.ne || !bounds.sw) {
          console.error("❌ Error: Invalid bounds received:", bounds);
          return;
        }
        setStore({ loadingResults: true });
        console.log("📏 Received bounds:", bounds);

        const formattedBounds = {
          neLat: bounds.ne.lat,
          neLng: bounds.ne.lng,
          swLat: bounds.sw.lat,
          swLng: bounds.sw.lng,
        };

        console.log(
          "📡 Fetching resources with formatted bounds:",
          formattedBounds
        );

        try {
          const response = await fetch(
            `${store.current_back_url}/api/getBResults`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formattedBounds),
            }
          );

          console.log("📥 Response status:", response.status);

          if (!response.ok) {
            const text = await response.text();
            console.error("❌ Backend request failed. Response:", text);
            setStore({ loadingResults: false });
            return;
          }

          const data = await response.json();
          console.log("✅ Backend response received:", data);

          if (!data || !data.data || data.data.length === 0) {
            console.warn("⚠️ No resources returned from the backend.");
          }

          setStore({
            boundaryResults: data.data || [],
            loadingResults: false,
          });

          return data.data;
        } catch (error) {
          console.error("❌ Error fetching resources:", error);
          setStore({ loadingResults: false });
        }
      },
      setBoundaryResults: async (
        bounds,
        selectedCategories = {},
        selectedDays = {}
      ) => {
        const store = getStore();
        const actions = getActions();

        console.log("📡 setBoundaryResults called!");
        console.log("📌 Received bounds:", bounds);
        console.log("📌 Selected Categories:", selectedCategories);
        console.log("📌 Selected Days:", selectedDays);

        if (!bounds || !bounds.ne || !bounds.sw) {
          console.error("❌ Error: Invalid bounds received.");
          return;
        }

        let allResources = store.boundaryResults; // Use boundaryResults instead

        console.log(
          "📌 Total resources before filtering:",
          allResources.length
        );

        const isFilteringByCategory =
          Object.values(selectedCategories).some(Boolean);
        const isFilteringByDay = Object.values(selectedDays).some(Boolean);

        console.log("🔎 isFilteringByCategory:", isFilteringByCategory);
        console.log("🔎 isFilteringByDay:", isFilteringByDay);

        setStore({ loadingResults: true }); // 🔥 Start loading

        try {
          const filteredResults = allResources.filter((resource) => {
            const hasValidCategory =
              isFilteringByCategory &&
              resource.category &&
              resource.category
                .split(",")
                .map((c) => c.trim().toLowerCase())
                .some((cat) => selectedCategories[cat]);

            const hasValidDay =
              isFilteringByDay &&
              resource.schedule &&
              Object.keys(resource.schedule).some(
                (day) => selectedDays[day] && resource.schedule[day]?.start
              );

            return (
              (isFilteringByCategory && hasValidCategory) ||
              (isFilteringByDay && hasValidDay)
            );
          });

          console.log(
            "✅ Found",
            filteredResults.length,
            "resources after filtering."
          );

          setStore({
            boundaryResults: [...filteredResults],
            loadingResults: false, // 🔥 Ensure loading stops
          });
        } catch (error) {
          console.error("❌ Error filtering resources:", error);
          setStore({ loadingResults: false }); // 🔥 Ensure loading stops even on error
        }
      },

      checkResourceCoordinates: async () => {
        const url = "/api/getAllResources";
        let resourcesWithInvalidCoordinates = false;

        try {
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            console.error("Server responded with status:", response.status);
            const contentType = response.headers.get("content-type");

            if (contentType && contentType.includes("text/html")) {
              const text = await response.text();
              console.error("HTML response received:", text);
            } else if (
              contentType &&
              contentType.includes("application/json")
            ) {
              const data = await response.json();
              console.error("JSON error data received:", data);
            } else {
              console.error("Unexpected response received.");
            }
            return false;
          }
          const contentType = response.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            console.error("Invalid content type:", contentType);
            const text = await response.text();
            return false;
          }
          const resources = await response.json();
          resources.forEach((resource) => {
            const { latitude, longitude } = resource;
            if (typeof latitude === "string" || typeof longitude === "string") {
              console.error(
                "Resource with invalid coordinates found:",
                resource
              );
              resourcesWithInvalidCoordinates = true;
            }
          });

          if (!resourcesWithInvalidCoordinates) {
            console.log("All resources have valid coordinates");
          }

          return resourcesWithInvalidCoordinates;
        } catch (error) {
          console.error("An error occurred while checking resources:", error);
          return false;
        }
      },

      geoFindMe: async () => {
        const store = getStore();
        const actions = getActions();
        console.log("📡 Attempting to get user location...");

        if (!navigator.geolocation) {
          console.error("❌ Geolocation is not supported by this browser.");
          alert("Please enable location services.");
          return;
        }
        setStore((prevStore) => ({
          ...prevStore,
          loadingLocation: true,
        }));

        const successCallback = async (position) => {
          const { latitude, longitude } = position.coords;
          console.log(
            `✅ Location retrieved: lat=${latitude}, lng=${longitude}`
          );

          // ✅ Store user location immediately
          setStore((prevStore) => ({
            ...prevStore,
            userLocation: { lat: latitude, lng: longitude },
          }));

          // ✅ Fetch city/state info BEFORE moving the map
          await actions.updateCityStateFromCoords(latitude, longitude);

          // ✅ Ensure mapInstance is available before moving the map
          let retries = 0;
          let mapInstance = null;
          let mapsInstance = null;

          while (!mapInstance || !mapsInstance) {
            console.warn(`⚠️ Waiting for mapInstance... (${retries + 1})`);
            mapInstance = actions.getMapInstance();
            mapsInstance = actions.getMapsInstance();

            if (mapInstance && mapsInstance) break;

            if (retries > 5) {
              console.error(
                "❌ mapInstance is still not available after retries."
              );
              setStore((prevStore) => ({
                ...prevStore,

                loadingLocation: false,
              }));
              return;
            }
            await new Promise((res) => setTimeout(res, 500));
            retries++;
          }

          console.log("✅ Map is now ready. Moving map...");
          mapInstance.setCenter(new mapsInstance.LatLng(latitude, longitude));
          mapInstance.setZoom(13);

          setStore((prevStore) => ({
            ...prevStore,

            loadingLocation: false,
          }));
        };

        const errorCallback = (error) => {
          console.error("❌ Geolocation error:", error);

          switch (error.code) {
            case error.PERMISSION_DENIED:
              alert("Please enable location services and try again.");
              break;
            case error.POSITION_UNAVAILABLE:
              alert("Location unavailable. Retrying in 3 seconds...");
              setTimeout(() => actions.geoFindMe(), 3000);
              break;
            case error.TIMEOUT:
              alert("Location request timed out. Try again.");
              break;
            default:
              alert("Unable to retrieve your location.");
          }

          setStore((prevStore) => ({
            ...prevStore,

            loadingLocation: false,
          }));
        };

        navigator.geolocation.getCurrentPosition(
          successCallback,
          errorCallback,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      },

      deleteResource: async (resourceId, navigate) => {
        const { current_back_url } = getStore();
        const token = sessionStorage.getItem("token");
        console.log("Token being sent:", token);
        const opts = {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        try {
          const response = await fetch(
            `${current_back_url}/api/deleteResource/${resourceId}`,
            opts
          );
          if (response.status >= 400) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "There was an error while deleting the resource.",
            });
            return;
          }
          Swal.fire({
            icon: "success",
            title: "Deleted",
            text: "Resource deleted successfully!",
          });

          const actions = getActions();
          actions.closeModal();

          if (navigate) navigate("/");
        } catch (error) {
          console.error("Error during resource deletion:", error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `An error occurred: ${error.message}`,
          });
        }
      },

      setSchedules: () => {
        let url = getStore().current_back_url + `/api/getSchedules`;
        fetch(url, {
          method: "GET",
          headers: {
            "access-control-allow-origin": "*",
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setStore({ schedules: data });
          })
          .catch((error) => console.log(error));
        return () => {};
      },

      editResource: async (resourceId, formData, navigate) => {
        const { current_back_url } = getStore();
        const token = sessionStorage.getItem("token");

        const opts = {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        };

        try {
          const response = await fetch(
            `${current_back_url}/api/editResource/${resourceId}`,
            opts
          );
          const data = await response.json();

          if (!response.ok) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text:
                data.message ||
                "There has been an error while editing the resource.",
            });
            return false;
          }

          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Resource edited successfully!",
          });

          setStore({
            modalIsOpen: true, // Open the modal
            selectedResource: resourceId, // Store selected resource
          });

          return true;
        } catch (error) {
          console.error("🚨 Error during resource editing:", error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `An error occurred: ${error.message}`,
          });
          return false;
        }
      },

      getResourceUsers: async (resourceId) => {
        const current_back_url = getStore().current_back_url;

        try {
          const response = await fetch(
            `${current_back_url}/api/getResourceUsers/${resourceId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            console.error(
              "❌ Failed to fetch resource users:",
              response.status
            );
            return [];
          }

          const data = await response.json();
          console.log("✅ Resource Users Data:", data);

          return Array.isArray(data.users) ? data.users : []; // Ensure an array is returned
        } catch (error) {
          console.error("🚨 Error fetching resource users:", error);
          return [];
        }
      },

      getResource: async (resourceId) => {
        const { current_back_url, current_front_url } = getStore();
        const token = sessionStorage.getItem("token");
        const opts = {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        try {
          const response = await fetch(
            current_back_url + `/api/getResource/${resourceId}`,
            opts
          );
          if (response.status >= 400) {
            alert("There has been an error");
            return null;
          }
          const data = await response.json();
          return data;
        } catch (error) {
          console.error("Error fetching the resource:", error);
          return null;
        }
      },

      createResource: async (formData, navigate) => {
        const { current_back_url, current_front_url } = getStore();
        const token = sessionStorage.getItem("token");
        const opts = {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        };
        try {
          const response = await fetch(
            current_back_url + "/api/createResource",
            opts
          );
          console.log("Error Swal triggered");
          const data = await response.json();

          if (response.status >= 400 || data.status === "error") {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: data.message,
            });
            console.log("Success Swal triggered");
            return false;
          }

          if (data.status === "success") {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Resource created successfully!",
            });
            navigate("/");
          }
        } catch (error) {
          console.error("Error during resource creation:", error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `An error occurred: ${error.message}`,
          });
          console.log("Catch block Swal triggered");
        }
      },

      // geoFindMe: async () => {
      //   console.log("📡 Attempting to get user location...");

      //   if (!navigator.geolocation) {
      //     console.error("❌ Geolocation is not supported by this browser.");
      //     alert("Geolocation is not supported by your browser.");
      //     return;
      //   }

      //   // 🔵 Start Loading in Store
      //   setStore({ loadingResults: true });

      //   const successCallback = async (position) => {
      //     const { latitude, longitude } = position.coords;
      //     console.log(
      //       `✅ Location retrieved: lat=${latitude}, lng=${longitude}`
      //     );

      //     const actions = getActions();

      //     // Reset filters
      //     actions.resetFilters();

      //     // Update state with user's location
      //     setStore({ userLocation: { lat: latitude, lng: longitude } });

      //     // Fetch city data using these coordinates
      //     await actions.updateCityStateFromCoords(latitude, longitude);

      //     // 🔴 Stop Loading
      //     setStore({ loadingResults: false });
      //   };

      //   const errorCallback = (error) => {
      //     console.error("❌ Geolocation error:", error);

      //     switch (error.code) {
      //       case error.PERMISSION_DENIED:
      //         console.warn("⚠️ User denied location access.");
      //         alert("Please enable location services and try again.");
      //         break;
      //       case error.POSITION_UNAVAILABLE:
      //         console.warn("⚠️ Location unavailable.");
      //         alert("Location unavailable. Retrying in 3 seconds...");
      //         setTimeout(() => getActions().geoFindMe(), 3000);
      //         break;
      //       case error.TIMEOUT:
      //         console.warn("⚠️ Location request timed out.");
      //         alert("Location request timed out. Try again.");
      //         break;
      //       default:
      //         alert("Unable to retrieve your location.");
      //     }

      //     setStore({ loadingResults: false });
      //   };

      //   navigator.geolocation.getCurrentPosition(
      //     successCallback,
      //     errorCallback,
      //     {
      //       enableHighAccuracy: true,
      //       timeout: 10000,
      //       maximumAge: 0,
      //     }
      //   );
      // },

      updateCityStateFromCoords: async (lat, lng) => {
        const actions = getActions();
        console.log(
          `📡 Fetching city and bounds for coordinates: lat=${lat}, lng=${lng}`
        );

        try {
          const data = await actions.fetchBounds({ lat, lng });

          if (!data) {
            console.error("❌ No valid data received from fetchBounds.");
            return null; // Return null instead of breaking
          }

          const { location, bounds } = data;

          console.log("✅ Updating city state with:", location, bounds);

          setStore((prevStore) => ({
            ...prevStore,
            city: {
              ...prevStore.city,
              center: location,
              bounds: bounds,
            },
            userLocation: location,
            mapCenter: location, // 📌 Ensure map moves!
          }));

          // 🌍 Fetch resources immediately after updating the city
          await actions.fetchResources(bounds);

          return data; // Return the data for `geoFindMe`
        } catch (error) {
          console.error(
            "❌ Error in updateCityStateFromCoords:",
            error.message
          );
          return null;
        }
      },

      // updateCityStateFromCoords: async (lat, lng) => {
      //   const actions = getActions();
      //   console.log(
      //     `📡 Fetching city and bounds for coordinates: lat=${lat}, lng=${lng}`
      //   );

      //   try {
      //     const data = await actions.fetchBounds({ lat, lng });

      //     if (!data) {
      //       console.error("❌ No valid data received from fetchBounds.");
      //       return null; // Return null instead of breaking
      //     }

      //     const { location, bounds } = data;

      //     console.log("✅ Updating city state with:", location, bounds);

      //     setStore((prevStore) => ({
      //       ...prevStore,
      //       city: {
      //         ...prevStore.city,
      //         center: location,
      //         bounds: bounds,
      //       },
      //       userLocation: location,
      //       mapCenter: location, // 📌 Ensure map moves!
      //     }));

      //     // 🌍 Fetch resources immediately after updating the city
      //     await actions.fetchResources(bounds);

      //     return data; // Return the data for `geoFindMe`
      //   } catch (error) {
      //     console.error(
      //       "❌ Error in updateCityStateFromCoords:",
      //       error.message
      //     );
      //     return null;
      //   }
      // },

      // fetchBounds: async (query, isZip = false) => {
      //   const store = getStore();
      //   const apiKey = store.googleApiKey; // Ensure API key is stored in flux.js

      //   let apiUrl = isZip
      //     ? `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${apiKey}`
      //     : `https://maps.googleapis.com/maps/api/geocode/json?latlng=${query.lat},${query.lng}&key=${apiKey}`;

      //   console.log(`🌍 Fetching bounds from: ${apiUrl}`);

      //   try {
      //     const response = await fetch(apiUrl);
      //     const data = await response.json();

      //     if (!data || data.status !== "OK" || !data.results?.length) {
      //       console.error("❌ No valid results found for query:", query);
      //       return null;
      //     }

      //     const firstResult = data.results[0];
      //     const location = firstResult.geometry?.location;
      //     const bounds =
      //       firstResult.geometry?.bounds || firstResult.geometry?.viewport;

      //     if (!location || !bounds) {
      //       console.error("❌ Missing location or bounds:", data);
      //       return null;
      //     }

      //     console.log("✅ API Response:", { location, bounds });
      //     return { location, bounds };
      //   } catch (error) {
      //     console.error("❌ Error fetching bounds:", error);
      //     return null;
      //   }
      // },
      fetchBounds: async (query, isZip = false) => {
        console.log("🌍 Fetching bounds for:", query);

        let apiUrl;
        if (isZip) {
          // Searching by ZIP code (not as precise as Google)
          apiUrl = `https://nominatim.openstreetmap.org/search?postalcode=${query}&format=json&addressdetails=1`;
        } else {
          // Reverse geocoding by lat/lng
          apiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${query.lat}&lon=${query.lng}&format=json&addressdetails=1`;
        }

        try {
          const response = await fetch(apiUrl);
          const data = await response.json();

          if (
            !data ||
            (Array.isArray(data) && data.length === 0) ||
            !data.address
          ) {
            console.error("❌ No valid results found from Nominatim:", query);
            return null;
          }

          const city =
            data.address.city || data.address.town || data.address.village;
          const state = data.address.state;
          const country = data.address.country;
          const location = { lat: query.lat, lng: query.lng };

          // Nominatim does not provide precise bounds, so we approximate
          const bounds = {
            ne: { lat: query.lat + 0.05, lng: query.lng + 0.05 },
            sw: { lat: query.lat - 0.05, lng: query.lng - 0.05 },
          };

          console.log("✅ Nominatim Response:", {
            city,
            state,
            country,
            location,
            bounds,
          });

          return { city, state, country, location, bounds };
        } catch (error) {
          console.error("❌ Error fetching from Nominatim:", error);
          return null;
        }
      },

      // fetchBounds: async (query, isZip = false) => {
      //   const store = getStore();
      //   const apiKey = import.meta.env.VITE_GOOGLE || getStore().googleApiKey;

      //   console.log("Google API Key from Store:", getStore().googleApiKey);
      //   console.log("Google API Key from env:", import.meta.env.VITE_GOOGLE);

      //   if (!apiKey) {
      //     console.error("❌ Google API Key is missing. Check your .env file.");
      //     return null;
      //   }

      //   let apiUrl = isZip
      //     ? `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${apiKey}`
      //     : `https://maps.googleapis.com/maps/api/geocode/json?latlng=${query.lat},${query.lng}&key=${apiKey}`;

      //   console.log(`🌍 Fetching bounds from: ${apiUrl}`);

      //   try {
      //     const response = await fetch(apiUrl);
      //     const data = await response.json();

      //     if (!data || data.status !== "OK" || !data.results?.length) {
      //       console.error("❌ No valid results found for query:", query);
      //       console.error("🛑 API Status:", data.status);
      //       console.error("📩 API Error Message:", data.error_message);
      //       return null;
      //     }

      //     const firstResult = data.results[0];
      //     const location = firstResult.geometry?.location;
      //     const bounds =
      //       firstResult.geometry?.bounds || firstResult.geometry?.viewport;

      //     if (!location || !bounds) {
      //       console.error("❌ Missing location or bounds:", data);
      //       return null;
      //     }

      //     console.log("✅ API Response:", { location, bounds });
      //     return { location, bounds };
      //   } catch (error) {
      //     console.error("❌ Error fetching bounds:", error);
      //     return null;
      //   }
      // },

      // fetchResources: async (bounds) => {
      //   const store = getStore();

      //   if (!bounds || !bounds.ne || !bounds.sw) {
      //     console.error("❌ Error: Invalid bounds received:", bounds);
      //     return;
      //   }

      //   console.log("📏 Received bounds:", bounds);

      //   // ✅ Ensure correct structure
      //   const formattedBounds = {
      //     ne: { lat: bounds.ne.lat, lng: bounds.ne.lng },
      //     sw: { lat: bounds.sw.lat, lng: bounds.sw.lng },
      //   };

      //   console.log(
      //     "📡 Fetching resources with formatted bounds:",
      //     formattedBounds
      //   );

      //   // 🔵 START LOADING
      //   setStore({ loadingResults: true });

      //   try {
      //     const response = await fetch(
      //       `${store.current_back_url}/api/getBResults`,
      //       {
      //         method: "POST",
      //         headers: { "Content-Type": "application/json" },
      //         body: JSON.stringify(formattedBounds), // ✅ Fix: Send correctly formatted bounds
      //       }
      //     );

      //     if (!response.ok) {
      //       const text = await response.text();
      //       console.error("❌ Backend request failed. Response:", text);
      //       setStore({ loadingResults: false }); // 🔴 STOP LOADING on failure
      //       return;
      //     }

      //     const data = await response.json();
      //     console.log("✅ Backend response received:", data);

      //     if (!data || !data.data || data.data.length === 0) {
      //       console.warn("⚠️ No resources returned from the backend.");
      //     }

      //     setStore({
      //       boundaryResults: data.data || [],
      //       loadingResults: false, // 🔴 STOP LOADING when data is received
      //     });

      //     return data.data;
      //   } catch (error) {
      //     console.error("❌ Error fetching resources:", error);
      //     setStore({ loadingResults: false }); // 🔴 STOP LOADING on error
      //   }
      // },

      // fetchResources: async (bounds) => {
      //   const store = getStore();

      //   if (!bounds || !bounds.ne || !bounds.sw) {
      //     console.error("❌ Error: Invalid bounds received:", bounds);
      //     return;
      //   }

      //   console.log("📏 Received bounds:", bounds);

      //   // Ensure the correct format
      //   const formattedBounds = {
      //     ne: { lat: bounds.ne.lat, lng: bounds.ne.lng },
      //     sw: { lat: bounds.sw.lat, lng: bounds.sw.lng },
      //   };

      //   console.log(
      //     "📡 Fetching resources with formatted bounds:",
      //     formattedBounds
      //   );

      //   // 🔵 START LOADING
      //   setStore({ loadingResults: true });

      //   try {
      //     const response = await fetch(
      //       `${store.current_back_url}/api/getBResults`,
      //       {
      //         method: "POST",
      //         headers: { "Content-Type": "application/json" },
      //         body: JSON.stringify(formattedBounds), // ✅ Fix: Send correctly formatted bounds
      //       }
      //     );

      //     if (!response.ok) {
      //       const text = await response.text();
      //       console.error("❌ Backend request failed. Response:", text);
      //       setStore({ loadingResults: false }); // 🔴 STOP LOADING on failure
      //       return;
      //     }

      //     const data = await response.json();
      //     console.log("✅ Backend response received:", data);

      //     if (!data || !data.data || data.data.length === 0) {
      //       console.warn("⚠️ No resources returned from the backend.");
      //     }

      //     setStore({
      //       boundaryResults: data.data || [],
      //       loadingResults: false, // 🔴 STOP LOADING when data is received
      //     });

      //     return data.data;
      //   } catch (error) {
      //     console.error("❌ Error fetching resources:", error);
      //     setStore({ loadingResults: false }); // 🔴 STOP LOADING on error
      //   }
      // },

      // setBoundaryResults: async (
      //   bounds,
      //   selectedCategories = {},
      //   selectedDays = {}
      // ) => {
      //   const store = getStore();
      //   const actions = getActions();

      //   console.log("📡 setBoundaryResults called!");
      //   console.log("📌 Received bounds:", bounds);
      //   console.log("📌 Selected Categories:", selectedCategories);
      //   console.log("📌 Selected Days:", selectedDays);

      //   if (!bounds || !bounds.ne || !bounds.sw) {
      //     console.error("❌ Error: Invalid bounds received.");
      //     return;
      //   }

      //   let allResources = store.boundaryResults; // Use boundaryResults instead

      //   console.log(
      //     "📌 Total resources before filtering:",
      //     allResources.length
      //   );

      //   const isFilteringByCategory =
      //     Object.values(selectedCategories).some(Boolean);
      //   const isFilteringByDay = Object.values(selectedDays).some(Boolean);

      //   console.log("🔎 isFilteringByCategory:", isFilteringByCategory);
      //   console.log("🔎 isFilteringByDay:", isFilteringByDay);

      //   // 🔵 START LOADING BEFORE FILTERING
      //   setStore({ loadingResults: true });

      //   if (!isFilteringByCategory && !isFilteringByDay) {
      //     console.log("✅ No filters applied, returning all resources.");
      //     setStore({
      //       boundaryResults: [...allResources],
      //       loadingResults: false,
      //     }); // 🔴 STOP LOADING
      //     return;
      //   }

      //   const filteredResults = allResources.filter((resource) => {
      //     const hasValidCategory =
      //       isFilteringByCategory &&
      //       resource.category &&
      //       resource.category
      //         .split(",")
      //         .map((c) => c.trim().toLowerCase())
      //         .some((cat) => selectedCategories[cat]);

      //     const hasValidDay =
      //       isFilteringByDay &&
      //       resource.schedule &&
      //       Object.keys(resource.schedule).some(
      //         (day) => selectedDays[day] && resource.schedule[day]?.start
      //       );

      //     return (
      //       (isFilteringByCategory && hasValidCategory) ||
      //       (isFilteringByDay && hasValidDay)
      //     );
      //   });

      //   console.log(
      //     "✅ Found",
      //     filteredResults.length,
      //     "resources after filtering."
      //   );

      //   // 🔴 STOP LOADING AFTER FILTERING
      //   setStore({
      //     boundaryResults: [...filteredResults],
      //     loadingResults: false,
      //   });
      // },

      // setBoundaryResults: async (bounds, resources = {}, days = {}) => {
      //   const store = getStore();

      //   if (!bounds || typeof bounds !== "object") {
      //     console.error("❌ Error: No bounds provided.");
      //     return;
      //   }

      //   setStore({ bounds }); // ✅ Save bounds in store

      //   const neLat =
      //     bounds.ne?.lat || bounds.northeast?.lat || bounds.nw?.lat || null;
      //   const neLng =
      //     bounds.ne?.lng || bounds.northeast?.lng || bounds.nw?.lng || null;
      //   const swLat =
      //     bounds.sw?.lat || bounds.southwest?.lat || bounds.se?.lat || null;
      //   const swLng =
      //     bounds.sw?.lng || bounds.southwest?.lng || bounds.se?.lng || null;

      //   if (
      //     neLat === null ||
      //     neLng === null ||
      //     swLat === null ||
      //     swLng === null
      //   ) {
      //     console.error(
      //       "❌ Error: Invalid bounds when fetching results:",
      //       bounds
      //     );
      //     return;
      //   }

      //   console.log("📡 Fetching boundary results with bounds:", {
      //     neLat,
      //     neLng,
      //     swLat,
      //     swLng,
      //   });

      //   const selectedCategories = Object.keys(resources).filter(
      //     (key) => resources[key]
      //   );
      //   const selectedDays = Object.keys(days).filter((key) => days[key]);

      //   const requestBody = {
      //     neLat,
      //     neLng,
      //     swLat,
      //     swLng,
      //     resources: selectedCategories.length > 0 ? resources : {},
      //     days: selectedDays.length > 0 ? days : {},
      //   };

      //   try {
      //     console.log("📡 Sending request:", requestBody);
      //     setStore({ loading: true });

      //     let response = await fetch(
      //       `${store.current_back_url}/api/getBResults`,
      //       {
      //         method: "POST",
      //         headers: { "Content-Type": "application/json" },
      //         body: JSON.stringify(requestBody),
      //       }
      //     );

      //     if (!response.ok) {
      //       const text = await response.text();
      //       throw new Error(
      //         `Network response was not ok. Status: ${response.statusText}. Response Text: ${text}`
      //       );
      //     }

      //     const data = await response.json();
      //     setStore({
      //       boundaryResults: data.data,
      //       loading: false,
      //       loadingResults: false,
      //     });
      //   } catch (error) {
      //     console.error("❌ Error fetching boundary results:", error);
      //   } finally {
      //     setStore({ isFetchingBoundaryResults: false, loadingResults: false });
      //   }
      // },

      // setBoundaryResults: async (bounds, resources = {}, days = {}) => {
      //   const store = getStore();

      //   if (store.isFetchingBoundaryResults) {
      //     console.log("⏳ Request already in progress, skipping...");
      //     return;
      //   }

      //   if (!bounds || typeof bounds !== "object") {
      //     console.error(
      //       "❌ Error: No bounds provided or invalid structure.",
      //       bounds
      //     );
      //     return;
      //   }

      //   // Ensure bounds are consistently extracted
      //   const neLat =
      //     bounds.ne?.lat || bounds.northeast?.lat || bounds.nw?.lat || null;
      //   const neLng =
      //     bounds.ne?.lng || bounds.northeast?.lng || bounds.nw?.lng || null;
      //   const swLat =
      //     bounds.sw?.lat || bounds.southwest?.lat || bounds.se?.lat || null;
      //   const swLng =
      //     bounds.sw?.lng || bounds.southwest?.lng || bounds.se?.lng || null;

      //   if (
      //     neLat === null ||
      //     neLng === null ||
      //     swLat === null ||
      //     swLng === null
      //   ) {
      //     console.error(
      //       "❌ Error: Invalid bounds when fetching results.",
      //       bounds
      //     );
      //     return;
      //   }

      //   console.log("📡 Fetching boundary results with:", {
      //     neLat,
      //     neLng,
      //     swLat,
      //     swLng,
      //   });

      //   const selectedCategories = Object.keys(resources).filter(
      //     (key) => resources[key]
      //   );
      //   const selectedDays = Object.keys(days).filter((key) => days[key]);

      //   const requestBody = {
      //     neLat,
      //     neLng,
      //     swLat,
      //     swLng,
      //     resources: selectedCategories.length > 0 ? resources : {},
      //     days: selectedDays.length > 0 ? days : {},
      //   };

      //   try {
      //     console.log("📡 Sending request with:", requestBody);
      //     setStore({ loading: true });

      //     let response = await fetch(
      //       `${store.current_back_url}/api/getBResults`,
      //       {
      //         method: "POST",
      //         headers: { "Content-Type": "application/json" },
      //         body: JSON.stringify(requestBody),
      //       }
      //     );

      //     if (!response.ok) {
      //       const text = await response.text();
      //       throw new Error(
      //         `Network response was not ok. Status: ${response.statusText}. Response Text: ${text}`
      //       );
      //     }

      //     const data = await response.json();
      //     setStore({
      //       boundaryResults: data.data,
      //       loading: false,
      //       loadingResults: false,
      //     });
      //   } catch (error) {
      //     console.error("❌ Error fetching boundary results:", error);
      //   } finally {
      //     setStore({ isFetchingBoundaryResults: false, loadingResults: false });
      //   }
      // },

      likeComment: async (commentId) => {
        const token = sessionStorage.getItem("token");
        const current_back_url = getStore().current_back_url;
        try {
          const response = await fetch(
            `${current_back_url}/api/likeComment/${commentId}`,
            {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (response.ok) {
            console.log("Comment liked successfully");
          } else if (response.status === 409) {
            console.warn("Comment already liked.");
          } else {
            throw new Error("Failed to like comment");
          }
        } catch (error) {
          console.error("Error in likeComment:", error);
        }
      },

      unlikeComment: async (commentId) => {
        const token = sessionStorage.getItem("token");
        const current_back_url = getStore().current_back_url;
        try {
          const response = await fetch(
            `${current_back_url}/api/unlikeComment/${commentId}`,
            {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (response.ok) {
            console.log("Comment unliked successfully");
          } else {
            throw new Error("Failed to unlike comment");
          }
        } catch (error) {
          console.error("Error in unlikeComment:", error);
        }
      },

      getAverageRating: async (
        resourceId,
        setAverageRatingCallback,
        setRatingCountCallback
      ) => {
        const current_back_url = getStore().current_back_url;

        try {
          const response = await fetch(
            `${current_back_url}/api/rating?resource=${resourceId}`
          );
          if (!response.ok) {
            console.error(
              `Server Error: ${response.status} ${response.statusText}`
            );
            if (typeof setAverageRatingCallback === "function")
              setAverageRatingCallback(0);
            if (typeof setRatingCountCallback === "function")
              setRatingCountCallback(0);
            return;
          }

          const data = await response.json();
          if (data && data.rating === "No ratings yet") {
            if (typeof setAverageRatingCallback === "function")
              setAverageRatingCallback(0);
            if (typeof setRatingCountCallback === "function")
              setRatingCountCallback(0);
          } else {
            if (typeof setAverageRatingCallback === "function")
              setAverageRatingCallback(data.rating);
            if (typeof setRatingCountCallback === "function")
              setRatingCountCallback(data.count);
          }
        } catch (error) {
          console.error("Network Error:", error);
          if (typeof setAverageRatingCallback === "function")
            setAverageRatingCallback(0);
          if (typeof setRatingCountCallback === "function")
            setRatingCountCallback(0);
        }
      },

      approveComment: async (commentId) => {
        const token = sessionStorage.getItem("token");
        const current_back_url = getStore().current_back_url;

        console.log("📡 Approving comment:", commentId);
        console.log("🔑 Token being sent:", token);
        console.log(
          "🛠️ Request URL:",
          `${current_back_url}/api/approve_comment/${commentId}`
        );

        try {
          const response = await fetch(
            `${current_back_url}/api/approve_comment/${commentId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Ensure token is properly formatted
              },
            }
          );

          console.log("📥 Response Status:", response.status);

          if (!response.ok) {
            const errorData = await response.json();
            console.error("❌ Failed to approve comment:", errorData);
            throw new Error(errorData.message || "Failed to approve comment");
          }

          const data = await response.json();
          console.log("✅ Comment approved:", data);
          return true;
        } catch (error) {
          console.error("🚨 Error in approveComment:", error);
          return false;
        }
      },

      getUnapprovedComments: async () => {
        const current_back_url = getStore().current_back_url;
        try {
          const response = await fetch(
            `${current_back_url}/api/unapproved_comments`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*", // <-- Ensures CORS compliance
              },
            }
          );

          if (!response.ok) {
            throw new Error(
              `Failed to fetch unapproved comments. Status: ${response.status}`
            );
          }

          const data = await response.json();
          return data.comments;
        } catch (error) {
          console.error("Error fetching unapproved comments:", error);
          return [];
        }
      },

      submitRatingAndComment: async (
        resourceId,
        commentContent,
        ratingValue
      ) => {
        const url = getStore().current_back_url + "/api/createCommentAndRating";
        const token = sessionStorage.getItem("token");

        if (!token) {
          throw new Error("User is not logged in.");
        }

        try {
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              resource_id: resourceId,
              comment_content: commentContent,
              rating_value: ratingValue,
            }),
          });

          if (!response.ok) {
            throw new Error("Network response was not ok.");
          }

          const data = await response.json();
          return data;
        } catch (error) {
          console.error("Error submitting rating and comment:", error);
          throw error;
        }
      },

      getComments: async (resourceId, setCommentsCallback) => {
        const current_back_url = getStore().current_back_url;

        try {
          const response = await fetch(
            `${current_back_url}/api/getcomments/${resourceId}`
          );
          if (response.status !== 200) {
            throw new Error("Failed to get comments");
          }
          const data = await response.json();
          setCommentsCallback(data.comments);
        } catch (error) {
          console.error("Error:", error);
        }
      },

      getCommentsAndRatingsForUser: async (
        userId,
        setUserCommentsAndRatings
      ) => {
        const current_back_url = getStore().current_back_url;
        try {
          const response = await fetch(
            `${current_back_url}/api/comments-ratings/user/${userId}`
          );
          if (!response.ok) {
            console.error("Failed to fetch user comments and ratings");
            return;
          }
          const data = await response.json();
          setUserCommentsAndRatings(data.comments);
        } catch (error) {
          console.error("Error fetching user comments and ratings:", error);
        }
      },

      deleteComment: async (commentId) => {
        const current_back_url = getStore().current_back_url;
        const token = sessionStorage.getItem("token");

        if (!token) {
          console.error("User is not logged in.");
          return { success: false };
        }

        try {
          const response = await fetch(
            `${current_back_url}/api/deleteComment/${commentId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to delete comment");
          }

          return { success: true };
        } catch (error) {
          console.error("Error deleting comment:", error);
          return { success: false };
        }
      },

      getUserInfo: async (userId) => {
        const current_back_url = getStore().current_back_url;
        try {
          const response = await fetch(
            `${current_back_url}/api/user/${userId}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch user info");
          }
          const data = await response.json();
          return data;
        } catch (error) {
          console.error("Error fetching user info:", error);
          return { name: "Unknown" };
        }
      },

      fetchFavorites: function () {
        const current_back_url = getStore().current_back_url;
        const token = sessionStorage.getItem("token");
        if (token) {
          fetch(`${current_back_url}/api/getFavorites`, {
            headers: {
              Authorization: "Bearer " + token,
            },
          })
            .then((response) => response.json())
            .then((data) => {
              const favorites = data.favorites.map((fav) => ({
                ...fav.resource,
              }));
              sessionStorage.setItem("favorites", JSON.stringify(favorites));

              setStore({
                favorites: favorites,
              });
            })
            .catch((error) => {
              console.error("Error fetching updated favorites:", error);
            });
        }
      },

      addFavorite: function (resourceId) {
        const current_back_url = getStore().current_back_url;
        const token = sessionStorage.getItem("token");

        console.log("Adding favorite with resourceId:", resourceId);
        console.log("Current Backend URL:", current_back_url);
        console.log("Token:", token);

        if (token) {
          const opts = {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({ resourceId }),
          };

          console.log("Request Options:", opts);
          fetch(`${current_back_url}/api/addFavorite`, opts)
            .then((response) => {
              console.log("Response Status:", response.status);
              if (response.status === 409) {
                console.error("This item is already in your favorites.");
                return Promise.reject(
                  new Error("This item is already in your favorites.")
                );
              } else if (!response.ok) {
                console.error("Failed to add favorite due to server error.");
                return Promise.reject(new Error("Failed to add favorite"));
              }
              return response.json();
            })
            .then(() => {
              console.log("Favorite added successfully!");
              getActions().fetchFavorites();
            })
            .catch((error) => {
              console.error("Error adding favorite:", error);
            });
        }
      },

      removeFavorite: function (resourceId) {
        const current_back_url = getStore().current_back_url;
        const token = sessionStorage.getItem("token");
        if (token) {
          const opts = {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
            method: "DELETE",
            body: JSON.stringify({ resourceId }),
          };
          fetch(`${current_back_url}/api/removeFavorite`, opts)
            .then((response) => response.json())
            .then((data) => {
              if (data.message === "okay") {
                getActions().fetchFavorites();
              }
            })
            .catch((error) => console.error("Error removing favorite:", error));
        }
      },
      initApp: function () {
        const actions = getActions();
        actions.getToken();

        console.log("🚀 Initializing app...");

        // Fetch schedules on app load
        actions.setSchedules();

        actions.checkLoginStatus();

        // Listen for screen size changes
        const handleResize = actions.updateScreenSize;
        window.addEventListener("resize", handleResize);
        console.log("📏 Screen resize listener added.");

        // Cleanup listener on unmount
        return () => {
          window.removeEventListener("resize", handleResize);
          console.log("📏 Screen resize listener removed.");
        };
      },
    },
  };
};

export default getState;
