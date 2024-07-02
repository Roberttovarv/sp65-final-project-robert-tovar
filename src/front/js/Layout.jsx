import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import injectContext from "./store/appContext.js";
// Custom Components
import ScrollToTop from "./component/ScrollToTop.jsx";
import { BackendURL } from "./component/BackendURL.jsx";
import { Navbar } from "./component/Navbar.jsx";
import { Footer } from "./component/Footer.jsx";
// Custom Pages
import { Home } from "./pages/Home.jsx";
import { Demo } from "./pages/Demo.jsx";
import { Single } from "./pages/Single.jsx";
import { Login } from "./pages/Login.jsx";
import { Signup } from "./pages/Signup.jsx";
import { Users } from "./pages/Users.jsx";
import Logout from "./pages/Logout.jsx";
// 
import { GamePanel } from "./pages/GamePanel.jsx"
import { AdminPanel } from "./pages/AdminPanel.jsx"
import { UserPanel } from "./pages/UserPanel.jsx"
import { PostPanel } from "./pages/PostPanel.jsx"
import { ProductPanel } from "./pages/ProductPanel.jsx";

import { Welcome } from "./component/Welcome.jsx";
import { LandingPage } from "./pages/LandingPage.jsx";
import { GameDetails } from "./pages/GameDetails.jsx";
import { Reviews } from "./pages/Reviews.jsx";
import { Tienda } from "./pages/Tienda.jsx";
import { CategoriesPage } from "./pages/CategoriesPage.jsx";

// Create your first component
const Layout = () => {
    /* 
    The basename is used when your project is published in a subdirectory and not in the root of the domain
    you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    */
    const basename = process.env.BASENAME || "";
    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <div >
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/rigo" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<Signup />} path="/signup" />
                        <Route element={<h1>Not found!</h1>} path="*" />
                        <Route element={<Users />} path="/users" />
                        <Route element={<Logout />} path="/logout" />

                        <Route element={<UserPanel />} path="/adminpanel/userpanel" />
                        <Route element={<AdminPanel />} path="/adminpanel" />
                        <Route element={<GamePanel />} path="/adminpanel/gamepanel" />
                        <Route element={<PostPanel />} path="/adminpanel/postpanel" />
                        <Route element={<ProductPanel />} path="/adminpanel/productpanel" />

                        <Route element={<Welcome />} path="welcome" />
                        <Route element={<LandingPage />} path="/" />
                        <Route element={<GameDetails />} path="/game-details/:gameId" />
                        <Route element={<Reviews />} path="/reviews" />
                        <Route element={<Tienda />} path="/store" />
                        <Route element={<CategoriesPage />} path="/categories" />


                      </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
