import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/landing.css";
import { Link, useNavigate } from "react-router-dom";

export const Posts = () => {
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);
    const [search, setSearch] = useState("");
    const [filteredItems, setFilteredItems] = useState([]);

    useEffect(() => {
        if (store.posts.length === 0) {
            actions.getPosts();
        }
    }, [store.posts, actions]);

    useEffect(() => {
        const filtered = store.posts.filter(post =>
            post.title.toLowerCase().includes(search.toLowerCase()) ||
            post.game_name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredItems(filtered);
    }, [search, store.posts]);

    const handleInputChange = (event) => {
        setSearch(event.target.value);
    };

    const lastPost = store.posts[store.posts.length - 1];

    return (
        <div className="container">
            <div className="row justify-content-end px-5">
                <div className="row form__group field float-end px-4">
                    <input
                        type="input"
                        className="form__field"
                        placeholder="Search"
                        value={search}
                        onChange={handleInputChange}
                    />
                    <label htmlFor="name" className="form__label">Search</label>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-8">
                        {!search && lastPost ? (
                                <div className="card px-3" style={{ backgroundColor: "transparent", border: "none" }} onClick={() => actions.setCurrentItem(lastPost)}>
                                    <div className="card-body" style={{ backgroundColor: "transparent", border: "none" }}>
                                        <Link to={`/news-details/${lastPost.title}`} style={{ textDecoration: "none", color: "white" }}>
                                            <h5 className="card-title text-light text-start">
                                                {lastPost.title}
                                            </h5>
                                            <p className="card-text text-light text-start">{lastPost.game_name}</p>
                                        </Link>
                                    </div>
                                    <Link to={`/news-details/${lastPost.title}`} className="position-relative">
                                        <img src={lastPost.image_url} className="card-img-top ms-1" alt={lastPost.game_name} />
                                        <i
                                            className={`far fa-heart ${lastPost.is_liked ? "fas text-danger" : "far text-light"} position-absolute bottom-0 end-0 m-3`}
                                            style={{ cursor: 'pointer', fontSize: "3rem" }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                store.isLogin ? actions.handlePostLike(lastPost.id) : navigate("/login-register");
                                            }}
                                        ></i>
                                    </Link>
                                </div>
                            ) : (
                                filteredItems.map((post, index) => (
                                    <div key={index} className="col-12 mb-3">
                                        <Link to={`/news-details/${post.title}`} onClick={() => actions.setCurrentItem(post)}>
                                            <div className="card bg-dark text-white">
                                                <div className="ratio ratio-16x9">
                                                    <img
                                                        src={post.image_url}
                                                        className="card-img-top"
                                                        alt={post.game_name}
                                                        style={{ objectFit: "cover", height: "100%" }}
                                                    />
                                                </div>
                                                <div className="card-body">
                                                    <h5 className="card-title d-flex justify-content-between align-items-end">
                                                        {post.title}
                                                        <i
                                                            className={`far fa-heart ${post.is_liked ? "fas text-danger" : "far text-light"}`}
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => store.isLogin ? actions.handlePostLike(post.id) : navigate("/login-register")}
                                                        ></i>
                                                    </h5>
                                                    <p className="card-text">{post.game_name}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="col-4 pt-5 mt-5">
                            <img
                                src="https://cdn.prod.website-files.com/61eeba8765031c95bb83b2ea/6596d9e8efa34a1c48d0387e_-_g72O7K_BW4-2vMwWSs13CIkcYtc05SL3wz9hTuNArpP15ItoA4xHOmloHzA7JuGPB5cQozJjDq2R1uzYX49VZB-l-XOwflIhOYvDiXrBzVyqdTsyXyb4w5JOn8C82LGYij7LT7NY4mFvWAyqYkcIs.gif"
                                alt="Publicidad" style={{ height: "86%", width: "100%" }}
                            />
                        </div>
                    </div>
                    <div className="row">
                        {!search && store.posts.slice(0, store.posts.length - 1).map((post, index) => (
                            <div key={index} className="col-12 col-md-6 col-lg-4 my-3">
                                <Link to={`/news-details/${post.title}`} onClick={() => actions.setCurrentItem(post)}>
                                    <div className="card bg-dark text-white h-100">
                                        <div className="ratio ratio-1x1">
                                            <img
                                                src={post.image_url}
                                                className="card-img-top"
                                                alt={post.game_name}
                                                style={{ objectFit: "cover", height: "100%" }}
                                            />
                                        </div>
                                        <div className="card-img-overlay d-flex flex-column justify-content-end p-2">
                                            <h4 className="card-title bg-dark bg-opacity-75 m-0 p-2 d-flex justify-content-between align-items-end" style={{ width: "100%" }}>
                                                {post.title}
                                                <i
                                                    className={`far fa-heart ${post.is_liked ? "fas text-danger" : "far text-light"}`}
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        store.isLogin ? actions.handlePostLike(post.id) : navigate("/login-register");
                                                    }}
                                                ></i>
                                            </h4>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
