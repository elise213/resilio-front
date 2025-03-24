import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Menu, MenuItem, IconButton } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Link } from "react-router-dom";

const ResilioDropdown = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const { store, actions } = useContext(Context);

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl2(e.currentTarget)}>
        <InfoOutlinedIcon sx={{ fontSize: 20, color: "black" }} />
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
            console.log("Opening About Modal");
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
    </>
  );
};

export default ResilioDropdown;
