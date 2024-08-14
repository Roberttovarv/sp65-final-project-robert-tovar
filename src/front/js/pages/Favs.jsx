import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/landing.css";
import { LoadingMario } from "../component/LoadingMario.jsx";

export const Favs = () => {
    const { store, actions } = useContext(Context);
    const [games, setGames] = useState([]);
    const [post, setPost] = useState([]);
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

    const getPosts = async () => {
        const uri = host + '/api/posts';
        const options = { method: 'GET' };

        const response = await fetch(uri, options);

        if (!response.ok) {
            console.log("Error", response.status, response.statusText);
            return;
        }

        const data = await response.json();
        setPost(data.results);
    };

    const handleInputChange = (event) => {
        setSearch(event.target.value);
    };

    useEffect(() => {
        getGames();
        getPosts();
        actions.fetchProfile();
    }, []);

    useEffect(() => {
        const filtered = games.filter(game =>
            game.name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredGames(filtered);
    }, [search, games]);

    useEffect(() => {
        const filtered = post.filter(post =>
            post.title.toLowerCase().includes(search.toLowerCase()) ||
            post.game_name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredGames(filtered);
    }, [search, post]);

    const user = store.user || {}

    return (
        <div className="container">
            <h4 className="text-start text-light">Liked Games</h4>

            {user.likes && user.likes.liked_games.length === 0 ?
                (<LoadingMario />) :
                (user.likes && user.likes.liked_games.length > 0 &&
                    <div className="row d-flex flex-wrap justify-content-start">
                        {user.likes.liked_games.map((game, index) => (
                            <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-2 p-2">
                                <Link to={`/game-details/${game.name}`}>
                                    <div className="tarjeta ratio ratio-4x3" style={{ width: '100%' }} onClick={() => actions.setCurrentItem(game)}>
                                        <img src={game.background_image} className="text-light rounded-1"
                                            alt={game.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        <div className="card-body align-content-end mt-2">
                                            <div className="align-content-between mb-2">
                                                <h6 className="card-title text-light rounded-1 d-flex">{game.name}</h6>
                                            </div>
                                            <span className="text-light">
                                                {game.likes} &nbsp; <i className={`far fa-heart ${!games.isLiked ? "fas" : "far"}`} style={{ cursor: 'pointer' }}></i>
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>)
            }

            <h4 className="text-start text-light">Liked Posts</h4>

            {user.likes && user.likes.liked_posts.length === 0 ?
                (<LoadingMario />) :
                (user.likes && user.likes.liked_posts.length > 0 &&
                    <div className="row d-flex flex-wrap justify-content-start">
                        {user.likes.liked_posts.map((post, index) => (
                            <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-2 p-2">
                                <Link to={`/news-details/${post.title}`}>
                                    <div className="tarjeta ratio ratio-4x3" style={{ width: '100%' }} onClick={() => actions.setCurrentItem(post)}>
                                        <img src={post.image_url} className="text-light rounded-1"
                                            alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        <div className="card-body align-content-end mt-2">
                                            <div className="align-content-between mb-2">
                                                <h6 className="card-title text-light rounded-1 d-flex">{post.title}</h6>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-end">
                                                <span className="text-light">
                                                    {post.likes} &nbsp; <i className={`far fa-heart ${user.likes.liked_posts ? "fas" : "far"}`} style={{ cursor: 'pointer' }}></i>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>)
            }
        </div>
    );
};
