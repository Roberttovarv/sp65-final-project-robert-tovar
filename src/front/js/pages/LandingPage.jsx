import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

import { useState } from "react";
import "../../styles/landing.css";



export const LandingPage = () => {
    const { store, actions } = useContext(Context);
    const [gamesDate, setGamesDate] = useState([]);
    const [gamesRate, setGamesRate] = useState([]);

    const host = `${process.env.BACKEND_URL}`

    const getGames = async () => {
        const uri = host + '/api/games';
        const options = { method: 'GET' };

        const response = await fetch(uri, options);

        if (!response.ok) {
            console.log("Error", response.status, response.statusText);
            return;
        }

        const data = await response.json();


        const sortedByDate = [...data.results].sort((a, b) => new Date(b.released_at) - new Date(a.released_at));
        const sortedByRate = [...data.results].sort((a, b) => b.metacritic - a.metacritic);

        setGamesDate(sortedByDate);
        setGamesRate(sortedByRate);
    };

    useEffect(() => {
        getGames();
    }, []);
    console.log();

    return (
        <div className="container">
            <div className="m-5 d-flex justify-content-center">
                <a href="https://igf.com/" target="_blank">
                <img className="cursor" src="https://clan.cloudflare.steamstatic.com/images/34046344/c7e4cc713489537c80341bd7a05bd51982212311.png" alt="Independent Games Festival 2024"
                    style={{ height: "400px", width: "850px", objectFit: "cover" }} />
                    </a>
            </div>
            <h1 className="text-center text-light">Newest Games</h1>


            <div className="row flex-nowrap overflow-auto pb-2" style={{ maxHeight: "55vh", minHeight: "30vh", width: "100%", overflowY: "auto", scrollbarColor: "white transparent", borderRadius: "15px"}}>
                {gamesDate.slice(0, 20).map((game, index) => (
                    <div key={index} className="tarjeta m-3" style={{ width: '18rem' }}>
                        <img src={game.background_image} className=" text-light rounded-1" alt={game.name} style={{ width: "100%", maxHeight: "40%" }} />
                        <div className="card-body">
                            <h5 className="card-title text-light rounded-1">{game.name}</h5>
                            <p className="card-text text-light rounded-1">Releasing date: {game.released_at}</p>
                            <div className="d-flex justify-content-between">
                                <Link to={`/game-details/${game.id}`} >
                                    <button className="btn btn-outline-secondary text-light rounded-1" onClick={() => actions.setCurrentGame(game)}>
                                        Details
                                    </button>
                                </Link>
                                <span className="text-danger me-2">
                                    <i className="far fa-heart"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <h1 className="text-center text-light">Best Rated</h1>
            <div className="row flex-nowrap overflow-auto pb-2" style={{ maxHeight: "55vh",  minHeight: "30vh", width: "100%"}}>
                {gamesRate.slice(0, 20).map((game, index) => (
                    <div key={index} className="tarjeta m-3" style={{ width: '18rem' }}>
                        <img src={game.background_image} className=" text-light rounded-1" alt={game.name} style={{ width: "100%", maxHeight: "45%" }} />
                        <div className="card-body">
                            <h5 className="card-title text-light rounded-1">{game.name}</h5>
                            <p className="card-text text-light rounded-1">Rating: {game.metacritic}</p>
                            <div className="d-flex justify-content-between">
                                <Link to={`/game-details/${game.id}`} className="btn btn-outline-secondary text-light rounded-1">
                                    Details
                                </Link>
                                <span className="text-danger me-2">
                                    <i className="far fa-heart"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
