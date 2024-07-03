import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useParams } from "react-router-dom";

export const GameDetails = () => {
    const { store, actions } = useContext(Context); 
    const { gameId } = useParams(); // Obtenego los parámetros de la URL

    useEffect(() => {
        actions.getGameDetails(gameId); // Asumiendo que hay una acción para obtener los detalles del juego
    }, [gameId]);

    // Hay q verificar que los detalles del juego estén disponibles en el store
    const game = store.selectedGame;
    if (!game) {
        return <div>Loading...</div>;
    }

    return (
        <div className="row justify-content-center gamedet">
            <div className="col-6">
                <div className="card">
                    <div className="card-header">
                        <strong>Game Title:</strong> {game.name}
                    </div>
                    <img src={game.background_image} className="card-img-top" alt={game.name} />
                    <div className="card-body">
                        <p className="card-text">Rating: {game.rating}</p>
                        <p className="card-text">Description: {game.description_raw}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};