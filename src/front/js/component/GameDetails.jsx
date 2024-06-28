import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useParams } from "react-router-dom";

export const GameDetails = () => {
    const { store, actions } = useContext(Context); 
    const params = useParams(); // Obtener los parámetros de la URL

    useEffect(() => {
        actions.getGames(); // Asumiendo que hay una acción para obtener todos los juegos
    }, []);

    // Verificar que los juegos estén disponibles en el store
    if (!store.games || store.games.length === 0) {
        return <div>Loading...</div>;
    }

    // Obtener el juego específico basado en el ID del parámetro
    const game = store.games.find(game => game.id === parseInt(params.gameId));
    if (!game) {
        return <div>Game not found</div>;
    }

    return (
        <div className="row justify-content-center">
            <div className="col-6">
                <div className="card">
                    <div className="card-header">
                        <strong>Game Title:</strong> {game.title}
                    </div>
                    {/* <img src={game.imageUrl} className="card-img-top" alt="..." /> */}
                    <div className="card-body">
                        <p className="card-text">Rating: {game.rating}</p>
                        <p className="card-text">Description: {game.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};