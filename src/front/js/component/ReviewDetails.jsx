import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useParams } from "react-router-dom";

export const ReviewDetails = () => {
    const { store, actions } = useContext(Context);
    const params = useParams();

    useEffect(() => {
        actions.getReview(params.reviewId);
    }, [params.reviewId, actions]);

    const review = store.review;

    if (!review) return <div>Loading...</div>; // Muestra un mensaje de carga mientras se obtiene la reseña

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-6">
                    <div className="card">
                        <div className="card-header">
                            <strong>{review.title}</strong>
                        </div>
                        <img src={review.imageUrl} className="card-img-top" alt={review.title} />
                        <div className="card-body">
                            <p className="card-text">{review.description}</p>
                            <p className="card-text"><strong>Comentario:</strong> {review.comment}</p>
                            <button className="btn btn-primary" onClick={() => actions.addToCart(review.gameId)}>Añadir al carrito</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};