import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Menu, MenuItem, IconButton, Tooltip, Icon } from "@mui/material";
import { Link } from "react-router-dom";

const AuthorizedToolbox = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const { store, actions } = useContext(Context);

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl2(e.currentTarget)}>
        <Tooltip title="Admin Tools" arrow>
          <Icon
            style={{ cursor: "pointer", color: "black" }}
            sx={{ fontSize: 18 }}
          >
            handyman
          </Icon>
        </Tooltip>
      </IconButton>
      <Menu
        anchorEl={anchorEl2}
        open={Boolean(anchorEl2)}
        onClose={() => setAnchorEl2(null)}
      >
        <MenuItem onClick={() => setAnchorEl2(null)}>
          <Link to={`/approveComments`}> Approve Comments</Link>
        </MenuItem>
      </Menu>
    </>
  );
};

export default AuthorizedToolbox;
