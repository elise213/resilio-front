import React from "react";
import { Link } from "react-router-dom";

const AdminTools = () => {
  return (
    <div>
      <p className="problem">
        Click {""}
        <Link to="/create">here</Link>
        {""} to create a new resource listing
      </p>
    </div>
  );
};

export default AdminTools;
