import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../store/appContext.js";
import "../../../styles/adminpanel.css";
import { NotFound } from "../../component/NotFound.jsx";

export const AdminPanel = () => {
    const { store, actions } = useContext(Context);

    const navigate = useNavigate()

    useEffect(() => {
        if (!store.admin) navigate('/*');
    }, [store.admin, navigate]);

    return (
        <div className="d-flex flex-column bg-light" style={{ minHeight: "60vh" }}>
            <div className="container-fluid my-auto py-3">
                <div className="text-center mb-5">
                    <h1>Admin Panel</h1>
                </div>
                <div className="row justify-content-around mx-1 mx-sm-2 mx-md-4 mx-lg-5 align-items-center">
    {[
        { to: "/adminpanel/gamepanel", label: "Games" },
        { to: "/adminpanel/postpanel", label: "News" },
        { to: "/adminpanel/userpanel", label: "Users" },
        { to: "/adminpanel/videopanel", label: "Reviews" },
        { to: "/adminpanel/pfppanel", label: "Pfps" }
    ].map((item, index) => (
        <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-4">
            <Link to={item.to}>
                <button className="buttonAdmin w-100" style={{ height: "25vh" }}>
                    {item.label}
                </button>
            </Link>
        </div>
    ))}
</div>

            </div>
        </div>
    );
};
