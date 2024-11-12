const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      abortController: null,
      abortController2: null,
      avatarID: null,
      // Modal states
      modalIsOpen: false,
      loginModalIsOpen: false,
      aboutModalIsOpen: false,
      donationModalIsOpen: false,
      contactModalIsOpen: false,
      boundaryResults: [],
      categorySearch: [],
      selectedResource: null,
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
      ],
      checked: false,
      commentsList: [],
      current_front_url: import.meta.env.VITE_FRONTEND_URL,
      current_back_url: import.meta.env.VITE_BACKEND_URL,
      daysOfWeek: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
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

      GROUP_OPTIONS: [
        { id: "lgbtq", value: "lgbtq", label: "LGBTQ+" },
        { id: "women", value: "women", label: "Women" },
        { id: "seniors", value: "seniors", label: "Seniors" },
        { id: "babies", value: "babies", label: "Babies and Toddlers" },
        { id: "kids", value: "kids", label: "Youth < 18" },
        { id: "youth", value: "youth", label: "Youth 18-24" },
        { id: "vets", value: "vets", label: "Veterans" },
        { id: "migrant", value: "migrant", label: "Refugees & Migrants" },
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

      debounce: (func, delay) => {
        let timerId;
        return (...args) => {
          clearTimeout(timerId);
          timerId = setTimeout(() => {
            func(...args);
          }, delay);
        };
      },

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

      getColorForCategory: (category) => {
        const colors = {
          food: "DarkOrange",
          health: "Indigo",
          hygiene: "CornflowerBlue",
          clothing: "Salmon",
          shelter: "Maroon",
          work: "Green",
          wifi: "Orchid",
          crisis: "Red",
          legal: "Peru",
          bathroom: "SlateGrey",
          mental: "Coral",
          substance: "DarkRed",
          sex: "Tomato",
        };
        if (colors[category]) {
          return { color: colors[category] };
        } else return { color: "red" };
      },

      getFormattedSchedule: (schedule) => {
        const formattedSchedule = {};
        Object.keys(schedule).forEach((day) => {
          // Check if the day's schedule exists and is not null before accessing start and end
          if (schedule[day] && schedule[day].start && schedule[day].end) {
            const start = formatTime(schedule[day].start);
            const end = formatTime(schedule[day].end);
            formattedSchedule[day] = `${start} - ${end}`;
          } else {
            // If the day's schedule doesn't exist or start/end is null, set to "Closed"
            formattedSchedule[day] = "Closed";
          }
        });
        return formattedSchedule;
      },

      // A utility function to format the time into a 12-hour format with AM/PM
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

      getToken: () => {
        const token = sessionStorage.getItem("token");
        const favorites = JSON.parse(sessionStorage.getItem("favorites"));
        if (token && token.length) {
          setStore({ token: token, favorites: favorites || [] });
        }
      },

      // login: async (email, password) => {
      //   try {
      //     const current_back_url = getStore().current_back_url;
      //     const opts = {
      //       method: "POST",
      //       mode: "cors",
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify({
      //         email: email,
      //         password: password,
      //       }),
      //     };
      //     const response = await fetch(`${current_back_url}/api/login`, opts);

      //     if (response.status !== 200) {
      //       Swal.fire({
      //         icon: "error",
      //         title: "",
      //         text: "Incorrect email or password",
      //       });
      //       return false;
      //     }

      //     const data = await response.json();
      //     sessionStorage.setItem("token", data.access_token);
      //     sessionStorage.setItem("is_org", data.is_org);
      //     sessionStorage.setItem("name", data.name);
      //     sessionStorage.setItem("avatar", parseInt(data.avatar));
      //     sessionStorage.setItem("favorites", JSON.stringify(data.favorites));
      //     sessionStorage.setItem("user_id", data.user_id);

      //     setStore({
      //       token: data.access_token,
      //       is_org: data.is_org,
      //       avatarID: data.avatar,
      //       name: data.name,
      //       favorites: data.favorites.map((fav) => fav.resource),
      //       user_id: data.user_id,
      //     });

      //     Swal.fire({
      //       icon: "success",
      //       title: "Logged in Successfully",
      //     });

      //     return true;
      //   } catch (error) {
      //     console.error(error);
      //     Swal.fire({
      //       icon: "error",
      //       title: "Something went wrong",
      //       text: error.message,
      //     });

      //     return false;
      //   }
      // },

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
            ...fav.resource, // Include full resource details
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

      // ________________________________________________________________RESOURCES

      deleteResource: async (resourceId, navigate) => {
        const { current_back_url } = getStore();
        const token = sessionStorage.getItem("token");
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

          // Use getActions() to access other actions
          const actions = getActions();
          actions.closeModal(); // Ensure closeModal is called as a function

          if (navigate) navigate("/"); // Redirect after deletion if navigate function is provided
        } catch (error) {
          console.error("Error during resource deletion:", error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `An error occurred: ${error.message}`,
          });
        }
      },

      editResource: async (resourceId, formData, navigate) => {
        const { current_back_url, current_front_url } = getStore();
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
            current_back_url + `/api/editResource/${resourceId}`,
            opts
          );
          if (response.status >= 400) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "There has been an error while editing the resource.",
            });
            return false;
          }
          const data = await response.json();
          if (data.status === "true") {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Resource edited successfully!",
            });
            navigate("/");
          }
        } catch (error) {
          console.error("Error during resource editing:", error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `An error occurred: ${error.message}`,
          });
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
            // console.log("Response text:", text);
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

      setMapResults: async (bounds) => {
        const store = getStore();
        console.log("setMapResults called with bounds:", bounds);

        // If there's an ongoing request, abort it
        if (store.abortController2) {
          store.abortController2.abort();
        }

        // Create a new abort controller for the new request
        const newAbortController = new AbortController(); // AbortC
        setStore({ abortController2: newAbortController });

        // Normalize longitude
        let neLng = bounds?.northeast?.lng || bounds?.ne?.lng || null;
        let swLng = bounds?.southwest?.lng || bounds?.sw?.lng || null;

        neLng = neLng % 360;
        if (neLng > 180) {
          neLng -= 360;
        }

        swLng = swLng % 360;
        if (swLng > 180) {
          swLng -= 360;
        }

        const neLat = bounds?.northeast?.lat || bounds?.ne?.lat || null;
        const swLat = bounds?.southwest?.lat || bounds?.sw?.lat || null;
        console.log("Normalized coordinates:", { neLat, neLng, swLat, swLng });

        const resources = {
          food: false,
          health: false,
          shelter: false,
          hygiene: false,
          crisis: false,
          mental: false,
          work: false,
          bathroom: false,
          wifi: false,
          substance: false,
          sex: false,
          legal: false,
          lgbtq: false,
          women: false,
          seniors: false,
          babies: false,
          kids: false,
          youth: false,
          vets: false,
          migrant: false,
        };

        const days = {
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
          sunday: false,
        };

        const url = getStore().current_back_url + "/api/getBResults";
        console.log("Fetching from URL:", url);

        try {
          setStore({ loading: true });
          let response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              neLat,
              neLng,
              swLat,
              swLng,
              resources,
              days,
            }),
            signal: newAbortController.signal,
          });

          if (!response.ok) {
            const text = await response.text();
            console.error("Response text:", text);
            throw new Error(
              `Network response was not ok. Status: ${response.statusText}. Response Text: ${text}`
            );
          }

          const data = await response.json();
          console.log("Fetched data:", data);
          setStore({ mapResults: data.data, loading: false });

          return data.data;
        } catch (error) {
          if (error.name === "AbortError") {
            console.log("Fetch aborted");
          } else {
            setStore({ loading: false });
            console.error("Error fetching data:", error);
          }
        }
      },

      setBoundaryResults: async (bounds, resources, days, groups) => {
        // console.trace("setBoundaryResults called from:");
        const store = getStore();

        // If there's an ongoing request, abort it
        if (store.abortController) {
          store.abortController.abort();
        }

        // Create a new abort controller for the new request
        const newAbortController = new AbortController(); // AbortC
        setStore({ abortController: newAbortController });

        // Normalize longitude
        let neLng = bounds?.northeast?.lng || bounds?.ne?.lng || null;
        let swLng = bounds?.southwest?.lng || bounds?.sw?.lng || null;

        neLng = neLng % 360;
        if (neLng > 180) {
          neLng -= 360;
        }

        swLng = swLng % 360;
        if (swLng > 180) {
          swLng -= 360;
        }

        const neLat = bounds?.northeast?.lat || bounds?.ne?.lat || null;
        const swLat = bounds?.southwest?.lat || bounds?.sw?.lat || null;

        const url = getStore().current_back_url + "/api/getBResults";
        const combinedResources = {
          ...resources,
          ...groups,
        };

        try {
          setStore({ loading: true });

          let response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              neLat,
              neLng,
              swLat,
              swLng,
              resources: combinedResources || null,
              days: days || null,
            }),
            signal: newAbortController.signal, // Use the new abort controller's signal
          });

          if (!response.ok) {
            const text = await response.text();
            throw new Error(
              `Network response was not ok. Status: ${response.statusText}. Response Text: ${text}`
            );
          }

          const data = await response.json();
          setStore({ boundaryResults: data.data, loading: false });

          return data.data;
        } catch (error) {
          if (error.name === "AbortError") {
            console.log("Fetch aborted");
          } else {
            setStore({ loading: false });
            console.error("Error fetching data:", error);
          }
        }
      },

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
          if (response.status === 409) {
            console.warn("Comment already liked.");
            return; // Already liked; no further action needed.
          }
          if (!response.ok) throw new Error("Failed to like comment");
        } catch (error) {
          console.error(error);
          throw error;
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
          if (!response.ok) throw new Error("Failed to unlike comment");
        } catch (error) {
          console.error(error);
          throw error;
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

      // In appContext.js or wherever actions are defined

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

      // In appContext.js or wherever actions are defined

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
              // Map each favorite to include all resource details, including schedule
              const favorites = data.favorites.map((fav) => ({
                ...fav.resource, // Include full resource data
              }));

              // Save to session storage
              sessionStorage.setItem("favorites", JSON.stringify(favorites));

              // Update the store
              setStore({
                favorites: favorites,
              });
            })
            .catch((error) => {
              console.error("Error fetching updated favorites:", error);
            });
        }
      },

      // addFavorite: function (resourceId) {
      //   const current_back_url = getStore().current_back_url;
      //   const token = sessionStorage.getItem("token");
      //   if (token) {
      //     const opts = {
      //       headers: {
      //         Authorization: "Bearer " + token,
      //         "Content-Type": "application/json",
      //       },
      //       method: "POST",
      //       body: JSON.stringify({ resourceId }),
      //     };
      //     fetch(`${current_back_url}/api/addFavorite`, opts)
      //       .then((response) => {
      //         if (response.status === 409) {
      //           console.error("This item is already in your favorites.");
      //           return Promise.reject(
      //             new Error("This item is already in your favorites.")
      //           );
      //         } else if (!response.ok) {
      //           console.error("Failed to add favorite due to server error.");
      //           return Promise.reject(new Error("Failed to add favorite"));
      //         }
      //         return response.json();
      //       })
      //       .then(() => {
      //         getActions().fetchFavorites();
      //       })
      //       .catch((error) => {
      //         console.error("Error adding favorite:", error);
      //       });
      //   }
      // },

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

          console.log("Request Options:", opts); // Log the request options to verify headers and payload
          fetch(`${current_back_url}/api/addFavorite`, opts)
            .then((response) => {
              console.log("Response Status:", response.status); // Log response status for better debugging
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
    },
  };
};

export default getState;
