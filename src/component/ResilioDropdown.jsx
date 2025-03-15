import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Menu, MenuItem, IconButton } from "@mui/material";

const ResilioDropdown = ({}) => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const { store, actions } = useContext(Context);

  return (
    <div>
      <IconButton
        onClick={(e) => setAnchorEl2(e.currentTarget)}
        style={{ padding: "0" }}
      >
        <img
          src="/assets/RESILIOR.png"
          alt="Resilio Logo"
          style={{ width: "20px", height: "auto" }}
        />
      </IconButton>
      <Menu
        anchorEl={anchorEl2}
        open={Boolean(anchorEl2)}
        onClose={() => setAnchorEl2(null)}
      >
        <MenuItem
          onClick={() => {
            setAnchorEl2(null);
            actions.openAboutModal();
            console.log("setting about modal true");
          }}
        >
          About
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl2(null);
            actions.openDonationModal();
          }}
        >
          Donate
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl2(null);
            actions.openContactModal();
          }}
        >
          Contact
        </MenuItem>
      </Menu>
    </div>
  );
};

export default ResilioDropdown;
