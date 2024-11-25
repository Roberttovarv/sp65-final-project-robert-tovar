import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../store/appContext.js";
import "../../../styles/adminpanel.css";
import { NotFound } from "../../component/NotFound.jsx";

export const PostPanel = () => {
  const { store, actions } = useContext(Context);
  const [posts, setPosts] = useState([]);
  const [pageAction, setPageAction] = useState(true);
  const [pageEdit, setPageEdit] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [showBodyId, setShowBodyId] = useState(false);

  
  const [writer, setWriter] = useState("");
  const [body, setBody] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [gameId, setGameId] = useState("");
  const [title, setTitle] = useState("");
  
  const host = `${process.env.BACKEND_URL}`;
  
  const navigate = useNavigate();
  
  useEffect(() => {
    !store.admin ? navigate("/*") : '';
    getPosts();
  }, []);
  
  const resetData = () =>{
    setBody("");
    setImageURL("");
    setGameId("");
    setTitle("");
    setPageAction(true);

  }

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
      game_name: gameId,
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
        const errorText = await response.text(); 
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
      game_name: currentPost.game_name,
    };

    const uri = host + `/api/posts/${currentPost.id}`;
    const token = localStorage.getItem('token');
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(dataToSend),
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
    const uri = host + '/api/posts/' + item.id;
    const token = localStorage.getItem('token');

    const options = {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    };
    const response = await fetch(uri, options);

    if (!response.ok) {
      console.log("Error", response.status, response.statusText);
      return;
    }
    getPosts();
  };

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
    <div className="container-fluid bg-light min-vh-100 p-3">
      <div className="d-flex justify-content-end mb-3">
        <Link to="/adminpanel">
          <button className="buttonAdmin">Admin Panel</button>
        </Link>
      </div>
      <div className="d-flex justify-content-center mb-5">
        <div className="btn-group" role="group" aria-label="Basic outlined example">
          <button
            type="button"
            className={`btn btn-outline-secondary buttonAdmin dual ${pageAction ? "actual" : ""}`}
            onClick={() => setPageAction(true)}
          >
            View List
          </button>
          <button
            type="button"
            className={`btn btn-outline-secondary buttonAdmin dual ${!pageAction ? "actual" : ""}`}
            onClick={() => setPageAction(false)}
          >
            Create new
          </button>
        </div>
      </div>
      {pageAction ? (
        <>
          <h3 className="text-center mb-4">Posts list</h3>
          <div className="d-flex justify-content-center">
            <ul className="list-group w-100" style={{ maxWidth: "800px" }}>
              {posts.map((item) => (
                <li key={item.id} className="list-group-item mb-2">
                  {
                    !pageEdit || (pageEdit && currentPost && currentPost.id !== item.id) ? (
                      <>
                        <div className="d-flex align-items-center justify-content-between w-100">
                          <div className="mb-2 mb-md-0">
                            <div className="d-flex align-items-center justify-content-between w-100 text-truncate" style={{ maxWidth: "50vh" }}>
                              
                                <strong>ID: &nbsp; </strong>{item.id},&nbsp;
                                <strong> Game name:&nbsp; </strong>{item.game_name},&nbsp;
                                <strong> Title:&nbsp; </strong>{item.title},&nbsp;
                                
                                  <strong> Photo: &nbsp;</strong>{item.image_url}
                               
                              
                            </div>
                            <div className={`${showBodyId === item.id ? "" : "d-none"}`}>
                              <span>{item.body}</span>
                            </div>
                          </div>
                          <div className="d-flex align-items-center">
                            <div className="me-2">
                              <i
                                className={`fa-solid ${showBodyId !== item.id ? "fa-eye" : "fa-eye-slash"} pointer`}
                                onClick={() => toggleBody(item.id)}
                              ></i>
                            </div>
                            <div className="me-2">
                              <i
                                className="fa-solid fa-pencil pointer"
                                onClick={() => editPost(item)}
                              ></i>
                            </div>
                            <div>
                              <i
                                className="fa-solid fa-trash pointer"
                                onClick={() => deletePost(item)}
                              ></i>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      currentPost && currentPost.id === item.id && (
                        <div>
                          <div className="d-flex flex-wrap mb-3">
                            <input
                              type="text"
                              value={`ID: ${currentPost.id}`}
                              className="form-control me-2 mb-2"
                              disabled
                              style={{ maxWidth: "150px" }}
                            />
                            <input
                              type="text"
                              value={currentPost.game_name}
                              className="form-control me-2 mb-2"
                              style={{ maxWidth: "150px" }}
                              onChange={(event) => setCurrentPost({ ...currentPost, game_name: event.target.value })}
                            />
                            <input
                              type="text"
                              placeholder="Título"
                              value={currentPost.title}
                              className="form-control me-2 mb-2"
                              style={{ flex: "1" }}
                              onChange={(event) => setCurrentPost({ ...currentPost, title: event.target.value })}
                            />
                            <input
                              type="text"
                              placeholder="URL de Imagen"
                              value={currentPost.image_url}
                              className="form-control me-2 mb-2"
                              style={{ maxWidth: "250px" }}
                              onChange={(event) => setCurrentPost({ ...currentPost, image_url: event.target.value })}
                            />
                          </div>
                          <textarea
                            className="form-control mb-3"
                            placeholder="Descripción"
                            value={currentPost.body}
                            onChange={(event) => setCurrentPost({ ...currentPost, body: event.target.value })}
                          ></textarea>
                          <div className="d-flex justify-content-center">
                            <button className="buttonAdmin" onClick={handleEdit}>Send</button>
                            <button className="buttonAdmin ms-2 text-danger" onClick={() => setPageEdit(false)}>Cancel</button>

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
          <h3 className="text-center my-4">Create a post</h3>
          <div className="container-fluid d-flex justify-content-center">
            <div className="w-100" style={{ maxWidth: "800px" }}>
              <div className="mb-3">
                <label className="form-label" htmlFor="create-post-title">Título</label>
                <input
                  type="text"
                  className="form-control"
                  id="create-post-title"
                  placeholder="Título"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="create-post-game-id">Game ID</label>
                <input
                  type="text"
                  className="form-control"
                  id="create-post-game-id"
                  placeholder="Game ID"
                  value={gameId}
                  onChange={(e) => setGameId(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="create-post-image-url">Image URL</label>
                <input
                  type="text"
                  className="form-control"
                  id="create-post-image-url"
                  placeholder="URL"
                  value={imageURL}
                  onChange={(e) => setImageURL(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="create-post-body">Body</label>
                <textarea
                  className="form-control"
                  id="create-post-body"
                  placeholder="Add post body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                ></textarea>
              </div>
              <div className="d-flex justify-content-center mt-3">
                <button className="buttonAdmin" onClick={handleSubmitPost}>Send</button>
                <button className="buttonAdmin ms-2 text-danger" onClick={resetData}>Cancel</button>

              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
