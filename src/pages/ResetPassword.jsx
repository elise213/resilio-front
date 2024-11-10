import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

const resetpassword = () => {
  const { store, actions } = useContext(Context);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const handleResetPassword = (e) => {
    e.preventDefault();
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      password: e.currentTarget.newPassword.value,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(store.current_back_url + "/api/change-password", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        Swal.fire({
          icon: "success",
          title: "Password Reset",
          text: "Your password has been reset successfully.",
        }).then(() => {
          setOpenLoginModal(false);
        });
      })
      .catch((error) => {
        console.log("error", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to reset password. Please try again.",
        });
      });
  };

  return (
    <form onSubmit={handleResetPassword}>
      <div>
        <label htmlFor="newPassword">New Password:</label>
        <input type="password" id="newPassword" name="newPassword" required />
      </div>
      <button type="submit">Reset Password</button>
    </form>
  );
};

export default resetpassword;
