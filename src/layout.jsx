import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./component/navbar";
import Home from "./pages/home";
import Donate from "./pages/Donate";
import Contact from "./pages/Contact";
import Create from "./pages/Create";
import Edit from "./pages/Edit";
import Footer from "./component/Footer2";
import ScrollToTop from "./component/scrollToTop";
import injectContext from "./store/appContext";

const Layout = () => {
  const basename = import.meta.env.BASENAME || "";
  return (
    // <div className="new-container">
    <BrowserRouter basename={basename}>
      <ScrollToTop>
        <Navbar />
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<Contact />} path="/contact" />
          <Route element={<Create />} path="/create" />
          <Route element={<Donate />} path="/donate" />
          <Route element={<Edit />} path="/edit/:id" />
        </Routes>
        <Footer />
      </ScrollToTop>
    </BrowserRouter>
    // </div>
  );
};

export default injectContext(Layout);
