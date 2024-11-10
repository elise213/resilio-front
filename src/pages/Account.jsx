import React from "react";
import { Link } from "react-router-dom";

const Account = () => {
  return (
    <div>
      {" "}
      <Link to="/resetpassword">Change Your Name or Password</Link>;
      <Link to="/closeaccount">Close Your Account</Link>;
    </div>
  );
};

export default Account;
