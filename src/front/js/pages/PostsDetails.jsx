import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/landing.css";

export const PostsDetails = () => {
    const { store } = useContext(Context);

    return (
        <div className="row justify-content-center gamedet m-3">
            <div className="col-6">
                <div className="card tarjeta">
                    <div className="card-header">
                        <h2 className="text-light">{store.currentItem.title}</h2>
                    </div>
                    <img src={store.currentItem.image_url} className="card-img-top" alt={store.currentItem.name} />
                    <div className="card-body">
                        <p className="card-text text-light">{store.currentItem.body}</p>
                    </div>
                    <div className="d-flex justify-content-center m-3">
                        <div style={{ width: "70%", height: "60%", overflow: "hidden" }} className="d-flex justify-content-center align-items-center">
                            <img
                                src="https://i.ytimg.com/vi/fj245xMr-BM/maxresdefault.jpg"
                                className="img-fluid"
                                alt="Nvidia Publicidad"
                                style={{ objectFit: "cover", height: "100%", width: "auto" }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
