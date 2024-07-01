import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext.js";
import "../../styles/adminpanel.css";

/// Poner limite de texto a la url

export const GamePanel = () => {
  const { store, actions } = useContext(Context);
  const [games, setGames] = useState([]);
  const [pageAction, setPageAction] = useState(true);
  const [pageEdit, setPageEdit] = useState(false);
  const [currentGame, setCurrentGame] = useState(null);
  const [showDescriptionId, setShowDescriptionId] = useState(false);

  ///
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [title, setTitle] = useState("");

  const host = `${process.env.BACKEND_URL}`

  useEffect(() => {
    getGames();
  }, []);

  const getGames = async () => {
    
    const uri = host + '/api/games';
    const options = { method: 'GET' };

    const response = await fetch(uri, options);

    if (!response.ok) {
      console.log("Error", response.status, response.statusText);
    }

    const data = await response.json();
    setGames(data.results);
  };

  const handleSubmitGame = async () => {
    const gameData = {
      title: title,
      image_url: imageURL,
      description: description,
    };

    const uri = host + '/api/games';
    const options = {
      method: 'POST',
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

    setTitle("");
    setImageURL("");
    setDescription("");

    getGames();
  };

  const handleEdit = async (event) => {
    event.preventDefault();
    const dataToSend = {
      title: currentGame.title,
      image_url: currentGame.image_url,
      description: currentGame.description,
    };

    const uri = host + `/api/games/${currentGame.id}`;
    const options = {
      method: 'PUT',
      body: JSON.stringify(dataToSend),
      headers: { 'Content-Type': 'application/json' }
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
    const uri = host + '/api/games/' + item.id
    const options = {
      method: 'DELETE'
    }
    const response = await fetch(uri, options)

    if (!response.ok) {
      console.log("Error", response.status, response.statusText);
      return
    }
    getGames();
  }

  const editGame = (item) => {

    setCurrentGame(item);
    setPageEdit(true);
  };

  const toggleDescription = (id) => {
    if (showDescriptionId === id) {
      setShowDescriptionId(null);
    } else {
      setShowDescriptionId(id);
    }
  };

  return (
    <>
      <div>
        <div className="d-flex justify-content-end mx-3 my-3">
          <Link to="/adminpanel"><button className="admin-button">Admin Panel</button></Link>
        </div>
        <div className="d-flex justify-content-center mx-auto my-5">
          <div className="btn-group" role="group" aria-label="Basic outlined example" style={{ width: "20%" }}>
            <button
              type="button"
              className={`btn btn-outline-primary comic-button dual ${pageAction ? "actual" : ""}`}
              onClick={() => setPageAction(true)}
            >
              Ver listado
            </button>
            <button
              type="button"
              className={`btn btn-outline-primary comic-button dual ${!pageAction ? "actual" : ""}`}
              onClick={() => setPageAction(false)}
            >
              Crear nuevo
            </button>
          </div>
        </div>
        {pageAction ? (
          <>
            <h3 className="text-center">Lista</h3>
            <div className="mx-5 d-flex justify-content-center">
              <ul className="list-group" style={{ width: "60%" }}>
                {games.map((item) => (
                  <li key={item.id} className="list-group-item border border-top-0 border-end-0 border-3 border-bottom-2 border-start-1 mb-2">
                    {
                      !pageEdit || (pageEdit && currentGame && currentGame.id !== item.id) ? (
                        <>
                          <div className="d-flex align-items-center justify-content-between">
                            <div>
                              <div>
                              <span><strong> Item ID: </strong>{item.id}, <strong>Nombre: </strong>{item.title}, <span className="d-inline-block align-bottom text-truncate" style={{maxWidth: "40%"}}> <strong>Foto: </strong>{item.image_url}</span></span>
                              </div>
                              <div className={`${showDescriptionId === item.id ? "" : "d-none"}`}> 
                              <span>{item.description}</span>
                              </div>
                            </div>
                            <div className="d-flex">
                              <div>
                              <i className={`fa-solid ${showDescriptionId !== item.id ? "fa-eye" : "fa-eye-slash"} pointer`} onClick={() => toggleDescription(item.id)}></i> 
                              </div>
                              <div className="mx-3">
                                <i className="fa-solid fa-pencil pointer" onClick={() => editGame(item)}></i>
                              </div>
                              <div>
                                <i className="fa-solid fa-trash pointer" onClick={() => deleteGame(item)}></i>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        currentGame && currentGame.id === item.id && (
                          <div className="d-block w-100">
                            <div className="d-flex">
                              <input type="text" value={`ID: ${currentGame.id}`} className="flex-input" disabled style={{ width: "15%" }} />
                              <input type="text" placeholder="title" value={currentGame.title} className="flex-input" style={{ width: "60%" }} onChange={(event) => setCurrentGame({ ...currentGame, title: event.target.value })} />
                              <input type="text" placeholder="image_url" value={currentGame.image_url} className="flex-input" style={{ width: "30%" }} onChange={(event) => setCurrentGame({ ...currentGame, image_url: event.target.value })} />
                            </div>
                            <div>
                              <textarea className="form-control" aria-label="With textarea" placeholder="Descripción" value={currentGame.description} onChange={(event) => setCurrentGame({ ...currentGame, description: event.target.value })}></textarea>
                            </div>
                            <div className="justify-content-center d-flex mt-1">
                              <button className="rounded-3 bg-light" onClick={handleEdit}>Enviar</button>
                            </div>
                          </div>
                        )
                      )}
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-center my-4">Añadir videojuego</h3>
            <div className="container-fluid d-flex justify-content-center" style={{ width: "60%" }}>
              <div className="w-100">
                <label className="mb-1" htmlFor="game-name">Nombre del juego</label>
                <div className="input-group mb-3">
                  <div className="input-group-prepend"></div>
                  <input type="text" className="form-control" placeholder="Nombre"
                    id="game-name" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                <label className="mb-1" htmlFor="basic-url">Image URL</label>
                <div className="input-group mb-3">
                  <div className="input-group-prepend"></div>
                  <input type="text" className="form-control" id="basic-url"
                    placeholder="URL" value={imageURL} onChange={(e) => setImageURL(e.target.value)} />
                </div>

                <label className="mb-1" htmlFor="game-description">Descripción</label>
                <div className="input-group">
                  <div className="input-group-prepend"></div>
                  <textarea className="form-control" aria-label="With textarea" id="game-description"
                    placeholder="Añada una descripción" value={description} onChange={(e) => setDescription(e.target.value)} ></textarea>
                </div>
                <div className="d-flex justify-content-center mt-3">
                  <button className="rounded-3 bg-light" onClick={handleSubmitGame}>Enviar</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
