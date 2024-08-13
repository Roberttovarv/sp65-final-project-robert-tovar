import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/landing.css";
import { LoadingMario } from "../component/LoadingMario.jsx";

export const AllGames = () => {
    const { store, actions } = useContext(Context);
    const [games, setGames] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredGames, setFilteredGames] = useState([]);

    const host = `${process.env.BACKEND_URL}`;

    const getGames = async () => {
        const uri = host + '/api/games';
        const options = { method: 'GET' };

        const response = await fetch(uri, options);

        if (!response.ok) {
            console.log("Error", response.status, response.statusText);
            return;
        }

        const data = await response.json();
        setGames(data.results);
        setFilteredGames(data.results);
    };

    const handleInputChange = (event) => {
        setSearch(event.target.value);
    };

    useEffect(() => {
        getGames();
    }, []);

    useEffect(() => {
        const filtered = games.filter(game => 
            game.name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredGames(filtered);
    }, [search, games]);



    return (
        <div className="container">
            <div className="row">
                <div className="col-12 text-end mb-4">
                    <div className="form__group field float-end ps-5">
                        <input 
                            type="input" 
                            className="form__field" 
                            placeholder="Search" 
                            value={search} 
                            onChange={handleInputChange} 
                        />
                        <label htmlFor="name" className="form__label">Search</label>
                    </div>
                </div>
                <div className="col-12 text-center mb-5">
                    <h1 className="text-light">All Games</h1>
                    <h4 className="text-light">Good luck finding your game, freak!</h4>
                </div>
            </div>
            {games.length === 0 ? (
                <LoadingMario />
            ) : (
                <div className="row">
                    {filteredGames.map((game, index) => (
                        <div key={index} className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4 d-flex justify-content-center">
                            <div className="card tarjeta d-flex flex-column justify-content-between" style={{ width: '18rem' }}>
                                <div className="image-container">
                                    <img 
                                        src={game.background_image} 
                                        className="card-img-top" 
                                        alt={game.name} 
                                    />
                                </div>
                                <div className="card-body d-flex flex-column justify-content-end">
                                    <h5 className="card-title text-light">{game.name}</h5>
                                    <div className="d-flex justify-content-between align-items-center mt-auto">
                                        <Link to={`/game-details/${game.name}`}>
                                            <button className="button" onClick={() => actions.setCurrentItem(game)}>
                                                Details
                                            </button>
                                        </Link>
                                        <span className="text-light">
                                        {game.likes} &nbsp; <i className={`far fa-heart far`} style={{ cursor: 'pointer' }}></i> 
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
