import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const Reviews = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        // Llamada simulada para obtener reseñas (hasta que tengas una API real)
        const simulatedReviews = [
            { id: 1, title: "Reseña 1", description: "Descripción de la reseña 1" },
            { id: 2, title: "Reseña 2", description: "Descripción de la reseña 2" },
            { id: 3, title: "Reseña 3", description: "Descripción de la reseña 3" },
            { id: 4, title: "Reseña 4", description: "Descripción de la reseña 4" },
            { id: 5, title: "Reseña 5", description: "Descripción de la reseña 5" }
        ];
        
        actions.setReviews(simulatedReviews); // Simulamos guardar las reseñas en el store
    }, []);

    const reviews = store.reviews; // Obtenemos las reseñas del store

    return (
        <div className="container">
            <h1 className="text-center text-light">Reseñas</h1>
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
            </div>
        </div>
    );
};