import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import injectContext from "./store/appContext.js";
// Custom Components
import { BackendURL } from "./component/BackendURL.jsx";
import { Navbar } from "./component/Navbar.jsx";
import { Footer } from "./component/Footer.jsx";
// Custom Pages
import { Home } from "./pages/Home.jsx";
import Logout from "./pages/Logout.jsx";
import { Loading } from "./component/Loading.jsx"
import { LoadingMario } from "./component/LoadingMario.jsx"
import { NotFound } from "./component/NotFound.jsx"
// 
import { GamePanel } from "./pages/admin/GamePanel.jsx"
import { AdminPanel } from "./pages/admin/AdminPanel.jsx"
import { UserPanel } from "./pages/admin/UserPanel.jsx"
import { PostPanel } from "./pages/admin/PostPanel.jsx"
import { VideoPanel } from "./pages/admin/VideoPanel.jsx"
import { PfpPanel } from "./pages/admin/PfpPanel.jsx"

import { LandingPage } from "./pages/LandingPage.jsx";
import { GameDetails } from "./pages/GameDetails.jsx";
import { Reviews } from "./pages/Reviews.jsx";
import { Posts } from "./pages/Posts.jsx";
import { PostsDetails } from "./pages/PostsDetails.jsx";
import { AllGames } from "./pages/AllGames.jsx";
import { Favs } from "./pages/Favs.jsx";

import { Profile } from "./pages/Profile.jsx";
import { LoginRegister } from "./pages/LoginRegister.jsx";

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
                <Navbar />
                <Routes>
                    <Route element={<Home />} path="/rigo" />
                    <Route element={<NotFound />} path="*" />
                    <Route element={<Logout />} path="/logout" />
                    <Route element={<Profile />} path="/profile" />
                    <Route element={<Favs />} path="/favs" />


                    <Route element={<UserPanel />} path="/adminpanel/userpanel" />
                    <Route element={<AdminPanel />} path="/adminpanel" />
                    <Route element={<GamePanel />} path="/adminpanel/gamepanel" />
                    <Route element={<PostPanel />} path="/adminpanel/postpanel" />
                    <Route element={<VideoPanel />} path="/adminpanel/videopanel" />
                    <Route element={<PfpPanel />} path="/adminpanel/pfppanel" />

                    <Route element={<LandingPage />} path="/" />
                    <Route element={<GameDetails />} path="/game-details/:gameId" />
                    <Route element={<Reviews />} path="/reviews" />
                    <Route element={<Posts />} path="/news" />
                    <Route element={<PostsDetails />} path="/news-details/:news-title" />
                    <Route element={<LoginRegister />} path="/login-register" />
                    <Route element={<AllGames />} path="/all-games" />


                    <Route element={<Loading />} path="/loading" />
                    <Route element={<LoadingMario />} path="/loadingmario" />


                </Routes>
                <Footer />
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
