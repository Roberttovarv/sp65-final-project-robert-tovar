import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/landing.css";
import { Link } from "react-router-dom";

export const News = () => {
    const { store, actions } = useContext(Context);
    const [post, setPost] = useState([]);

    const host = `${process.env.BACKEND_URL}`;

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

    useEffect(() => {
        getPosts();
    }, []);

    const lastPost = post[post.length - 1];

    return (
        <div className="container">
            <div className="row justify-content-center bgc py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-8">
                            {lastPost && (
                                <div className="card px-3" style={{ backgroundColor: "transparent", border: "none" }} onClick={() => actions.setCurrentItem(lastPost)}>
                                    <div className="card-body" style={{ backgroundColor: "transparent", border: "none" }}>
                                        <Link to={`/news-details/${lastPost.title}`}>
                                            <h5 className="card-title text-light text-start">{lastPost.title}</h5>
                                            <p className="card-text text-light text-start">{lastPost.game_name}</p>
                                        </Link>
                                    </div>
                                    <Link to={`/news-details/${lastPost.title}`}>
                                        <img src={lastPost.image_url} className="card-img-top ms-1" alt={lastPost.game_name} />
                                    </Link>
                                </div>
                            )}
                        </div>
                        <div className="col-4 py-3">
                            <img 
                                src="https://cdn.prod.website-files.com/61eeba8765031c95bb83b2ea/6596d9e8efa34a1c48d0387e_-_g72O7K_BW4-2vMwWSs13CIkcYtc05SL3wz9hTuNArpP15ItoA4xHOmloHzA7JuGPB5cQozJjDq2R1uzYX49VZB-l-XOwflIhOYvDiXrBzVyqdTsyXyb4w5JOn8C82LGYij7LT7NY4mFvWAyqYkcIs.gif"
                                alt="Publicidad" style={{ height: "86%" }} 
                            />
                        </div>
                    </div>
                    <div className="row">
                        {post.slice(0, post.length - 1).map((post, index) => (
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
                                            <h4 className="card-title bg-dark bg-opacity-75 m-0 p-2" style={{ width: "100%" }}>{post.title}</h4>
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
