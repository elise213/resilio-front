import React from "react";

const GeneratedTreasureMap = ({ closeModal, selectedResources }) => {
  const getTextRepresentation = (resources) => {
    return resources
      .map((res) => {
        return `ID: ${res.id}, Name: ${res.name}, Description: ${res.description}\n`;
      })
      .join("\n");
  };

  const textRepresentation = getTextRepresentation(selectedResources);

  return (
    <div className="modal-overlay-treasure">
      <div className="modal-content-treasure">
        <button className="modal-close-treasure" onClick={closeModal}>
          X
        </button>
        <textarea
          className="text-area"
          value={textRepresentation}
          readOnly={true}
        />
      </div>
    </div>
  );
};

export default GeneratedTreasureMap;
