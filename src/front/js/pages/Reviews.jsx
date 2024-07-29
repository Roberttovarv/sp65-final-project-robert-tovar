import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const Reviews = () => {
const { store, actions } = useContext(Context);
const [video, setVideo] = useState([]);

        const host = `${process.env.BACKEND_URL}`

    const getVideos = async () => {
        const uri = host + '/api/videos';
        const options = { method: 'GET' };

        const response = await fetch(uri, options);

        if (!response.ok) {
            console.log("Error", response.status, response.statusText);
            return;
        }

        const data = await response.json();

        setVideo(data);
    };

    useEffect(() => {
        getVideos();
          
    }, []);


    return (
        <div className="container">
            {video.map((video, index) => (
                <div key={index}>
                    <h3 className="text-light">{video.title}</h3>
                    <h6 className="text-light">{video.videogame}</h6>
                    <iframe 
                        width="560" 
                        height="315" 
                        src={video.embed}
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerPolicy="strict-origin-when-cross-origin" 
                        allowFullScreen
                    ></iframe>
                </div>
            ))}
        </div>
    );
};
