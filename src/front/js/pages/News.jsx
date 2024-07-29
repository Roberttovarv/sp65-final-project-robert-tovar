import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/landing.css";

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
            <div className="row justify-content-center bgc">
                <div className="container">
                    <div className="row">
                        <div className="col-8">
                            {lastPost && (
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">{lastPost.title}</h5>
                                        <p className="card-text">{lastPost.game_name}</p>
                                        <p className="card-text"><small className="text-muted">{lastPost.date}</small></p>
                                    </div>
                                    <img src={lastPost.image_url} className="card-img-top" alt={lastPost.title} />
                                </div>
                            )}
                        </div>
                        <div className="col-4">
                            <img src="https://cdn.prod.website-files.com/61eeba8765031c95bb83b2ea/6596d9e8efa34a1c48d0387e_-_g72O7K_BW4-2vMwWSs13CIkcYtc05SL3wz9hTuNArpP15ItoA4xHOmloHzA7JuGPB5cQozJjDq2R1uzYX49VZB-l-XOwflIhOYvDiXrBzVyqdTsyXyb4w5JOn8C82LGYij7LT7NY4mFvWAyqYkcIs.gif" alt="Publicidad" />
                        </div>
                    </div>
                    <div className="row">
                        {post.slice(0, post.length - 1).map((post, index) => (
                            <div key={index} className="col">
                                <div className="card bg-dark text-white">
                                    <img src={post.image_url} className="card-img" alt={post.game_name} />
                                    <div className="card-img-overlay">
                                        <h5 className="card-title">{post.title}</h5>
                                        <p className="card-text">{post.date}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
