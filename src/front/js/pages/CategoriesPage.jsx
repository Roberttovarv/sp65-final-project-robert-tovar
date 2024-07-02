import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const CategoriesPage = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.fetchActionGames();
        actions.fetchRPGGames();
    }, []);

    return (
        <div className="container">
            <h1 className="text-center text-light">CATEGORÍAS</h1>

            <div className="mt-5">
                <h2 className="text-center text-light">JUEGOS DE ACCIÓN</h2>
                <div className="row flex-nowrap overflow-auto">
                    {store.actionGames.map((game, index) => (
                        <div key={index} className="card m-3" style={{ width: '18rem' }}>
                            <img src={game.background_image} className="card-img-top" alt={game.name} />
                            <div className="card-body">
                                <h5 className="card-title">{game.name}</h5>
                                <p className="card-text">Rating: {game.rating}</p>
                                <div className="d-flex justify-content-between">
                                    <Link to={'/game-details/' + game.id} className="btn btn-outline-secondary">Detalles</Link>
                                    <span className="text-danger me-2" onClick={() => actions.addFavorites(game.name)}>
                                        <i className="far fa-heart"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-5">
                <h2 className="text-center text-light">JUEGOS RPG</h2>
                <div className="row flex-nowrap overflow-auto">
                    {store.rpgGames.map((game, index) => (
                        <div key={index} className="card m-3" style={{ width: '18rem' }}>
                            <img src={game.background_image} className="card-img-top" alt={game.name} />
                            <div className="card-body">
                                <h5 className="card-title">{game.name}</h5>
                                <p className="card-text">Rating: {game.rating}</p>
                                <div className="d-flex justify-content-between">
                                    <Link to={'/game-details/' + game.id} className="btn btn-outline-secondary">Detalles</Link>
                                    <span className="text-danger me-2" onClick={() => actions.addFavorites(game.name)}>
                                        <i className="far fa-heart"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};