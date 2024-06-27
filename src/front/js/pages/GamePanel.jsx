import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext.js";
import "../../styles/adminpanel.css";

export const GamePanel = () => {
  const { store, actions } = useContext(Context);
  const [games, setGames] = useState([]);
  const [pageAction, setPageAction] = useState(true);
  const [pageEdit, setPageEdit] = useState(false);
  ///
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [title, setTitle] = useState("");

  const host = 'https://verbose-space-happiness-q77gw6r5jq7426xpr-3001.app.github.dev'
  
  useEffect(() => {   //    Eliminar luego
    getGames();
  }, []);
  
  const getGames = async () => {
    const uri = host + '/api/games';
    const options = { method: 'GET' };

    const response = await fetch(uri, options)

    if (!response.ok) {
      console.log("Error", response.status, response.statusText);
    }

    const data = await response.json();
    setGames(data);
  }


  const handleSubmitGame= async() => {

    const gameData = {
      title: title, 
      image_url: imageURL, 
      description: description,
    };

    const uri = host + '/api/games'
    const options = {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
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
  }

  // const getInfo(); definir 



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
                  <li key={item.id} className={`list-group-item border border-top-0 border-end-0 border-3 border-bottom-2 border-start-1 mb-2 ${pageEdit ? "border-0" : ""}`}>
                    { !pageEdit ? (
                      <>
                        <span>{item.id}, {item.title}, {item.image_url}</span>
                        <i className="fa-solid fa-pencil pointer float-end" onClick={() => setPageEdit(true)}></i>
                      </>
                    ) : (
                      <div className="d-block w-100">
                        <div className="d-flex">
                          <input type="text" value={`ID: ${item.id}`} className="flex-input" readOnly style={{width: "15%"}} />
                          <input type="text" placeholder="title" value={title} className="flex-input" style={{width: "60%"}} onChange={(e) => setTitle(e.target.value)} />
                          <input type="text" placeholder="image_url" value={imageURL} className="flex-input" style={{width: "30%"}} onChange={(e) => setImageURL(e.target.value)} />
                        </div>
                        <div>
                          <textarea className="form-control" aria-label="With textarea" placeholder="Descripción" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>    
                        </div>
                        <div className="justify-content-center d-flex mt-1">
                          <button className="rounded-3 bg-light" onClick={() => setPageEdit(false)}>Enviar</button>
                        </div>
                      </div>
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
