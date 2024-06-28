import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const LandingPage = () => {
    const { store, actions } = useContext(Context); 

    // Esto es un ejemplo hasta que consigamos los datos de la API, que sustituire abajo 
    const topGames = [
        { id: 1, title: "Game 1", rating: 4.5, imageUrl: "path_to_image1" },
        { id: 2, title: "Game 2", rating: 4.7, imageUrl: "path_to_image2" },
        { id: 3, title: "Game 3", rating: 4.6, imageUrl: "path_to_image3" },
        { id: 7, title: "Game 7", rating: 4.2, imageUrl: "path_to_image7" },
        { id: 8, title: "Game 8", rating: 4.1, imageUrl: "path_to_image8" },
        { id: 9, title: "Game 9", rating: 4.4, imageUrl: "path_to_image9" }
    ];

    const bestRatedGames = [
        { id: 4, title: "Game 4", rating: 5.0, imageUrl: "path_to_image4" },
        { id: 5, title: "Game 5", rating: 4.9, imageUrl: "path_to_image5" },
        { id: 6, title: "Game 6", rating: 4.8, imageUrl: "path_to_image6" },
        { id: 10, title: "Game 10", rating: 4.7, imageUrl: "path_to_image10" },
        { id: 11, title: "Game 11", rating: 4.6, imageUrl: "path_to_image11" },
        { id: 12, title: "Game 12", rating: 4.9, imageUrl: "path_to_image12" }
    ];

    // Este useEffect es para hacer fetch de los datos cuando tenga la URL de la API.
    useEffect(() => {
        // actions.fetchTopGames(); // Función para obtener los juegos top.
        // actions.fetchBestRatedGames(); // Función para obtener los juegos mejor valorados. Tendre que irme a flux para editar en actions
    }, []);

    return (
        <div className="container">
            <h1 className="text-center text-light">TOP JUEGOS</h1>
            <div className="row flex-nowrap overflow-auto">
                {topGames.map((game, index) => (
                    <div key={index} className="card m-3" style={{ width: '18rem' }}>
                        <img src={game.imageUrl} className="card-img-top" alt={game.title} />
                        <div className="card-body">
                            <h5 className="card-title">{game.title}</h5>
                            <p className="card-text">Rating: {game.rating}</p>
                            <div className="d-flex justify-content-between">
                                <Link to={'/game-details/' + game.id} className="btn btn-outline-secondary">Details</Link>
                                <span className="text-danger me-2" onClick={() => actions.addFavorites(game.title)}>
                                    <i className="far fa-heart"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <h1 className="text-center text-light mt-5">JUEGOS MEJOR VALORADOS</h1>
            <div className="row flex-nowrap overflow-auto">
                {bestRatedGames.map((game, index) => (
                    <div key={index} className="card m-3" style={{ width: '18rem' }}>
                        <img src={game.imageUrl} className="card-img-top" alt={game.title} />
                        <div className="card-body">
                            <h5 className="card-title">{game.title}</h5>
                            <p className="card-text">Rating: {game.rating}</p>
                            <div className="d-flex justify-content-between">
                                <Link to={'/game-details/' + game.id} className="btn btn-outline-secondary">Details</Link>
                                <span className="text-danger me-2" onClick={() => actions.addFavorites(game.title)}>
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