import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../store/appContext.js";
import "../../../styles/adminpanel.css";
import { LoadingMario } from "../../component/LoadingMario.jsx";

export const GamePanel = () => {
  const { store, actions } = useContext(Context);
  const [games, setGames] = useState([]);
  const [pageAction, setPageAction] = useState(true);
  const [pageEdit, setPageEdit] = useState(false);
  const [currentGame, setCurrentGame] = useState(null);
  const [showDescriptionId, setShowDescriptionId] = useState(null);
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [name, setName] = useState("");
  const [metacritic, setMetacritic] = useState("");
  const [release, setRelease] = useState("");

  const host = `${process.env.BACKEND_URL}`;
  const navigate = useNavigate();

  useEffect(() => {
    getGames();
    if (!store.admin) navigate('/*');
  }, []);

  const getGames = async () => {
    const uri = `${host}/api/games`;
    const options = { method: "GET" };

    const response = await fetch(uri, options);

    if (!response.ok) {
      console.log("Error", response.status, response.statusText);
    }

    const data = await response.json();
    setGames(data.results);
  };

  const handleSubmitGame = async () => {
    const gameData = {
      name: name,
      background_image: imageURL,
      description: description,
      metacritic: metacritic,
      release: release,
    };

    const uri = `${host}/api/games`;
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gameData),
    };

    const response = await fetch(uri, options);

    if (!response.ok) {
      console.log("Error", response.status, response.statusText);
      return;
    }
    const result = await response.json();
    console.log("Juego añadido", result);

    setName("");
    setImageURL("");
    setDescription("");
    setMetacritic("");
    setRelease("");

    getGames();
  };

  const handleEdit = async (event) => {
    event.preventDefault();
    const dataToSend = {
      name: currentGame.name,
      background_image: currentGame.background_image,
      description: currentGame.description,
      metacritic: currentGame.metacritic,
      release: currentGame.released_at,
    };

    const uri = `${host}/api/games/${currentGame.id}`;
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

    getGames();

    setCurrentGame(null);
    setPageEdit(false);
  };

  const resetData = () => {
    setName("");
    setDescription("");
    setRelease("");
    setMetacritic("");
    setImageURL("");
    setPageAction(true)
    

  }

  const deleteGame = async (item) => {
    const uri = `${host}/api/games/${item.id}`;
    const options = {
      method: "DELETE",
    };
    const response = await fetch(uri, options);

    if (!response.ok) {
      console.log("Error", response.status, response.statusText);
      return;
    }
    getGames();
  };

  const editGame = (item) => {
    setCurrentGame(item);
    setPageEdit(true);
  };

  const toggleDescription = (id) => {
    setShowDescriptionId(showDescriptionId === id ? null : id);
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
              View List
            </button>
            <button
              type="button"
              className={`btn btn-outline-secondary buttonAdmin  ${!pageAction ? "actual" : ""}`}
              onClick={() => setPageAction(false)}
            >
              Create New
            </button>
          </div>
        </div>
        {pageAction ? (
          <>
            <h3 className="text-center mb-4">Games List</h3>
            <div className="d-flex justify-content-center">
              <ul className="list-group w-100" style={{ maxWidth: "800px" }}>
                {games.length === 0 ? (
                  <LoadingMario />
                ) : (
                  games.map((item) => (
                    <li
                      key={item.id}
                      className="list-group-item mb-2 bg-white d-flex justify-content-between align-items-center"
                    >
                      {!pageEdit || (pageEdit && currentGame && currentGame.id !== item.id) ? (
                        <div className="d-flex align-items-center justify-content-between w-100">
                          <div>
                            <div>
                              <span className="d-flex align-items-center justify-content-between w-100">
                                <strong class>Item ID: </strong>{item.id}, &nbsp; <strong>Name: </strong>{item.name},&nbsp;
                                <span
                                  className="d-inline-block text-truncate"
                                  style={{ maxWidth: "20vw" }}
                                >
                                  <strong>Foto: </strong>{item.background_image}&nbsp;
                                </span>
                              </span>
                            </div>
                            <div className={`${showDescriptionId === item.id ? "" : "d-none"}`}>
                              <span>{item.description}</span>
                            </div>
                          </div>
                          <div className="d-flex">
                            <div>
                              <i
                                className={`fa-solid ${showDescriptionId !== item.id ? "fa-eye" : "fa-eye-slash"} pointer`}
                                onClick={() => toggleDescription(item.id)}
                              ></i>
                            </div>
                            <div className="mx-3">
                              <i className="fa-solid fa-pencil pointer" onClick={() => editGame(item)}></i>
                            </div>
                            <div>
                              <i className="fa-solid fa-trash pointer" onClick={() => deleteGame(item)}></i>
                            </div>
                          </div>
                        </div>
                      ) : (
                        currentGame &&
                        currentGame.id === item.id && (
                          <div className="w-100">
                            <div className="d-flex flex-wrap mb-3">
                              <input
                                type="text"
                                value={`ID: ${currentGame.id}`}
                                className="form-control me-2 mb-2 w-25"
                                disabled
                                style={{ maxWidth: "150px" }}
                              />
                              <input
                                type="text"
                                placeholder="Name"
                                value={currentGame.name}
                                className="form-control me-2 mb-2 w-25"
                                style={{ flex: "1" }}
                                onChange={(event) => setCurrentGame({ ...currentGame, name: event.target.value })}
                              />
                              <input
                                type="text"
                                placeholder="Image URL"
                                value={currentGame.background_image}
                                className="form-control me-2 mb-2"
                                style={{ maxWidth: "300px" }}
                                onChange={(event) => setCurrentGame({ ...currentGame, background_image: event.target.value })}
                              />
                              <input
                                type="number"
                                placeholder="Metacritic"
                                value={currentGame.metacritic}
                                className="form-control me-2 mb-2 "
                                style={{ maxWidth: "300px" }}
                                step = "0.1"
                                onChange={(event) => setCurrentGame({ ...currentGame, metacritic: event.target.value })}
                              />                              
                              <input
                              type="date"
                              placeholder="Release date"
                              value={currentGame.released_at}
                              className="form-control me-2 mb-2"
                              style={{ maxWidth: "300px" }}
                              onChange={(event) => setCurrentGame({ ...currentGame, released_at: event.target.value })}
                            />

                            </div>
                            <textarea
                              className="form-control mb-3"
                              placeholder="Description"
                              value={currentGame.description}
                              onChange={(event) => setCurrentGame({ ...currentGame, description: event.target.value })}
                            ></textarea>
                            <div className="d-flex justify-content-center">
                              <button className="buttonAdmin" onClick={handleEdit}>
                                Send
                              </button>
                              <button className="buttonAdmin ms-2 text-danger" onClick={() => setPageEdit(false)}>Cancel</button>

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
            <h3 className="text-center my-4">Añadir Videojuego</h3>
            <div className="container d-flex justify-content-center">
              <div className="w-100" style={{ maxWidth: "600px" }}>
                <label className="form-label" htmlFor="game-name">Name</label>
                <input type="text" className="form-control mb-3" id="game-name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />

                <label className="form-label" htmlFor="image-url">Image URL</label>
                <input type="text" className="form-control mb-3" id="image-url" placeholder="URL" value={imageURL} onChange={(e) => setImageURL(e.target.value)} />

                <div className="d-flex">
                  <div className="me-2 w-25">
                    <label className="form-label" htmlFor="metacritic">Metacritic</label>
                    <input type="number" className="form-control mb-3" id="metacritic" placeholder="Metacritics" value={metacritic} step="0.1" onChange={(e) => setMetacritic(e.target.value)} />
                  </div>
                  <div className="ms-2 w-75">
                    <label className="form-label" htmlFor="release">Release Date</label>
                    <input type="date" className="form-control mb-3" id="release" placeholder="Date" value={release} onChange={(e) => setRelease(e.target.value)} />
                  </div>
                </div>

                <label className="form-label" htmlFor="game-description">Description</label>
                <textarea className="form-control mb-3" id="game-description" placeholder="Add a description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>

                <div className="d-flex justify-content-center">
                <button className="buttonAdmin" onClick={handleSubmitGame}>Send</button>
                <button className="buttonAdmin ms-2 text-danger" onClick={resetData}>Cancel</button>
                </div>
              </div>
            </div>

          </>
        )}
      </div>
    </div>
  );
};
