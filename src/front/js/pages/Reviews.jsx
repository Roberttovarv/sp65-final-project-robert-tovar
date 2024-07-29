import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/landing.css";

export const Reviews = () => {
    const { store, actions } = useContext(Context);
    const [video, setVideo] = useState([]);

    const host = `${process.env.BACKEND_URL}`;

    const getVideos = async () => {
        const uri = host + '/api/videos';
        const options = { method: 'GET' };

        const response = await fetch(uri, options);

        if (!response.ok) {
            console.log("Error", response.status, response.statusText);
            return;
        }

        const data = await response.json();

        setVideo(data.results);
    };

    useEffect(() => {
        getVideos();
    }, []);

    return (
        <div className="container">
            <div className="row justify-content-center bgc ">
                {video.map((video, index) => (
                    <div key={index} className="col-md-8 mb-4 my-5 bgc">
                        <h3 className="text-light text-start">{video.title}</h3>
                        <h6 className="text-light text-start">{video.game_name}</h6>

                        <div className="ratio ratio-16x9">
                            <iframe src={video.embed} allowFullScreen style={{ width: "100%", height: "100%" }}></iframe>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
