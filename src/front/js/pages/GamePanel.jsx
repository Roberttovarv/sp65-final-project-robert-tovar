import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext.js";
import "../../styles/adminpanel.css";
import { LoadingMario } from "../component/LoadingMario.jsx";

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

  const host = `${process.env.BACKEND_URL}`;
const navigate = useNavigate();

  useEffect(() => {
    getGames();
      !store.admin ? navigate('/*') : '';
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

    getGames();
  };

  const handleEdit = async (event) => {
    event.preventDefault();
    const dataToSend = {
      name: currentGame.name,
      background_image: currentGame.background_image,
      description: currentGame.description,
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
            <h3 className="text-center mb-4">Lista de Videojuegos</h3>
            <div className="d-flex justify-content-center">
              <ul className="list-group w-100" style={{ maxWidth: "100%" }}>
                {games.length === 0 ? (
                  <LoadingMario />
                ) : (
                  games.map((item) => (
                    <li
                      key={item.id}
                      className="list-group-item mb-2 bg-white d-flex m-auto justify-content-between"
                      style={{ width: "40%" }}
                    >
                      {!pageEdit || (pageEdit && currentGame && currentGame.id !== item.id) ? (
                        <div className="d-flex align-items-center justify-content-between w-100">
                          <div>
                            <div>
                              <span>
                                <strong>Item ID: </strong>{item.id}, <strong>Nombre: </strong>{item.name},
                                <span
                                  className="d-inline-block align-bottom text-truncate"
                                  style={{ maxWidth: "20vw" }}
                                >
                                  <strong>Foto: </strong>{item.background_image}
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
                                className="form-control me-2 mb-2"
                                disabled
                                style={{ maxWidth: "150px" }}
                              />
                              <input
                                type="text"
                                placeholder="Nombre"
                                value={currentGame.name}
                                className="form-control me-2 mb-2"
                                style={{ flex: "1" }}
                                onChange={(event) => setCurrentGame({ ...currentGame, name: event.target.value })}
                              />
                              <input
                                type="text"
                                placeholder="URL de Imagen"
                                value={currentGame.background_image}
                                className="form-control me-2 mb-2"
                                style={{ maxWidth: "300px" }}
                                onChange={(event) => setCurrentGame({ ...currentGame, background_image: event.target.value })}
                              />
                            </div>
                            <textarea
                              className="form-control mb-3"
                              placeholder="Descripción"
                              value={currentGame.description}
                              onChange={(event) => setCurrentGame({ ...currentGame, description: event.target.value })}
                            ></textarea>
                            <div className="d-flex justify-content-center">
                              <button className="buttonAdmin" onClick={handleEdit}>
                                Enviar
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
            <h3 className="text-center my-4">Añadir Videojuego</h3>
            <div className="container d-flex justify-content-center">
              <div className="w-100" style={{ maxWidth: "600px" }}>
                <label className="form-label" htmlFor="game-name">Nombre del Juego</label>
                <input type="text" className="form-control mb-3" id="game-name" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />

                <label className="form-label" htmlFor="image-url">URL de Imagen</label>
                <input type="text" className="form-control mb-3" id="image-url" placeholder="URL" value={imageURL} onChange={(e) => setImageURL(e.target.value)} />

                <label className="form-label" htmlFor="game-description">Descripción</label>
                <textarea className="form-control mb-3" id="game-description" placeholder="Añada una descripción" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>

                <div className="d-flex justify-content-center">
                  <button className="buttonAdmin" onClick={handleSubmitGame}>Enviar</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
