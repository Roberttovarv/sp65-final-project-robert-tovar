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

    return (
        <div className="container">
            <div className="row justify-content-center bgc ">
             {post.map((post, index) => (
              <div class="container">
	<div class="row">
		<div class="col-8">
    
<div class="card">
  <div class="card-body">
    <h5 class="card-title">{post.title}</h5>
    <p class="card-text">{post.game_name}</p>
    <p class="card-text"><small class="text-muted">{post.date}</small></p>
  </div>
  <img src={post.image_url} class="card-img-top" alt={post.title} />
</div>
    </div>
		<div class="col-4">
      <img src="https://cdn.prod.website-files.com/61eeba8765031c95bb83b2ea/6596d9e8efa34a1c48d0387e_-_g72O7K_BW4-2vMwWSs13CIkcYtc05SL3wz9hTuNArpP15ItoA4xHOmloHzA7JuGPB5cQozJjDq2R1uzYX49VZB-l-XOwflIhOYvDiXrBzVyqdTsyXyb4w5JOn8C82LGYij7LT7NY4mFvWAyqYkcIs.gif"
        alt="Publicidad" />
    </div>
	</div>
	<div class="row">
		<div class="col">
      <div class="card bg-dark text-white">
  <img src={post.image_url} class="card-img" alt={post.game_name}>
  <div class="card-img-overlay">
    <h5 class="card-title">{post.title}</h5>
    <p class="card-text">{post.date}</p>
  </div>
</div>
    </div>
	</div>
</div>))}
            </div>
        </div>
    );
};

