import React from "react";
// import ResourceCard from "./ResourceCard";

const Favorites = () => {
  const { store, actions } = useContext(Context);

  return (
    <>
      {/* {activeTab === "Favorites" && isLoggedIn && (
        <ul>
          {Array.isArray(store.favorites) &&
            store.favorites
              .filter((resource) => {
                const nameMatches =
                  resource.name &&
                  resource.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
                const descriptionMatches =
                  resource.description &&
                  resource.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
                return nameMatches || descriptionMatches;
              })
              .map((resource, index) => (
                <ResourceCard
                  key={`${resource.id}-${index}`}
                  number={index + 1}
                  item={resource}
                  openModal={actions.openModal}
                  closeModal={actions.closeModal}
                  modalIsOpen={modalIsOpen}
                />
              ))}
        </ul>
      )} */}
    </>
  );
};

export default Favorites;
