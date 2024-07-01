import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext.js";
import "../../styles/adminpanel.css";

/// Poner limite de texto a la url

export const PostPanel = () => {
  const { store, actions } = useContext(Context);
  const [posts, setPosts] = useState([]);
  const [pageAction, setPageAction] = useState(true);
  const [pageEdit, setPageEdit] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [showBodyId, setShowBodyId] = useState(false);
  
  ///
  const [writer, setWriter] = useState("");
  const [body, setBody] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [gameId, setGameId] = useState("");
  const [title, setTitle] = useState("");

  const host = `${process.env.BACKEND_URL}`

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    
    const uri = host + '/api/posts';
    const options = { method: 'GET' };

    const response = await fetch(uri, options);

    if (!response.ok) {
      console.log("Error", response.status, response.statusText);
    }

    const data = await response.json();
    setPosts(data.results);
  };

  const handleSubmitPost = async () => {
    const gameData = {
      title: title,
      image_url: imageURL,
      body: body,
      game_id: gameId,
      author_id: writer,
    };

   console.log("Datos del juego a enviar:", gameData);

  const uri = host + '/api/posts';
  const options = {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(gameData),
  };

  console.log("URI:", uri);
  console.log("Options:", options);

  try {
    const response = await fetch(uri, options);

    if (!response.ok) {
      console.error("Error en la respuesta del servidor:", response.status, response.statusText);
      const errorText = await response.text(); // Obtener texto del error si lo hay
      console.error("Detalles del error:", errorText);
      return;
    }

    const result = await response.json();
    console.log("Juego añadido:", result);

    setTitle("");
    setImageURL("");
    setBody("");
    setGameId("");

    getPosts();
  } catch (error) {
    console.error("Error durante la solicitud fetch:", error);
  }
};

  const handleEdit = async (event) => {
    event.preventDefault();
    const dataToSend = {
      title: currentPost.title,
      image_url: currentPost.image_url,
      body: currentPost.body,
      game_id: currentPost.game_id,
    };

    const uri = host + `/api/posts/${currentPost.id}`;
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

    getPosts();
  
    setCurrentPost(null);
    setPageEdit(false);
  };

  const deletePost = async (item) => {
    const uri = host + '/api/posts/' + item.id
    const options = {
      method: 'DELETE'
    }
    const response = await fetch(uri, options)

    if (!response.ok) {
      console.log("Error", response.status, response.statusText);
      return
    }
    getPosts();
  }

  const editPost = (item) => {

    setCurrentPost(item);
    setPageEdit(true);
  };

  const toggleBody = (id) => {
    if (showBodyId === id) {
      setShowBodyId(null);
    } else {
      setShowBodyId(id);
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
                {posts.map((item) => (
                  <li key={item.id} className="list-group-item border border-top-0 border-end-0 border-3 border-bottom-2 border-start-1 mb-2">
                    {
                      !pageEdit || (pageEdit && currentPost && currentPost.id !== item.id) ? (
                        <>
                          <div className="d-flex align-items-center justify-content-between">
                            <div>
                              <div>
                              <span><strong>ID: </strong>{item.id},<strong>Nombre del juego:</strong> {item.game_name},<strong>Título:</strong> {item.title},<span className="d-inline-block align-bottom text-truncate" style={{maxWidth: "40%"}}><strong>Foto:</strong> {item.image_url}</span></span>
                              </div>
                              <div className={`${showBodyId === item.id ? "" : "d-none"}`}> 
                              <span>{item.body}</span>
                              </div>
                            </div>
                            <div className="d-flex">
                              <div>
                              <i className={`fa-solid ${showBodyId !== item.id ? "fa-eye" : "fa-eye-slash"} pointer`} onClick={() => toggleBody(item.id)}></i> 
                              </div>
                              <div className="mx-3">
                                <i className="fa-solid fa-pencil pointer" onClick={() => editPost(item)}></i>
                              </div>
                              <div>
                                <i className="fa-solid fa-trash pointer" onClick={() => deletePost(item)}></i>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        currentPost && currentPost.id === item.id && (
                          <div className="d-block w-100">
                            <div className="d-flex">
                            <input type="text" value={`ID: ${currentPost.id}`} className="flex-input" disabled style={{ width: "15%" }} />
                            <input type="text" value={currentPost.game_id} className="flex-input" style={{ width: "15%" }} onChange={(event) => setCurrentPost({ ...currentPost, game_id: event.target.value })} />
                            <input type="text" placeholder="title" value={currentPost.title} className="flex-input" style={{ width: "60%" }} onChange={(event) => setCurrentPost({ ...currentPost, title: event.target.value })} />
                              <input type="text" placeholder="image_url" value={currentPost.image_url} className="flex-input" style={{ width: "30%" }} onChange={(event) => setCurrentPost({ ...currentPost, image_url: event.target.value })} />
                            </div>
                            <div>
                              <textarea className="form-control" aria-label="With textarea" placeholder="Descripción" value={currentPost.body} onChange={(event) => setCurrentPost({ ...currentPost, body: event.target.value })}></textarea>
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
            <h3 className="text-center my-4">Crear un post</h3>
            <div className="container-fluid d-flex justify-content-center" style={{ width: "60%" }}>
              <div className="w-100">
                <label className="mb-1" htmlFor="create-post"></label>
                <div className="input-group mb-3">
                  <div className="input-group-prepend"></div>
                  <input type="text" className="form-control" placeholder="Título"
                    id="create-post" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <input type="number" className="form-control" placeholder="Game ID"
                    id="create-post" value={gameId} onChange={(e) => setGameId(e.target.value)} />
                    <input type="number" className="form-control" placeholder="Writer ID"
                    id="create-post" value={writer} onChange={(e) => setWriter(e.target.value)} />

                </div>

                <label className="mb-1" htmlFor="basic-url">Image URL</label>
                <div className="input-group mb-3">
                  <div className="input-group-prepend"></div>
                  <input type="text" className="form-control" id="basic-url"
                    placeholder="URL" value={imageURL} onChange={(e) => setImageURL(e.target.value)} />
                </div>

                <label className="mb-1" htmlFor="post-body">Añada un cuerpo del artículo</label>
                <div className="input-group">
                  <div className="input-group-prepend"></div>
                  <textarea className="form-control" aria-label="With textarea" id="post-body"
                    placeholder="Añada el cuerpo del artículo" value={body} onChange={(e) => setBody(e.target.value)} ></textarea>
                </div>
                <div className="d-flex justify-content-center mt-3">
                  <button className="rounded-3 bg-light" onClick={handleSubmitPost}>Enviar</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
