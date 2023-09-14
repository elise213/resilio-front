

const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      token: null,
      current_front_url: import.meta.env.VITE_FRONTEND_URL,
      current_back_url: import.meta.env.VITE_BACKEND_URL,
      latitude: null,
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
      favorites: [],
      favoriteOfferings: [],
      searchResults: [],
      boundaryResults: [],
      offerings: [],
      checked: false,
      loading: false,
      commentsList: [],
      categorySEarch: [],
      when: [],
      dummydata: [],
      schedules: [],
      noResults: {
        "id": 9999,
        "name": "No Results",
        "address": "",
        "phone": "",
        "category": "",
        "website": "",
        "description": "",
        "latitude": "",
        "longitude": "",
        "image": "",
        "image2": "",
        "logo": ""
      },
      daysColumns: [
        ["monday", "tuesday"],
        ["wednesday", "thursday"],
        ["friday", "saturday"],
        ["sunday", "allDays"]
      ],
      RESOURCE_OPTIONS: [
        { id: "allKinds", label: "All Resources" },
        { id: "food", label: "Food" },
        { id: "health", label: "Medical Care" },
        { id: "shelter", label: "Shelter" },
        { id: "hygiene", label: "Showers" },
        { id: "crisis", label: "Crisis Support" },
        { id: "mental", label: "Mental Health" },
        { id: "work", label: "Work" },
        { id: "bathroom", label: "Public Bathrooms" },
        // { id: "wifi", label: "WiFi" },
        { id: "substance", label: "Substance Support" },
        { id: "sex", label: "Sexual Health" },
        { id: "legal", label: "Legal Support" },
        { id: "lgbtq", label: "LGBTQ+" },
        { id: "women", label: "Women" },
        { id: "seniors", label: "Seniors" },
        // { id: "babies", label: "Babies and Toddlers" },
        // { id: "kids", label: "Kids < 18" },
        { id: "youth", label: "Youth 18-24" },
      ],
      DAY_OPTIONS: [
        { id: "monday", label: "Monday" },
        { id: "tuesday", label: "Tuesday" },
        { id: "wednesday", label: "Wednesday" },
        { id: "thursday", label: "Thursday" },
        { id: "Friday", label: "Friday" },
        { id: "Saturday", label: "Saturday" },
        { id: "sunday", label: "Sunday" },
      ]
    },
    actions: {
      // ________________________________________________________________LOGIN/TOKEN
      // login: async (email, password) => {
      //   const current_back_url = getStore().current_back_url;
      //   const opts = {
      //     method: "POST",
      //     mode: "cors",
      //     headers: {
      //       "Content-Type": "application/json",
      //       "Access-Control-Allow-Origin": "*",
      //     },
      //     body: JSON.stringify({
      //       email: email,
      //       password: password,
      //     }),
      //   };
      //   try {
      //     const response = await fetch(current_back_url + "/api/login", opts);
      //     if (response.status !== 200) {
      //       alert("There has been an error");
      //       return false;
      //     }
      //     const data = await response.json();
      //     sessionStorage.setItem("token", data.access_token);
      //     sessionStorage.setItem("is_org", data.is_org);
      //     sessionStorage.setItem("name", data.name);
      //     sessionStorage.setItem("avatar", parseInt(data.avatar));
      //     console.log("HEYOOOO OFFERINGS", data.favoriteOffers, data.favoriteOfferings)
      //     setStore({
      //       token: data.access_token,
      //       is_org: data.is_org,
      //       avatarID: data.avatar,
      //       name: data.name,
      //       favorites: data.favorites,
      //       favoriteOfferings: data.favoriteOfferings,
      //     });
      //     return true;
      //   } catch (error) {
      //     console.error(error);
      //   }
      // },
      // createUser: async (is_org, name, email, password, userAvatar) => {
      //   const current_back_url = getStore().current_back_url;
      //   const opts = {
      //     method: "POST",
      //     mode: "cors",
      //     headers: {
      //       "Content-Type": "application/json",
      //       "Access-Control-Allow-Origin": "*",
      //     },
      //     body: JSON.stringify({
      //       is_org: is_org,
      //       name: name,
      //       email: email,
      //       password: password,
      //       userAvatar: userAvatar,
      //     }),
      //   };
      //   try {
      //     const response = await fetch(
      //       current_back_url + "/api/createUser",
      //       opts
      //     );
      //     if (response.status >= 400) {
      //       alert("There has been an error");
      //       return false;
      //     }
      //     const data = await response.json();
      //     if (data.status == "true") {
      //     }
      //     return true;
      //   } catch (error) {
      //     console.error(error);
      //   }
      // },
      // logout: () => {
      //   const current_front_url = getStore().current_front_url;
      //   sessionStorage.removeItem("token");
      //   sessionStorage.removeItem("is_org");
      //   sessionStorage.removeItem("name");
      //   setStore({ token: null, is_org: null, name: null });
      //   window.location.href = current_front_url + "/";
      // },

      // ________________________________________________________________RESOURCES

      createResource: async (formData) => {
        const { current_back_url, current_front_url } = getStore();
        const token = sessionStorage.getItem("token");
        const opts = {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            formData
          ),
        };
        try {
          const response = await fetch(current_back_url + "/api/createResource", opts);
          if (response.status >= 400) {
            alert("There has been an error");
            return false;
          }
          const data = await response.json();
          if (data.status === "true") {
            navigate('/');
          }
        } catch (error) {
          console.error("Error during resource creation:", error);
        }
      },

      // addFavorite: (resourceName) => {
      //   const current_back_url = getStore().current_back_url;
      //   const favorites = getStore().favorites;
      //   const token = sessionStorage.getItem("token");
      //   if (token) {
      //     const opts = {
      //       headers: {
      //         Authorization: "Bearer " + token,
      //         "Content-Type": "application/json",
      //       },
      //       method: "POST",
      //       body: JSON.stringify({
      //         name: resourceName,
      //       }),
      //     };
      //     fetch(current_back_url + "/api/addFavorite", opts)
      //       .then((response) => response.json())
      //       .then((data) => {
      //         if (data.message == "okay") {
      //           favorites.push(data.favorite);
      //           setStore({ favorites: favorites });
      //         }
      //       });
      //   }
      // },
      // popFavorites: (faveList, faveOffers) => {
      //   if (faveList.length) {
      //     setStore({ favorites: faveList })
      //   }
      //   if (faveOffers.length) {
      //     setStore({ favoriteOfferings: faveOffers })
      //   }
      // },

      // removeFavorite: (resource) => {
      //   const current_back_url = getStore().current_back_url;
      //   const favorites = getStore().favorites;
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
      //         if (data.message == "okay") {
      //           favorites.forEach((element, index) => {
      //             if (element.name == resource) {
      //               favorites.splice(index, 1);
      //               return;
      //             }
      //           });
      //           setStore({ favorites: favorites });
      //         }
      //       })
      //       .catch((error) => console.log(error));
      //   }
      // },
      // setSearchResults: () => {
      //   let controller = new AbortController();
      //   let url = window.location.search;
      //   fetch(getStore().current_back_url + "/api/getResources" + url,
      //     {
      //       method: "GET",
      //       headers: {
      //         "access-control-allow-origin": "*",
      //         "Content-Type": "application/json",
      //       }
      //     }
      //   )
      //     .then((response) => response.json())
      //     .then((data) => {
      //       setStore({ searchResults: data.data });
      //       // console.log("search results", getStore().searchResults);
      //     })
      //     .catch((error) => console.log(error));
      // },

      setSchedules: () => {
        let controller = new AbortController();
        let url = getStore().current_back_url + `/api/getSchedules`;
        fetch(url, {
          method: "GET",
          headers: {
            "access-control-allow-origin": "*",
            "Content-Type": "application/json",
          },
          signal: controller.signal
        })
          .then(response => response.json())
          .then(data => {
            setStore({ schedules: data });
          })
          .catch(error => console.log(error));
        return () => {
          controller.abort();
        };
      },


      setBoundaryResults: async (bounds, resources, days) => {
        const abortController = new AbortController();
        const url = getStore().current_back_url + "/api/getBResults";
        try {
          setStore({ loading: true });
          let response = await fetch(url, {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              neLat: bounds?.ne?.lat,
              neLng: bounds?.ne?.lng,
              swLat: bounds?.sw?.lat,
              swLng: bounds?.sw?.lng,
              resources: resources,
              days: days
            }),
            signal: abortController.signal,
          });
          if (!response.ok) {
            const text = await response.text();
            throw new Error(`Network response was not ok. Status: ${response.statusText}. Response Text: ${text}`);
          }
          const data = await response.json();
          setStore({ boundaryResults: data.data });
          setStore({ loading: false });
          console.log("boundary results", data.data);
          console.trace("Trace for boundary results");
          console.log("resources", resources);
          return data.data;
        } catch (error) {
          setStore({ loading: false });
          if (error.name === 'AbortError') {
            console.log('Fetch aborted');
          } else {
            console.error('Error fetching data:', error);
          }
        }
        return abortController;
      },

      // createComment: async (resource_id, comment_cont, parentId) => {
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
      //       resource_id: resource_id,
      //       comment_cont: comment_cont,
      //       parentId: parentId,
      //     }),
      //   };
      //   try {
      //     const response = await fetch(
      //       current_back_url + "/api/createComment",
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
