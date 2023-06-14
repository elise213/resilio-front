import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import Resource from "./pages/Resource";
import Home from "./pages/home";
import Donate from "./pages/Donate";
import { Contact } from "./pages/Contact";
import injectContext from "./store/appContext";
import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";

//create your first component
const Layout = () => {
  //the basename is used when your project is published in a subdirectory and not in the root of the domain
  // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
  const basename = process.env.BASENAME || "";

  return (
    <div>
      <BrowserRouter basename={basename}>
        <ScrollToTop>
          <Navbar />
          <Routes>
            <Route element={<Home />} path="/" />
            {/* <Route element={<Offerings />} path="/offerings" />
            <Route element={<Offering />} path="/offering/:id" /> */}
            <Route element={<Resource />} path="/resource/:id" />
            <Route element={<Contact />} path="/contact" />
            <Route element={<Donate />} path="/donate" />
            {/* User Pages */}
            {/* <Route element={<UserProfile />} path="/userProfile" />
            <Route element={<OfferingPost />} path="/offeringPost" /> */}

            {/* Organization Pages */}
            {/* <Route element={<RegisterAsDrop />} path="/registerAsDrop" />
            <Route element={<CreateResource />} path="/createResource" /> */}

          </Routes>
          {/* <Footer /> */}
        </ScrollToTop>
      </BrowserRouter>
    </div>
  );
};

export default injectContext(Layout);
