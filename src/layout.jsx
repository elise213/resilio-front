import React, { useContext, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import UserProfile from "./pages/UserProfile";
import Create from "./pages/Create";
import Edit from "./pages/Edit";
import Account from "./pages/Account";
import ScrollToTop from "./component/scrollToTop";
import injectContext from "./store/appContext";
import { Context } from "./store/appContext";
import ResetPassword from "./pages/ResetPassword";
import ProfileSettings from "./pages/ProfileSettings";

const Layout = () => {
  const basename = import.meta.env.BASENAME || "";
  const { store, actions } = useContext(Context);

  return (
    <BrowserRouter basename={basename}>
      <ScrollToTop>
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<UserProfile />} path="/profile/:id" />
          <Route element={<Create />} path="/create" />
          <Route element={<ResetPassword />} path="/reset-password" />
          <Route element={<Account />} path="/account" />
          <Route element={<Edit />} path="/edit/:id" />
          <Route element={<ProfileSettings />} path="/profilesettings/:id" />
        </Routes>
      </ScrollToTop>
    </BrowserRouter>
  );
};

export default injectContext(Layout);
