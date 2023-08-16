

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
      commentsList: [],
      categorySEarch: [],
      when: [],
      dummydata: [],
      schedule: [
        {
          "mondayStart": "1:00",
          "mondayEnd": "5:00",
          "saturdayStart": "14:00",
          "saturdayEnd": "20:00",
          "resource_id": 1
        },
        {
          "wednesdayStart": "13:00",
          "wednesdayEnd": "16:00",
          "fridayStart": "9:00",
          "fridayEnd": "13:00",
          "sundayStart": "7:00",
          "sundayEnd": "21:00",
          "resource_id": 2
        },
        {
          "mondayStart": "1:00",
          "mondayEnd": "5:00",
          "saturdayStart": "14:00",
          "saturdayEnd": "20:00",
          "resource_id": 3
        },
        {
          "wednesdayStart": "13:00",
          "wednesdayEnd": "16:00",
          "fridayStart": "9:00",
          "fridayEnd": "13:00",
          "sundayStart": "7:00",
          "sundayEnd": "21:00",
          "resource_id": 4
        },
        {
          "tuesdayStart": "13:00",
          "tuesdayEnd": "16:00",
          "thursdayStart": "9:00",
          "thursdayEnd": "13:00",
          "sundayStart": "7:00",
          "sundayEnd": "21:00",
          "resource_id": 5
        },
        {
          "tuesdayStart": "13:00",
          "tuesdayEnd": "16:00",
          "thursdayStart": "9:00",
          "thursdayEnd": "13:00",
          "sundayStart": "7:00",
          "sundayEnd": "21:00",
          "resource_id": 6
        },
        {
          "tuesdayStart": "13:00",
          "tuesdayEnd": "16:00",
          "thursdayStart": "9:00",
          "thursdayEnd": "13:00",
          "sundayStart": "7:00",
          "sundayEnd": "21:00",
          "resource_id": 7
        },
        {
          "mondayStart": "1:00",
          "mondayEnd": "5:00",
          "saturdayStart": "14:00",
          "saturdayEnd": "20:00",
          "resource_id": 8
        },
        {
          "wednesdayStart": "13:00",
          "wednesdayEnd": "16:00",
          "fridayStart": "9:00",
          "fridayEnd": "13:00",
          "sundayStart": "7:00",
          "sundayEnd": "21:00",
          "resource_id": 9
        },
        {
          "tuesdayStart": "13:00",
          "tuesdayEnd": "16:00",
          "thursdayStart": "9:00",
          "thursdayEnd": "13:00",
          "sundayStart": "7:00",
          "sundayEnd": "21:00",
          "resource_id": 10
        },
        {
          "mondayStart": "1:00",
          "mondayEnd": "5:00",
          "saturdayStart": "14:00",
          "saturdayEnd": "20:00",
          "resource_id": 11
        },
        {
          "wednesdayStart": "13:00",
          "wednesdayEnd": "16:00",
          "fridayStart": "9:00",
          "fridayEnd": "13:00",
          "sundayStart": "7:00",
          "sundayEnd": "21:00",
          "resource_id": 12
        },
        {
          "tuesdayStart": "13:00",
          "tuesdayEnd": "16:00",
          "thursdayStart": "9:00",
          "thursdayEnd": "13:00",
          "sundayStart": "7:00",
          "sundayEnd": "21:00",
          "resource_id": 13
        }
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
      // createResource: async (
      //   name,
      //   address,
      //   phone,
      //   resourceType,
      //   website,
      //   description,
      //   latitude,
      //   longitude,
      //   picture,
      //   picture2,
      //   mondayStart,
      //   mondayEnd,
      //   tuesdayStart,
      //   tuesdayEnd,
      //   wednesdayStart,
      //   wednesdayEnd,
      //   thursdayStart,
      //   thursdayEnd,
      //   fridayStart,
      //   fridayEnd,
      //   saturdayStart,
      //   saturdayEnd,
      //   sundayStart,
      //   sundayEnd
      // ) => {
      //   const current_back_url = getStore().current_back_url;
      //   const current_front_url = getStore().current_front_url;
      //   const token = sessionStorage.getItem("token");
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
      //       category: resourceType,
      //       website: website,
      //       description: description,
      //       latitude: latitude,
      //       longitude: longitude,
      //       picture: picture,
      //       picture2: picture2,
      //       mondayStart: mondayStart,
      //       mondayEnd: mondayEnd,
      //       tuesdayStart: tuesdayStart,
      //       tuesdayEnd: tuesdayEnd,
      //       wednesdayStart: wednesdayStart,
      //       wednesdayEnd: wednesdayEnd,
      //       thursdayStart: thursdayStart,
      //       thursdayEnd: thursdayEnd,
      //       fridayStart: fridayStart,
      //       fridayEnd: fridayEnd,
      //       saturdayStart: saturdayStart,
      //       saturdayEnd: saturdayEnd,
      //       sundayStart: sundayStart,
      //       sundayEnd: sundayEnd,
      //     }),
      //   };
      //   try {
      //     const response = await fetch(
      //       current_back_url + "/api/createResource",
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
      setSearchResults: () => {
        let controller = new AbortController();
        let url = window.location.search;
        fetch(getStore().current_back_url + "/api/getResources" + url,
          {
            method: "GET",
            headers: {
              "access-control-allow-origin": "*",
              "Content-Type": "application/json",
            }
          }
        )
          .then((response) => response.json())
          .then((data) => {
            setStore({ searchResults: data.data });
            // console.log("search results", getStore().searchResults);
          })
          .catch((error) => console.log(error));
      },

      setBoundaryResults: (bounds) => {
        console.trace('setBoundaryResults called from:');

        let controller = new AbortController();
        let url = window.location.search;
        fetch(getStore().current_back_url + "/api/getBResults" + url,
          {
            method: "POST",
            headers: {
              "access-control-allow-origin": "*",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              neLat: bounds?.ne?.lat,
              neLng: bounds?.ne?.lng,
              swLat: bounds?.sw?.lat,
              swLng: bounds?.sw?.lng
            })
          }
        )
          .then((response) => response.json())
          .then((data) => {
            setStore({ boundaryResults: data.data });
          })
          // .then(data => console.log("boundary results", getStore().boundaryResults))
          .catch((error) => console.log(error));
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
