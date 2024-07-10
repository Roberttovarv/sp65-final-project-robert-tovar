import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const Reviews = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
          
    }, []);


    return (
        <div className="container">
            {/* <h1 className="text-center text-light">Reseñas</h1>
            <div className="row overflow-auto" style={{ maxHeight: '80vh' }}>
                {reviews.map((review, index) => (
                    <div key={index} className="card m-3" style={{ width: '18rem' }}>
                        <div className="card-body">
                            <h5 className="card-title">{review.title}</h5>
                            <p className="card-text">{review.description}</p>
                            <div className="d-flex justify-content-between">
                                <Link to={'/review-details/' + review.id} className="btn btn-outline-secondary">Detalles</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div> */}
            Reseñas
        </div>
    );
};