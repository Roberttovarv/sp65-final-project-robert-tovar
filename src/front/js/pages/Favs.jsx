import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/landing.css";
import { LoadingMario } from "../component/LoadingMario.jsx";

export const Favs = () => {
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);
    const [search, setSearch] = useState("");
    const [filteredGames, setFilteredGames] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const user = store.user || {};

    // Fetch games and posts from store if not available
    useEffect(() => {
        if (!store.token) {
            navigate("/login-register");
            return;
        }
        const fetchData = async () => {
            if (!store.games.length) {
                await actions.getGames();
            }
            if (!store.posts.length) {
                await actions.getPosts();
            }
            actions.fetchProfile(); // Asegúrate de que fetchProfile sea necesario
        };
        fetchData();
    }, [store.token, navigate, actions]);

    useEffect(() => {
        if (user.likes) {
            // Filtra los juegos basados en los juegos que el usuario ha dado like
            const likedGames = store.games.filter(game =>
                user.likes.liked_games.some(likedGame => likedGame.id === game.id)
            );
            setFilteredGames(likedGames);
        }
    }, [store.games, user.likes]);

    useEffect(() => {
        if (user.likes) {
            // Filtra los posts basados en los posts que el usuario ha dado like
            const likedPosts = store.posts.filter(post =>
                user.likes.liked_posts.some(likedPost => likedPost.id === post.id)
            );
            setFilteredPosts(likedPosts);
        }
    }, [store.posts, user.likes]);

    useEffect(() => {
        // Filtra los juegos basados en la búsqueda
        const filteredGames = store.games.filter(game =>
            user.likes.liked_games.some(likedGame => likedGame.id === game.id) &&
            game.name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredGames(filteredGames);
    }, [search, store.games, user.likes]);

    useEffect(() => {
        // Filtra los posts basados en la búsqueda
        const filteredPosts = store.posts.filter(post =>
            user.likes.liked_posts.some(likedPost => likedPost.id === post.id) &&
            (post.title.toLowerCase().includes(search.toLowerCase()) ||
            post.game_name.toLowerCase().includes(search.toLowerCase()))
        );
        setFilteredPosts(filteredPosts);
    }, [search, store.posts, user.likes]);

    const handleInputChange = (event) => {
        setSearch(event.target.value);
    };

    if (!user.likes) {
        return <LoadingMario />; // Opcional: Mostrar un loading o un mensaje si user.likes no está disponible
    }

    return (
        <div className="container">
            {/* Barra de búsqueda */}
            <div className="row mb-4">
                <div className="col-12 text-end">
                    <div className="form__group field float-end ps-5">
                        <input 
                            type="text" 
                            className="form__field" 
                            placeholder="Search" 
                            value={search} 
                            onChange={handleInputChange} 
                        />
                        <label htmlFor="search" className="form__label">Search</label>
                    </div>
                </div>
            </div>

            {/* Juegos favoritos */}
            <h4 className="text-start text-light">Liked Games</h4>
            {filteredGames.length === 0 ? (
                <LoadingMario />
            ) : (
                <div className="row d-flex flex-wrap justify-content-start">
                    {filteredGames.map((game, index) => (
                        <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3 p-2">
                            <Link to={`/game-details/${game.name}`}>
                                <div className="tarjeta ratio ratio-4x3 d-flex flex-column" style={{ width: '100%' }} onClick={() => actions.setCurrentItem(game)}>
                                    <img src={game.background_image} className="text-light rounded-1"
                                        alt={game.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    <div className="card-img-overlay d-flex flex-column justify-content-end p-2 bg-dark bg-opacity-50">
                                        <h6 className="card-title text-light rounded-1 mb-2">{game.name}</h6>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="card-text text-light">
                                                {game.likes} &nbsp;
                                                <i
                                                    className={`far fa-heart ${game.is_liked ? "fas text-danger" : "far text-light"}`}
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={(e) => {e.preventDefault(); actions.handleGameLike(game.id);}}
                                                ></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}

            {/* Publicaciones favoritas */}
            <h4 className="text-start text-light">Liked Posts</h4>
            {filteredPosts.length === 0 ? (
                <LoadingMario />
            ) : (
                <div className="row d-flex flex-wrap justify-content-start">
                    {filteredPosts.map((post, index) => (
                        <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3 p-2">
                            <Link to={`/news-details/${post.title}`}>
                                <div className="tarjeta ratio ratio-4x3 d-flex flex-column" style={{ width: '100%' }} onClick={() => actions.setCurrentItem(post)}>
                                    <img src={post.image_url} className="text-light rounded-1"
                                        alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    <div className="card-img-overlay d-flex flex-column justify-content-end p-2 bg-dark bg-opacity-50">
                                        <h6 className="card-title text-light rounded-1 mb-2">{post.title}</h6>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="card-text text-light">
                                                {post.likes} &nbsp;
                                                <i
                                                    className={`far fa-heart ${post.is_liked ? "fas text-danger" : "far text-light"}`}
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={(e) => {e.preventDefault(); actions.handlePostLike(post.id);}}
                                                ></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
