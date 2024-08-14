import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/landing.css";
import { LoadingMario } from "../component/LoadingMario.jsx";

export const LandingPage = () => {
    const { store, actions } = useContext(Context);
    const [gamesDate, setGamesDate] = useState([]);
    const [gamesRate, setGamesRate] = useState([]);
    const [games, setGames] = useState([]);
    

    const host = `${process.env.BACKEND_URL}`;


    const getGames = async () => {
        const uri = host + '/api/games';
        const options = { method: 'GET' };

        const response = await fetch(uri, options);

        if (!response.ok) {
            console.log("Error", response.status, response.statusText);
            return;
        }
        actions.fetchProfile()
        const data = await response.json();

        const sortedByDate = [...data.results].sort((a, b) => new Date(b.released_at) - new Date(a.released_at));
        const sortedByRate = [...data.results].sort((a, b) => b.metacritic - a.metacritic);

        setGamesDate(sortedByDate);
        setGamesRate(sortedByRate);
        setGames(data.results)
        console.log(data.results);
        
        
    };

    useEffect(() => {
        getGames();
        console.log("Games by date:", gamesDate);
        console.log("Games by rate:", gamesRate);;
        
    }, []);
    
    return (
        <div className="container">

            <h1 className="text-center text-light">Newest Games</h1>

            {gamesDate.length === 0 ? 
                (<LoadingMario />) : 
                (<div className="row flex-nowrap overflow-auto pb-2 d-flex px-3 m-auto justify-content-start" 
                    style={{ maxHeight: "55vh", minHeight: "30vh", width: "99%", overflowY: "auto", scrollbarColor: "white transparent", borderRadius: "15px"}}>
                    {gamesDate.slice(0, 20).map((game, index) => (
                        <div key={index} className="tarjeta m-3 ratio ratio-1x1" style={{ width: '18rem' }}>
                            <img src={game.background_image} className=" text-light rounded-1" 
                            alt={game.name} style={{ width: "100%", maxHeight: "60%", objectFit: "cover" }} />
                            <div className="card-body align-content-end mt-2">
                                <div className="align-content-between mb-2">
                                    <h5 className="card-title text-light rounded-1 d-flex">{game.name}</h5>
                                    <p className="card-text text-light rounded-1">Releasing date: {game.released_at}</p>
                                </div>
                                <div className="d-flex justify-content-between align-items-end">
                                    <Link to={`/game-details/${game.name}`} >
                                        <button className="button" onClick={() => actions.setCurrentItem(game)}>
                                            Details
                                        </button>
                                    </Link>
                                    <span className="text-light">
                                        {game.likes} &nbsp; <i className={`far fa-heart ${game.is_liked ? "fas" : "far"}`} style={{ cursor: 'pointer' }}></i> 
                                        </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>)
            }

            
            <h1 className="text-center text-light">Best Rated</h1>

            {gamesRate.length === 0 ?
                (<LoadingMario />) : 
                (<div className="row flex-nowrap overflow-auto pb-2 px-3 d-flex m-auto justify-content-start" 
                    style={{ maxHeight: "55vh", minHeight: "30vh", width: "99%", overflowY: "auto", scrollbarColor: "white transparent", borderRadius: "15px" }}>
                    {gamesRate.slice(0, 20).map((game, index) => (
                        <div key={index} className="tarjeta m-3 ratio ratio-1x1" style={{ width: '18rem' }}>
                            <img src={game.background_image} className="text-light rounded-1" 
                            alt={game.name} style={{ width: "100%", maxHeight: "60%", objectFit: "cover" }} />
                            <div className="card-body align-content-end mt-2">
                                <div className="align-content-between mb-2">
                                    <h5 className="card-title text-light rounded-1 d-flex">{game.name}</h5>
                                    <p className="card-text text-light rounded-1">Rating: {game.metacritic}</p>
                                </div>
                                <div className="d-flex justify-content-between align-items-end">
                                    <Link to={`/game-details/${game.name}`}>
                                        <button className="button" onClick={() => actions.setCurrentItem(game)}>
                                            Details
                                        </button>
                                    </Link>
                                    <span className="text-light">
                                    {game.likes} &nbsp; <i className={`far fa-heart ${game.is_liked ? "fas" : "far"}`} style={{ cursor: 'pointer' }}></i> 
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>)
            }
            <div className="m-5 d-flex justify-content-center">
                <a href="https://store.steampowered.com/steamdeck" target="_blank" className="image-container" style={{ position: 'relative', display: 'inline-block' }}>
                    <img id="publi" className="cursor" src="https://techcrunch.com/wp-content/uploads/2021/07/hero-banner-sequence-english.2021-07-15-13_49_51.gif" alt="Steam Deck Promotion"
                        style={{ height: "400px", width: "850px", objectFit: "cover" }} />
                </a>
            </div>
        </div>
    );
}
