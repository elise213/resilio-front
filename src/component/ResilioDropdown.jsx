import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Menu, MenuItem, IconButton } from "@mui/material";

const ResilioDropdown = ({
  setAboutModalIsOpen,
  setContactModalIsOpen,
  setDonationModalIsOpen,
}) => {
  const [anchorEl2, setAnchorEl2] = useState(null);

  return (
    <div>
      <IconButton
        onClick={(e) => setAnchorEl2(e.currentTarget)}
        style={{ padding: "0" }}
      >
        <img
          src="/assets/RESILIOR.png"
          alt="Resilio Logo"
          style={{ width: "25px", height: "auto" }}
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
            setAboutModalIsOpen(true);
            console.log("setting about modal true");
          }}
        >
          About
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl2(null);
            setDonationModalIsOpen(true);
          }}
        >
          Donate
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl2(null);
            setContactModalIsOpen(true);
          }}
        >
          Contact
        </MenuItem>
      </Menu>
    </div>
  );
};

export default ResilioDropdown;
