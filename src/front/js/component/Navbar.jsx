import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "./../store/appContext";
import "../../styles/navbar.css";

export const Navbar = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.fetchProfile();
    }, []);

    return (
        <div className="navline">
            <nav className="navbar navst vt323-regular">
                <div className="container navst d-flex m-auto align-items-center mb-1">
                    <div id="logo">
                        <Link to="/">
                            <img src="https://static.vecteezy.com/system/resources/previews/027/190/610/original/pixel-art-joy-controller-icon-png.png" alt="logo" style={{ height: "40px", width: "60px", objectFit: "cover" }} />
                        </Link>
                    </div>
                    <div id="menu" className="d-flex m-0 align-items-center justify-content-between">
                        <div className="">
                        <Link to="/all-games" className="pointer">
                            <button className="nav-btn" style={{width: "auto"}}>All games</button>
                        </Link>
                        </div>
                        <div className="mx-5">
                        <Link to="/news" className="pointer">
                            <button className="nav-btn ">News</button>
                        </Link>
                        </div>
                        <div className="">
                        <Link to="/reviews" className="pointer">
                            <button className="nav-btn ">Reviews</button>
                        </Link>
                        </div>
                    </div>
                    <div id="login">
                        {!store.isLogin ? (
                            <Link to="/login-register" className="pointer">
                                <button className="nav-btn" style={{width: "auto"}}>Log in</button>
                            </Link>
                        ) : (
                            <div className="dropdown bgc">
                            <img src={store.user?.pfp} className="dropdown-toggle rounded-circle" id="dropdownMenuButton1" 
                                 data-bs-toggle="dropdown" height="35px" width="35px" style={{objectFit: "cover", cursor: "pointer"}} />
                            <ul className="dropdown-menu bgc border border-2 border-secondary" aria-labelledby="dropdownMenuButton1">
                                {store.admin && 
                                    <li className="text-danger">
                                        <Link to="/adminpanel" className="dropdown-item text-danger">Admin Panel</Link>
                                    </li>}
                                <li>
                                    <Link to="/profile" className="dropdown-item text-white">Profile</Link>
                                </li>
                                <li>
                                <Link to="/favs" className="dropdown-item text-white">Favs</Link>
                                </li>
                                <li style={{cursor: "pointer"}}>
                                    <a className="dropdown-item text-white" onClick={actions.logout}>Logout</a>
                                </li>
                            </ul>
                        </div>
                        
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
};
