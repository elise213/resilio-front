import React, { useContext, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import UserProfile from "./pages/UserProfile";
// import Donate from "./pages/Donate";
import Create from "./pages/Create";
import Edit from "./pages/Edit";
// import Footer from "./component/Footer2";
import ScrollToTop from "./component/scrollToTop";
import injectContext from "./store/appContext";
import { Context } from "./store/appContext";

const Layout = () => {
  const basename = import.meta.env.BASENAME || "";
  const { store, actions } = useContext(Context);

  return (
    <BrowserRouter basename={basename}>
      <ScrollToTop>
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<UserProfile />} path="/profile" />
          <Route element={<Create />} path="/create" />
          {/* <Route element={<Donate />} path="/donate" /> */}
          <Route element={<Edit />} path="/edit/:id" />
        </Routes>
      </ScrollToTop>
    </BrowserRouter>
  );
};

export default injectContext(Layout);
