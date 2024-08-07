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
    const [likedGames, setLikedGames] = useState(new Set());

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

    useEffect(() => {
        const fetchLikedGames = async () => {
            const response = await fetch(`${host}/api/user/likes`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${store.token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                const likedSet = new Set(data.likedGames.map(game => game.id));
                setLikedGames(likedSet);
            } else {
                console.log("Error fetching liked games", response.status, response.statusText);
            }
        };

        if (store.token) {
            fetchLikedGames();
        }
    }, [store.token]);

    const handleLike = async (gameId) => {
        const isLiked = likedGames.has(gameId);

        const method = isLiked ? 'DELETE' : 'POST';
        const uri = `${host}/api/games/${gameId}/like`;

        const response = await fetch(uri, {
            method: method,
            headers: {
                'Authorization': `Bearer ${store.token}`
            }
        });

        if (response.ok) {
            const newLikedGames = new Set(likedGames);
            if (isLiked) {
                newLikedGames.delete(gameId);
            } else {
                newLikedGames.add(gameId);
            }
            setLikedGames(newLikedGames);
            getGames();
        } else {
            console.log("Error", response.status, response.statusText);
        }
    };

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
                                            <button className="btn btn-primary" onClick={() => actions.setCurrentItem(game)}>
                                                Details
                                            </button>
                                        </Link>
                                        <span 
                                            className={`text-danger ${likedGames.has(game.id) ? 'text-danger' : 'text-muted'}`} 
                                            onClick={() => handleLike(game.id)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <i className={`far fa-heart ${likedGames.has(game.id) ? 'fas' : 'far'}`}></i>
                                        </span>
                                        <span>{game.likes} Likes</span>
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
