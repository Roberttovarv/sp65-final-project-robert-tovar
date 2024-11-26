import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/landing.css";
import { Loading } from "../component/Loading.jsx";

export const Reviews = () => {
    const { store, actions } = useContext(Context);
    const [videos, setVideos] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredItems, setFilteredItems] = useState([]);

    const host = `${process.env.BACKEND_URL}`;

    const getVideos = async () => {
        try {
            const uri = host + '/api/videos';
            const options = { method: 'GET' };

            const response = await fetch(uri, options);

            if (!response.ok) {
                console.error("Error", response.status, response.statusText);
                return;
            }

            const data = await response.json();
            setVideos(data.results);
        } catch (error) {
            console.error("Error fetching videos:", error);
        }
    };

    useEffect(() => {
        getVideos();
    }, []);

    useEffect(() => {
        const filtered = videos.filter(video =>
            video.title.toLowerCase().includes(search.toLowerCase()) ||
            video.game_name?.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredItems(filtered);
    }, [search, videos]);

    const handleInputChange = (event) => {
        setSearch(event.target.value);
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="row justify-content-end">
                    <div className="form__group field">
                        <input
                            type="text"
                            className="form__field"
                            placeholder="Search"
                            value={search}
                            onChange={handleInputChange}
                        />
                        <label htmlFor="name" className="form__label">Search</label>
                    </div>
                </div>
                <div className="col-12 text-center mb-3">
                    <h1 className="text-light">Video Reviews</h1>
                </div>
                {filteredItems.length === 0 ? (
                    <Loading />
                ) : (
                    filteredItems.map((video, index) => (
                        <div key={index} 
                        className="col-md-8 my-4 bg-dark pt-3 pb-4 px-4 rounded-4"
                        style={{boxShadow: "-5px 5px 1px rgba(255, 255, 255, .3)"}}>
                            <h3 className="text-light text-start ms-1">{video.title}</h3>
                            <h6 className="text-light text-start ms-1 mb-4">&nbsp; {video.game_name}</h6>
                            <div className="ratio ratio-16x9">
                                <iframe
                                    className="rounded-4"
                                    src={video.embed}
                                    allowFullScreen
                                    style={{ width: "100%", height: "100%" }}
                                    title={video.title}
                                ></iframe>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
