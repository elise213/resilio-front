const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      token: null,
      current_front_url: import.meta.env.VITE_FRONTEND_URL,
      current_back_url: import.meta.env.VITE_BACKEND_URL,
      latitude: null,
      abortController: null,
      abortController2: null,
      longitude: null,
      is_org: null,
      name: null,
      avatarID: null,
      avatarImages: [
        "fas fa-robot",
        "fas fa-user-astronaut",
        "fas fa-user-ninja",
        "fas fa-snowman",
        "fas fa-user-secret",
        "fas fa-hippo",
      ],
      austin: [
        {
          center: { lat: 30.2672, lng: -97.7431 },
          bounds: {
            ne: { lat: 30.516862, lng: -97.568419 },
            sw: { lat: 30.098658, lng: -98.015328 },
          },
        },
      ],

      favorites: [],
      favoriteOfferings: [],
      isLargeScreen: false,
      searchResults: [],
      boundaryResults: [],
      mapResults: [],
      offerings: [],
      checked: false,
      loading: false,
      // commentsList: [],
      categorySEarch: [],
      // when: [],
      schedules: [],
      selectedResources: [],
      CATEGORY_OPTIONS: [
        { id: "food", label: "Food" },
        { id: "health", label: "Medical Care" },
        { id: "shelter", label: "Shelter" },
        { id: "hygiene", label: "Showers" },
        { id: "crisis", label: "Crisis Support" },
        { id: "mental", label: "Mental Health" },
        { id: "work", label: "Work" },
        { id: "bathroom", label: "Bathrooms" },
        { id: "wifi", label: "WiFi" },
        { id: "substance", label: "Substance Support" },
        { id: "sex", label: "Sexual Health" },
        { id: "legal", label: "Legal Support" },
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
      GROUP_OPTIONS: [
        { id: "lgbtq", label: "LGBTQ+" },
        { id: "women", label: "Women" },
        { id: "seniors", label: "Seniors" },
        { id: "babies", label: "Babies and Toddlers" },
        { id: "kids", label: "Youth < 18" },
        { id: "youth", label: "Youth 18-24" },
        { id: "vets", label: "Veterans" },
        { id: "migrant", label: "Refugees & Migrants" },
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
      bodhGaya: [
        {
          center: { lat: 24.681678475660995, lng: 84.99154781534179 },
          bounds: {
            ne: { lat: 25.0, lng: 85.2 },
            sw: { lat: 24.4, lng: 84.8 },
          },
        },
      ],
      categoryCounts: {},
      dayCounts: {},
    },
    actions: {
      setCategoryCounts: (categoryCounts) => {
        setStore({
          categoryCounts: categoryCounts,
        });
      },
      setDayCounts: (dayCounts) => {
        // console.log("Setting dayCounts:", dayCounts);
        setStore({
          dayCounts: dayCounts,
        });
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
          health: "Green",
          hygiene: "CornflowerBlue",
          clothing: "Salmon",
          shelter: "Maroon",
          work: "Indigo",
          wifi: "Orchid",
          crisis: "Red",
          legal: "Peru",
          bathroom: "SlateGrey",
          mental: "Coral",
          substance: "DarkRed",
          sex: "Tomato",
          babies: "Purple",
          lgbtq: "RosyBrown",
          kids: "Salmon",
          youth: "IndianRed",
          women: "DarkSalmon",
          seniors: "Teal",
          migrant: "DarkGreen",
          vets: "Olive",
        };
        if (colors[category]) {
          return { color: colors[category] };
        } else return { color: "red" };
      },

      getSessionSelectedResources: () => {
        return JSON.parse(sessionStorage.getItem("selectedResources")) || [];
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

      getIconForCategory: (category) => {
        switch (category) {
          case "health":
            return "fa-solid fa-stethoscope";
          // return "fa-solid fa-user-doctor";
          case "food":
            return "fa-solid fa-bowl-rice";
          case "hygiene":
            return "fa-solid fa-soap";
          case "bathroom":
            return "fa-solid fa-toilet";
          case "work":
            return "fa-solid fa-people-carry-box";
          // return "fa-solid fa-briefcase";
          case "wifi":
            return "fa-solid fa-wifi";
          case "crisis":
            return "fa-solid fa-exclamation-triangle";
          case "substance":
            return "fa-solid fa-capsules";
          case "legal":
            return "fa-solid fa-gavel";
          case "sex":
            return "fa-solid fa-heart";
          case "mental":
            return "fa-solid fa-brain";
          case "women":
            return "fa-solid fa-female";
          case "kids":
            return "fa-solid fa-child";
          case "youth":
            return "fa-solid fa-person-rays";
          case "seniors":
            // return "fa-solid fa-person-cane";
            return "fa-solid fa-user-plus";
          case "lgbtq":
            return "fa-solid fa-rainbow";
          case "shelter":
            return "fa-solid fa-person-shelter";
          case "clothing":
            return "fa-solid fa-shirt";
          case "babies":
            return "fa-solid fa-baby";
          case "migrant":
            return "fa-solid fa-users";
          case "vets":
            return "fa-solid fa-person-military-rifle";
          default:
            return "fa-solid fa-question";
        }
      },

      // ________________________________________________________________LOGIN/TOKEN

      getToken: () => {
        const token = sessionStorage.getItem("token");
        const favorites = JSON.parse(sessionStorage.getItem("favorites"));
        if (token && token.length) {
          setStore({ token: token, favorites: favorites || [] });
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
          sessionStorage.setItem("token", data.access_token);
          sessionStorage.setItem("is_org", data.is_org);
          sessionStorage.setItem("name", data.name);
          sessionStorage.setItem("avatar", parseInt(data.avatar));
          // sessionStorage.setItem("favorites", JSON.stringify(data.favorites));
          sessionStorage.setItem("favorites", JSON.stringify(data.favorites));

          setStore({
            token: data.access_token,
            is_org: data.is_org,
            avatarID: data.avatar,
            name: data.name,
            // favorites: data.favorites,
            favorites: data.favorites.map((fav) => fav.resource),
            //       // favoriteOfferings: data.favoriteOfferings,
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
        sessionStorage.removeItem("selectedResources");
        setStore({ token: null, is_org: null, name: null, favorites: null });
        Swal.fire({
          icon: "success",
          title: "Logged out Successfully",
          onClose: () => {
            window.location.href = "/";
          },
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

      // ________________________________________________________________RESOURCES

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

          // console.log("Response data:", data);

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
        // let controller = new AbortController();
        let url = getStore().current_back_url + `/api/getSchedules`;
        fetch(url, {
          method: "GET",
          headers: {
            "access-control-allow-origin": "*",
            "Content-Type": "application/json",
          },
          // signal: controller.signal,
        })
          .then((response) => response.json())
          .then((data) => {
            setStore({ schedules: data });
          })
          .catch((error) => console.log(error));
        return () => {
          // controller.abort();
        };
      },

      setMapResults: async (bounds) => {
        const store = getStore();
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
            throw new Error(
              `Network response was not ok. Status: ${response.statusText}. Response Text: ${text}`
            );
          }

          const data = await response.json();
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
        console.trace("setBoundaryResults called from:");
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

      addFavorite: (resourceName, setFavorites) => {
        const current_back_url = getStore().current_back_url;
        const token = sessionStorage.getItem("token");
        if (token) {
          const opts = {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
              name: resourceName,
            }),
          };
          fetch(`${current_back_url}/api/addFavorite`, opts)
            .then((response) => response.json())
            .then((data) => {
              if (data.message === "okay") {
                // Refetch favorites to update session and store
                fetch(`${current_back_url}/api/getFavorites`, {
                  headers: {
                    Authorization: "Bearer " + token,
                  },
                })
                  .then((response) => response.json())
                  .then((data) => {
                    const favorites = data.favorites.map((fav) => fav.resource);
                    sessionStorage.setItem(
                      "favorites",
                      JSON.stringify(favorites)
                    );
                    setStore((prevState) => ({
                      ...prevState,
                      favorites: favorites,
                    }));
                    if (setFavorites) {
                      setFavorites(favorites);
                    }
                  })
                  .catch((error) => {
                    console.error("Error fetching updated favorites:", error);
                    // Handle the error for fetching favorites here if needed
                  });
              }
            })
            .catch((error) => {
              console.error("Error adding favorite:", error);
              // Handle the error for adding favorite here if needed
            });
        }
      },

      initializeScreenSize: () => {
        setStore({
          isLargeScreen: window.innerWidth > 1000,
          isClient: true,
          windowWidth: window.innerWidth,
        });
      },

      updateScreenSize: () => {
        setStore({
          isLargeScreen: window.innerWidth > 1000,
          windowWidth: window.innerWidth,
        });
      },

      popFavorites: (faveList, faveOffers) => {
        if (faveList && faveList.length) {
          setStore({ favorites: faveList });
        }
        if (faveOffers && faveOffers.length) {
          setStore({ favoriteOfferings: faveOffers });
        }
      },
      // removeFavorite: (resource, setFavorites) => {
      //   const current_back_url = getStore().current_back_url;
      //   if (sessionStorage.getItem("token")) {
      //     const opts = {
      //       headers: {
      //         Authorization: "Bearer " + sessionStorage.getItem("token"),
      //         "Content-Type": "application/json",
      //       },
      //       method: "DELETE",
      //       body: JSON.stringify({
      //         name: resource,
      //       }),
      //     };
      //     fetch(current_back_url + "/api/removeFavorite", opts)
      //       .then((response) => response.json())
      //       .then((data) => {
      //         if (data.message === "okay") {
      //           const updatedFavorites = JSON.parse(
      //             sessionStorage.getItem("favorites") || "[]"
      //           ).filter((favorite) => favorite.name !== resource);
      //           sessionStorage.setItem(
      //             "favorites",
      //             JSON.stringify(updatedFavorites)
      //           );
      //           setStore((prevState) => ({
      //             ...prevState,
      //             favorites: updatedFavorites,
      //           }));

      //           // Update the local state if the setFavorites function is provided
      //           if (setFavorites) {
      //             setFavorites(updatedFavorites);
      //           }
      //         }
      //       })
      //       .catch((error) => console.log(error));
      //   }
      // },

      removeFavorite: (resourceName, setFavorites) => {
        const current_back_url = getStore().current_back_url;
        const token = sessionStorage.getItem("token");
        if (token) {
          const opts = {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
            method: "DELETE",
            body: JSON.stringify({
              name: resourceName,
            }),
          };
          fetch(`${current_back_url}/api/removeFavorite`, opts)
            .then((response) => response.json())
            .then((data) => {
              if (data.message === "okay") {
                // Refetch favorites to update session and store
                fetch(`${current_back_url}/api/getFavorites`, {
                  headers: {
                    Authorization: "Bearer " + token,
                  },
                })
                  .then((response) => response.json())
                  .then((data) => {
                    const favorites = data.favorites.map((fav) => fav.resource);
                    sessionStorage.setItem(
                      "favorites",
                      JSON.stringify(favorites)
                    );
                    setStore((prevState) => ({
                      ...prevState,
                      favorites: favorites,
                    }));
                    if (setFavorites) {
                      setFavorites(favorites);
                    }
                  });
              }
            })
            .catch((error) => console.error(error));
        }
      },

      // ________________________________________________________________OFFERINGS
      // addFavoriteOffering: (offering) => {
      //   console.log(offering);
      //   const current_back_url = getStore().current_back_url;
      //   let favorites = getStore().favoriteOfferings;
      //   const token = sessionStorage.getItem("token");
      //   if (token) {
      //     const opts = {
      //       headers: {
      //         Authorization: "Bearer " + token,
      //         "Content-Type": "application/json",
      //       },
      //       method: "POST",
      //       body: JSON.stringify({
      //         title: offering,
      //       }),
      //     };
      //     fetch(current_back_url + "/api/addFavoriteOffering", opts)
      //       .then((response) => response.json())
      //       .then((data) => {
      //         if (data.message == "okay") {
      //           console.log("okay");
      //           favorites.push(data.offering)
      //           setStore({ favoriteOfferings: favorites })
      //         }
      //       });
      //   }
      // },
      // removeFavoriteOffering: (offering) => {
      //   console.log("offering from REMOVE FAVE OFFER FLUX", offering)
      //   const current_back_url = getStore().current_back_url;
      //   const token = sessionStorage.getItem("token")
      //   if (token) {
      //     fetch(`${current_back_url}/api/removeFavoriteOffering`, {
      //       method: 'DELETE',
      //       headers: {
      //         Authorization: "Bearer " + sessionStorage.getItem("token"),
      //         "Content-Type": "application/json"
      //       },
      //       body: JSON.stringify({ title: offering })
      //     }).then(response => response.json())
      //       .then(result => {
      //         if (result.message == "okay") {
      //           const favorites = getStore().favoriteOfferings.filter((fav) => fav.title !== offering);
      //           setStore({ favoriteOfferings: favorites });
      //           console.log("FAVE OFFERINGS FLUX", getStore().favoriteOfferings)
      //         }
      //       })
      //       .catch(error => {
      //         console.error('An error occurred while removing favorite offering:', error);
      //       })
      //   }
      // },
      // setOfferings: () => {
      //   fetch(getStore().current_back_url + "/api/getOfferings")
      //     .then((response) => response.json())
      //     .then((data) => {
      //       setStore({ offerings: data.data });
      //     })
      //     .catch((error) => console.log(error));
      // },
      // createOffering: async (
      //   title,
      //   offeringType,
      //   offeringDescription,
      //   image,
      //   image2
      // ) => {
      //   const current_back_url = getStore().current_back_url;
      //   const token = getStore().token;
      //   const opts = {
      //     method: "POST",
      //     mode: "cors",
      //     headers: {
      //       Authorization: "Bearer " + token,
      //       "Content-Type": "application/json",
      //       "Access-Control-Allow-Origin": "*",
      //     },
      //     body: JSON.stringify({
      //       title: title,
      //       offering_type: offeringType,
      //       description: offeringDescription,
      //       image: image,
      //       image2: image2,
      //     }),
      //   };
      //   try {
      //     const response = await fetch(
      //       current_back_url + "/api/createOffering",
      //       opts
      //     );
      //     if (response.status >= 400) {
      //       alert("There has been an error");
      //       return false;
      //     }
      //     const data = await response.json();
      //     return true;
      //   } catch (error) {
      //     console.error(error);
      //   }
      // },
      // createDrop: async (
      //   name,
      //   address,
      //   phone,
      //   description,
      //   type,
      //   identification,
      //   image
      // ) => {
      //   const current_back_url = getStore().current_back_url;
      //   const current_front_url = getStore().current_front_url;
      //   const token = getStore().token;
      //   const opts = {
      //     method: "POST",
      //     mode: "cors",
      //     headers: {
      //       Authorization: "Bearer " + token,
      //       "Content-Type": "application/json",
      //       "Access-Control-Allow-Origin": "*",
      //     },
      //     body: JSON.stringify({
      //       name: name,
      //       address: address,
      //       phone: phone,
      //       description: description,
      //       type: type,
      //       identification: identification,
      //       image: image,
      //     }),
      //   };
      //   try {
      //     const response = await fetch(
      //       current_back_url + "/api/createDrop",
      //       opts
      //     );
      //     if (response.status >= 400) {
      //       alert("There has been an error");
      //       return false;
      //     }
      //     const data = await response.json();
      //     if (data.status == "true") {
      //       window.location.href = current_front_url + "/";
      //     }
      //     return true;
      //   } catch (error) {
      //     console.error(error);
      //   }
      // },
      // getFavorites: () => {
      //   const currentBackUrl = getStore().current_back_url;
      //   const token = sessionStorage.getItem("token");
      //   if (token) {
      //     const requestOptions = {
      //       headers: {
      //         Authorization: "Bearer " + token,
      //         "Content-Type": "application/json",
      //       },
      //       method: "GET",
      //     };
      //     fetch(currentBackUrl + "/api/getFavoriteOfferings", requestOptions)
      //       .then((response) => response.json())
      //       .then((data) => {
      //         console.log("favorite offerings", data.favoriteOfferings)
      //         setStore({ favoriteOfferings: data.favoriteOfferings })
      //       })
      //       .catch((error) => {
      //         console.error("Error fetching data:", error);
      //       });

      //     fetch(currentBackUrl + "/api/getFavorites", requestOptions)
      //       .then((response) => response.json())
      //       .then((data) => {
      //         setStore({ favorites: data.favorites })
      //       })
      //       .catch((error) => {
      //         console.error("Error fetching data:", error);
      //       });
      //   }
      // },
    },
  };
};

export default getState;
