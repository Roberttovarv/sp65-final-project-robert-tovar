import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext.js";
import "../../styles/adminpanel.css";


export const AdminPanel = () => {
    const { store, actions } = useContext(Context);

    return (
        <>
            <div>
                (
                <div className="d-flex flex-column" style={{ height: "80vh" }}>
                    <div className="text-center my-3">
                        <h1>Panel de administrador</h1>
                    </div>
                    <div className="container-fluid m-auto">
                        <div className="row justify-content-around mx-5 align-items-center" style={{ height: "100%" }}>
                            <div className="col-3">
                                <Link to="/adminpanel/gamepanel"><button className="comic-btn" style={{ height: "30vh", width: "20vw" }}>Videojuegos</button></Link>
                            </div>
                            <div className="col-3">
                            <Link to="/adminpanel/productpanel"><button className="comic-btn" style={{ height: "30vh", width: "20vw" }}>Productos</button></Link>
                            </div>
                            <div className="col-3">
                               <Link to="/adminpanel/postpanel"><button className="comic-btn" style={{ height: "30vh", width: "20vw" }}>Posts</button></Link>
                            </div>
                            <div className="col-3">
                            <Link to="/adminpanel/userpanel"><button className="comic-btn" style={{ height: "30vh", width: "20vw" }}>Usuarios</button></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};