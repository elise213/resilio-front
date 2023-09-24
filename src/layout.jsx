import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import Footer from "./component/footer";
import Resource from "./pages/Resource";
import Home from "./pages/home";
import Donate from "./pages/Donate";
import Contact from "./pages/Contact";
import Create from "./pages/Create";
import injectContext from "./store/appContext";
import Navbar from "./component/navbar";
import Edit from "./pages/Edit"

const Layout = () => {
  const basename = import.meta.env.BASENAME || "";
  return (
    <div>
      <BrowserRouter basename={basename}>
        <ScrollToTop>
          <Navbar />
          <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<Resource />} path="/resource/:id" />
            <Route element={<Contact />} path="/contact" />
            <Route element={<Create />} path="/create" />
            <Route element={<Donate />} path="/donate" />
            <Route element={<Edit />} path="/edit/:id" />
          </Routes>
          <Footer />
        </ScrollToTop>
      </BrowserRouter>
    </div>
  );
};

export default injectContext(Layout);
