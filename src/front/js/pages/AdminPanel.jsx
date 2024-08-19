import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext.js";
import "../../styles/adminpanel.css";
import { NotFound } from "../component/NotFound.jsx";

export const AdminPanel = () => {
    const { store, actions } = useContext(Context);

    const navigate = useNavigate()

    useEffect(() => {
    !store.admin ? navigate('/*') : ''
    }, [])

    return (
        <>

                <div className="d-flex flex-column bg-light" style={{ height: "80vh" }}>
                    <div className="container-fluid m-auto">
                    <div className="text-center mb-3">
                        <h1 className="">Panel de administrador</h1>
                    </div>
                        <div className="row justify-content-around mx-1 mx-sm-2 mx-md-4 mx-lg-5 align-items-center" style={{ height: "100%" }}>
                            <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                                <Link to="/adminpanel/gamepanel">
                                    <button className="buttonAdmin w-100" style={{ height: "30vh" }}>Videojuegos</button>
                                </Link>
                            </div>

                            <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                                <Link to="/adminpanel/postpanel">
                                    <button className="buttonAdmin w-100" style={{ height: "30vh" }}>Posts</button>
                                </Link>
                            </div>
                            <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                                <Link to="/adminpanel/userpanel">
                                    <button className="buttonAdmin w-100" style={{ height: "30vh" }}>Usuarios</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            
        </>
    );
};
