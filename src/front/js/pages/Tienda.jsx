import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';


import { useState } from "react";
import "../../styles/store.css";



export const Tienda = () => {
    const { store, actions } = useContext(Context);
    const [games, setGames] = useState([]);

    const host = `${process.env.BACKEND_URL}`
    const getGames = async () => {
        
        const uri = host + '/api/games';
        const options = { method: 'GET' };
        
        const response = await fetch(uri, options);
        
        if (!response.ok) {
            console.log("Error", response.status, response.statusText);
        }
        
        const data = await response.json();
        setGames(data.results);
    };
    
    
    
    
    useEffect(() => {
        getGames();
        // postGames();
    }, []);
    console.log(games);
    
    return (
        <div className="container">
            <h1 className="text-center text-dark">TIENDA</h1>

            <div className="row">
                {games.map((game, index) => (
                    <div key={index} className="col-md-4">

                        <div className="card mb-4 shadow-box py-4 px-4 card-round">
                            <img src={game.background_image} className="card-img-top card-round img-div" width="250" height='250' alt={game.name} />

                            <div className="card-body">
                                <h5 className="card-title">{game.name}</h5>
                                <p className="card-text">Rating: {game.rating}</p>
                                <div className="d-flex justify-content-between align-items-center">
                                    <Link to={'/game-details/' + game.id} className="btn btn-outline-secondary">Details</Link>
                                    <button className="btn btn-outline-primary">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


    // const postGames = async () => {
    //     const uri = host + '/api/apiexterna';
    //     const options = {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             game_ids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50]
    //         })
    //     }
    //     const response = await fetch(uri, options);

    //     if (!response.ok) {
    //         console.log("Error", response.status, response.statusText);
    //     }
    // }

    