import React, { useContext, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import Create from "./pages/Create.jsx";
import Edit from "./pages/Edit.jsx";
import Donate from "./pages/Donate.jsx";
import Account from "./pages/Account.jsx";
import ScrollToTop from "./component/scrollToTop.jsx";
import injectContext, { Context } from "./store/appContext.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import ProfileSettings from "./pages/ProfileSettings.jsx";

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
          <Route element={<Donate />} path="/donate" />
          <Route element={<ProfileSettings />} path="/profilesettings/:id" />
        </Routes>
      </ScrollToTop>
    </BrowserRouter>
  );
};

export default injectContext(Layout);
