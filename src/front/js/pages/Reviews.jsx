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
            <div className="row justify-content-center bgc border border-bottom-0 border-end-0 border-start-0 border-dark">
                <div className="row bgc justify-content-end">
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
                {filteredItems.length === 0 ? (
                    <Loading />
                ) : (
                    filteredItems.map((video, index) => (
                        <div key={index} className="col-md-8 mb-4 my-5 bgc">
                            <h3 className="text-light text-start">{video.title}</h3>
                            <h6 className="text-light text-start">{video.game_name}</h6>
                            <div className="ratio ratio-16x9">
                                <iframe
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
