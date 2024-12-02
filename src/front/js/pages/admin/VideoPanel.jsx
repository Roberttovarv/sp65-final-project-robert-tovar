import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../store/appContext.js";
import "../../../styles/adminpanel.css";
import { LoadingMario } from "../../component/LoadingMario.jsx";

export const VideoPanel = () => {
  const { store, actions } = useContext(Context);
  const [videos, setVideos] = useState([]);
  const [pageAction, setPageAction] = useState(true);
  const [pageEdit, setPageEdit] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [showEmbedId, setShowEmbedId] = useState(null);
  const [embed, setEmbed] = useState("");
  const [gameName, setGameName] = useState("");
  const [title, setTitle] = useState("");
  const host = `${process.env.BACKEND_URL}`;

  const navigate = useNavigate();

  useEffect(() => {
    getVideos();
    !store.admin ? navigate('/*') : '';
  }, []);

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

  const handleSubmitVideo = async () => {
    const videoData = {
      title: title,
      game_name: gameName,
      embed: embed,
    };

    const uri = `${host}/api/videos`;
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(videoData),
    };

    const response = await fetch(uri, options);

    if (!response.ok) {
      console.log("Error", response.status, response.statusText);
      return;
    }
    const result = await response.json();
    console.log("Juego añadido", result);

    setTitle("");
    setGameName("");
    setEmbed("");

    getVideos();
  };

  const handleEdit = async (event) => {
    event.preventDefault();
    const dataToSend = {
      title: currentVideo.title,
      game_name: currentVideo.game_name,
      embed: currentVideo.embed,
    };

    const uri = `${host}/api/videos/${currentVideo.id}`;
    const options = {
      method: "PUT",
      body: JSON.stringify(dataToSend),
      headers: { "Content-Type": "application/json" },
    };

    const response = await fetch(uri, options);

    if (!response.ok) {
      console.log("Error", response.status, response.statusText);
      return;
    }

    getVideos();

    setCurrentVideo(null);
    setPageEdit(false);
  };

  const deleteVideo = async (item) => {
    const uri = `${host}/api/videos/${item.id}`;
    const options = {
      method: "DELETE",
    };
    const response = await fetch(uri, options);

    if (!response.ok) {
      console.log("Error", response.status, response.statusText);
      return;
    }
    getVideos();
  };

  const editVideo = (item) => {
    setCurrentVideo(item);
    setPageEdit(true);
  };

  const toggleEmbed = (id) => {
    setShowEmbedId(showEmbedId === id ? null : id);
  };

  return (
    <div className="bg-light min-vh-100 p-3">
      <div className="container-fluid bg-light">
        <div className="d-flex justify-content-end mb-3">
          <Link to="/adminpanel">
            <button className="buttonAdmin">Admin Panel</button>
          </Link>
        </div>
        <div className="d-flex justify-content-center mb-4">
          <div className="btn-group" role="group" aria-label="Basic outlined example">
            <button
              type="button"
              className={`btn btn-outline-secondary buttonAdmin  ${pageAction ? "actual" : ""}`}
              onClick={() => setPageAction(true)}
            >
              Ver listado
            </button>
            <button
              type="button"
              className={`btn btn-outline-secondary buttonAdmin  ${!pageAction ? "actual" : ""}`}
              onClick={() => setPageAction(false)}
            >
              Crear nuevo
            </button>
          </div>
        </div>
        {pageAction ? (
          <>
            <h3 className="text-center mb-4">Reviews List</h3>
            <div className="d-flex justify-content-center">
              <ul className="list-group w-100" style={{ maxWidth: "100%" }}>
                {videos.length === 0 ? (
                  <LoadingMario />
                ) : (
                  videos.map((item) => (
                    <li
                      key={item.id}
                      className="list-group-item mb-2 bg-white d-flex m-auto justify-content-between"
                      style={{ width: "40%" }}
                    >
                      {!pageEdit || (pageEdit && currentVideo && currentVideo.id !== item.id) ? (
                        <div className="d-flex align-items-center justify-content-between w-100">
                          <div>
                            <div>
                              <span>
                                <strong>Item ID: </strong>{item.id}, <strong>Title: </strong>{item.title},
                                <span
                                  className="d-inline-block align-bottom text-truncate"
                                  style={{ maxWidth: "20vw" }}
                                >
                                  <strong>Game name: </strong>{item.game_name}
                                </span>
                              </span>
                            </div>
                            <div className={`${showEmbedId === item.id ? "" : "d-none"}`}>
                              <span>{item.embed}</span>
                            </div>
                          </div>
                          <div className="d-flex">
                            <div>
                              <i
                                className={`fa-solid ${showEmbedId !== item.id ? "fa-eye" : "fa-eye-slash"} pointer`}
                                onClick={() => toggleEmbed(item.id)}
                              ></i>
                            </div>
                            <div className="mx-3">
                              <i className="fa-solid fa-pencil pointer" onClick={() => editVideo(item)}></i>
                            </div>
                            <div>
                              <i className="fa-solid fa-trash pointer" onClick={() => deleteVideo(item)}></i>
                            </div>
                          </div>
                        </div>
                      ) : (
                        currentVideo &&
                        currentVideo.id === item.id && (
                          <div className="w-100">
                            <div className="d-flex flex-wrap mb-3">
                              <input
                                type="text"
                                value={`ID: ${currentVideo.id}`}
                                className="form-control me-2 mb-2"
                                disabled
                                style={{ maxWidth: "150px" }}
                              />
                              <input
                                type="text"
                                placeholder="Nombre"
                                value={currentVideo.title}
                                className="form-control me-2 mb-2"
                                style={{ flex: "1" }}
                                onChange={(event) => setCurrentVideo({ ...currentVideo, title: event.target.value })}
                              />
                              <input
                                type="text"
                                placeholder="URL de Imagen"
                                value={currentVideo.game_name}
                                className="form-control me-2 mb-2"
                                style={{ maxWidth: "300px" }}
                                onChange={(event) => setCurrentVideo({ ...currentVideo, game_name: event.target.value })}
                              />
                            </div>
                            <textarea
                              className="form-control mb-3"
                              placeholder="Descripción"
                              value={currentVideo.embed}
                              onChange={(event) => setCurrentVideo({ ...currentVideo, embed: event.target.value })}
                            ></textarea>
                            <div className="d-flex justify-content-center">
                              <button className="buttonAdmin" onClick={handleEdit}>
                                Send
                              </button>
                            </div>
                          </div>
                        )
                      )}
                    </li>
                  ))
                )}
              </ul>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-center my-4">Add review</h3>
            <div className="container d-flex justify-content-center">
              <div className="w-100" style={{ maxWidth: "600px" }}>
                <label className="form-label" htmlFor="video-title">Title</label>
                <input type="text" className="form-control mb-3" id="video-title" placeholder="Nombre" value={title} onChange={(e) => setTitle(e.target.value)} />

                <label className="form-label" htmlFor="image-url">Game name</label>
                <input type="text" className="form-control mb-3" id="image-url" placeholder="URL" value={gameName} onChange={(e) => setGameName(e.target.value)} />

                <label className="form-label" htmlFor="video-embed">Embed</label>
                <textarea className="form-control mb-3" id="video-embed" placeholder="Añada una descripción" value={embed} onChange={(e) => setEmbed(e.target.value)}></textarea>

                <div className="d-flex justify-content-center">
                  <button className="buttonAdmin" onClick={handleSubmitVideo}>Send</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};