import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/landing.css";
import { LoadingMario } from "../component/LoadingMario.jsx";
import { useNavigate } from "react-router-dom";

export const LandingPage = () => {
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);
    const [gamesDate, setGamesDate] = useState([]);
    const [gamesRate, setGamesRate] = useState([]);
    
    const user = store.user || {}

    const getGames = async () => {
        if (store.games.length === 0) {
            await actions.getGames();
        }

        const sortedByDate = [...store.games].sort((a, b) => new Date(b.released_at) - new Date(a.released_at));
        const sortedByRate = [...store.games].sort((a, b) => b.metacritic - a.metacritic);

        setGamesDate(sortedByDate);
        setGamesRate(sortedByRate);
    };

    useEffect(() => {
        getGames();
        actions.fetchProfile();
    }, [actions]);
    
    return (
        <div className="container bg-black bg-opacity-10">
            <h1 className="text-center text-light py-5">Newest Games</h1>

            {gamesDate.length === 0 ? 
                (<LoadingMario />) : 
                (<div className="row flex-nowrap overflow-auto pb-2 d-flex pe-3 m-auto justify-content-start" 
                    style={{ maxHeight: "55vh", minHeight: "30vh", width: "99%", overflowY: "auto", scrollbarColor: "rgba(255, 255, 255, 0.3) transparent", scrollbarWidth: "thin" }}>
                    {gamesDate.slice(0, 20).map((game, index) => (
                        <div key={index} className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4 d-flex justify-content-center">
                            <div className="card tarjeta d-flex flex-column justify-content-between" style={{ width: '18rem' }}>
                                <div className="image-container">
                                    <img 
                                        src={game.background_image} 
                                        className="card-img-top" 
                                        alt={game.name} 
                                        style={{ width: "100%", maxHeight: "auto", objectFit: "cover" }} 
                                    />
                                </div>
                                <div className="card-body d-flex flex-column justify-content-end">
                                    <h5 className="card-title text-light">{game.name}</h5>
                                    <p className="card-text text-light">Releasing date: {game.released_at}</p>
                                    <div className="d-flex justify-content-between align-items-center mt-auto">
                                        <Link to={`/game-details/${game.name}`}>
                                            <button className="button" onClick={() => actions.setCurrentItem(game)}>
                                                Details
                                            </button>
                                        </Link>
                                        <span>
                                            <strong className="text-light">{game.likes} &nbsp;</strong> 
                                            <i 
                                                className={`far fa-heart hover-shadow ${game.is_liked ? "fas text-danger" : "far text-light"}`} 
                                                style={{ cursor: 'pointer' }} 
                                                onClick={() => store.isLogin ? actions.handleGameLike(game.id) : navigate("/login-register")}
                                            ></i> 
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>)
            }

            <h1 className="text-center text-light my-5">Best Rated</h1>

            {gamesRate.length === 0 ?
                (<LoadingMario />) : 
                (<div className="row flex-nowrap overflow-auto pb-2 pe-3 d-flex m-auto justify-content-start" 
                    style={{ maxHeight: "55vh", minHeight: "30vh", width: "99%", overflowY: "auto", scrollbarColor: "rgba(255, 255, 255, 0.3) transparent", scrollbarWidth: "thin" }}>
                    {gamesRate.slice(0, 20).map((game, index) => (
                        <div key={index} className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4 d-flex justify-content-center">
                            <div className="card tarjeta d-flex flex-column justify-content-between" style={{ width: '18rem' }}>
                                <div className="image-container">
                                    <img 
                                        src={game.background_image} 
                                        className="card-img-top" 
                                        alt={game.name} 
                                        style={{ width: "100%", maxHeight: "auto", objectFit: "cover" }} 
                                    />
                                </div>
                                <div className="card-body d-flex flex-column justify-content-end">
                                    <h5 className="card-title text-light">{game.name}</h5>
                                    <p className="card-text text-light">Rating: {game.metacritic}</p>
                                    <div className="d-flex justify-content-between align-items-center mt-auto">
                                        <Link to={`/game-details/${game.name}`}>
                                            <button className="button" onClick={() => actions.setCurrentItem(game)}>
                                                Details
                                            </button>
                                        </Link>
                                        <span>
                                            <strong className="text-light">{game.likes} &nbsp;</strong> 
                                            <i 
                                                className={`far fa-heart ${game.is_liked ? "fas text-danger" : "far text-light"}`} 
                                                style={{ cursor: 'pointer' }} 
                                                onClick={() => store.isLogin ? actions.handleGameLike(game.id) : navigate("/login-register")}
                                            ></i> 
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>)
            }

            <Link to="https://store.steampowered.com/steamdeck" target="_blank">
                <div id="publi" className="d-flex justify-content-center align-items-center py-5">
                    <img
                        className="cursor"
                        src="https://techcrunch.com/wp-content/uploads/2021/07/hero-banner-sequence-english.2021-07-15-13_49_51.gif"
                        alt="Steam Deck Promotion"
                        style={{ width: "70%", height: "auto", objectFit: "cover" }}
                    />
                </div>
            </Link>
        </div>
    );
}
