import React, { useContext, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import UserProfile from "./pages/UserProfile";
import Create from "./pages/Create";
import Edit from "./pages/Edit";
import Favorites from "./pages/Favorites";
import Account from "./pages/Account";
import injectContext from "./store/appContext";
import { Context } from "./store/appContext";
import ResetPassword from "./pages/ResetPassword";
import ProfileSettings from "./pages/ProfileSettings";
import AdminTools from "./pages/AdminTools";

const Layout = () => {
  const basename = import.meta.env.BASENAME || "";
  const { store, actions } = useContext(Context);

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<AdminTools />} path="/admin" />
        <Route element={<UserProfile />} path="/profile/:id" />
        <Route element={<Create />} path="/create" />
        <Route element={<ResetPassword />} path="/resetpassword" />
        <Route element={<Account />} path="/account" />
        <Route element={<Favorites />} path="/favorites" />
        <Route element={<Edit />} path="/edit/:id" />
        <Route element={<ProfileSettings />} path="/profilesettings/:id" />
      </Routes>
    </BrowserRouter>
  );
};

export default injectContext(Layout);
