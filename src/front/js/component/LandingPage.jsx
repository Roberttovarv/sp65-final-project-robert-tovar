import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const LandingPage = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.fetchTopGames();
        actions.fetchBestRatedGames();
    }, []);

    return (
        <div className="container">
            <h1 className="text-center text-light">TOP JUEGOS</h1>
            <div className="row flex-nowrap overflow-auto">
                {store.topGames.map((game, index) => (
                    <div key={index} className="card m-3" style={{ width: '18rem' }}>
                        <img src={game.background_image} className="card-img-top" alt={game.name} />
                        <div className="card-body">
                            <h5 className="card-title">{game.name}</h5>
                            <p className="card-text">Rating: {game.rating}</p>
                            <div className="d-flex justify-content-between">
                                <Link to={'/game-details/' + game.id} className="btn btn-outline-secondary">Details</Link>
                                <span className="text-danger me-2" onClick={() => actions.addFavorites(game.name)}>
                                    <i className="far fa-heart"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <h1 className="text-center text-light mt-5">JUEGOS MEJOR VALORADOS</h1>
            <div className="row flex-nowrap overflow-auto">
                {store.bestRatedGames.map((game, index) => (
                    <div key={index} className="card m-3" style={{ width: '18rem' }}>
                        <img src={game.background_image} className="card-img-top" alt={game.name} />
                        <div className="card-body">
                            <h5 className="card-title">{game.name}</h5>
                            <p className="card-text">Rating: {game.rating}</p>
                            <div className="d-flex justify-content-between">
                                <Link to={'/game-details/' + game.id} className="btn btn-outline-secondary">Details</Link>
                                <span className="text-danger me-2" onClick={() => actions.addFavorites(game.name)}>
                                    <i className="far fa-heart"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
