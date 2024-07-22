import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "./../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/navbar.css";

export const Navbar = () => {
    const { store, actions } = useContext(Context);

    const host = `${process.env.BACKEND_URL}`;

    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log("No token found in localStorage");
            return;
        }

        const response = await fetch(`${host}/api/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data.results);
        } else {
            console.log("Failed to fetch profile");
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <div>
            <nav className="navbar navst">
                <div className="container navst d-flex m-auto align-items-center mb-1">
                    <Link to="/">
                        <img src="https://static.vecteezy.com/system/resources/previews/027/190/610/original/pixel-art-joy-controller-icon-png.png" alt="" style={{ height: "40px", width: "60px", objectFit: "cover" }} />
                    </Link>
                    <div className="pointer h-100 div-btn">
                        <Link to="/store">
                            <span className="sombra-text">
                                <button className="nav-btn bordered-text">Tienda</button>
                            </span>
                        </Link>
                    </div>
                    <div className="pointer h-100 div-btn">
                        <Link to="/categories">
                            <button className="nav-btn bordered-text">Categorías</button>
                        </Link>
                    </div>
                    <div className="pointer h-100 div-btn">
                        <Link to="/reviews">
                            <button className="nav-btn bordered-text">Reseñas</button>
                        </Link>
                    </div>
                    {!store.isLogin ? (
                        <div className="pointer h-100 div-btn">
                            <Link to="/login-register">
                                <button className="nav-btn bordered-text">Ingresar</button>
                            </Link>
                        </div>
                    ) : (store.admin ? (
                        <div className="pointer h-100 div-btn">
                            <Link to="/adminpanel">
                                <button className="admin-button">Admin Panel</button>
                            </Link>
                        </div>
                    ) : (
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                Perfil
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li><Link to="/profile">Perfil</Link></li>
                                <li><a className="dropdown-item" href="#">Favs</a></li>
                                <li><a className="dropdown-item" onClick={actions.logout}>Logout</a></li>
                            </ul>
                        </div>
                    ))}
                </div>
            </nav>
        </div>
    );
};
