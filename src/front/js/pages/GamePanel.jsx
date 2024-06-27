import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext.js";
import "../../styles/adminpanel.css";

export const GamePanel = () => {
  const { store, actions } = useContext(Context);
  const [pageAction, setPageAction] = useState(true);
  const [pageEdit, setPageEdit] = useState(false);

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
                {/* {store.games.map((item) => (

                { !pageEdit ? (
                <li className="list-group-item border border-top-0 border-end-0 border-3 border-bottom-2 border-start-1 mb-2">
                <span>{item.id}, {item.title}, {item.image_url}</span>
                <i class="fa-solid fa-pencil pointer float-end" 
                onClick={() => setPageEdit(true)}></i>
                </li>
                ) : (
                <li className="list-group-item border border-0 mb-2 mx-0 
                d-flex justify-content-center px-0" style={{width: "100%"}} > 
                    <div className="d-block" style={{width: "100%"}}>
                    <div className="d-flex">
                  <input type="text" value={`ID: ${item.id}`} //puede que necesite doble llave
                  className="flex-input" readOnly style={{width: "15%"}}/>
                  <input type="text" value="title" 
                  className="flex-input" style={{width: "60%"}}/>
                  <input type="text" value="image_url" 
                  className="flex-input" style={{width: "30%"}}/>
                  </div>
                  <div>
                  <textarea className="form-control" aria-label="With textarea" 
                  value={`ID: ${item.description}`}></textarea>    
                  </div>
                  <div className="justify-content-center d-flex mt-1">
                  <button className="rounded-3 bg-light" onClick={() => setPageEdit(false)}>Enviar</button></div>
                  </div>
                  </li>
                )))} */}

                {!pageEdit ? (
                  <li className="list-group-item border border-top-0 border-end-0 border-3 border-bottom-2 border-start-1 mb-2">
                    <span>ID: 1, Red Dead Redemption, image.url.es</span>
                    <i class="fa-solid fa-pencil pointer float-end" onClick={() => setPageEdit(true)}></i>
                  </li>
                ) : (
                  <li className="list-group-item border border-0 mb-2 mx-0 d-flex justify-content-center px-0"
                    style={{ width: "100%" }} >
                    <div className="d-block" style={{ width: "100%" }}>
                      <div className="d-flex">
                        <input type="text" placeholder="ID: 1"
                          className="flex-input" readOnly style={{ width: "15%" }} />
                        <input type="text" placeholder="title" defaultValue={"Red Dead Redemption"} //Tiene que cambiarse por "value" y aplicar el onchange
                          className="flex-input" style={{ width: "60%" }} />
                        <input type="text" placeholder="image_url" defaultValue={"image.url.es"}
                          className="flex-input" style={{ width: "30%" }} />
                      </div>
                      <div>
                        <textarea className="form-control" aria-label="With textarea"
                          placeholder="Añada una descripción">Decripción acual del videojuego que estoy editando</textarea>
                      </div>
                      <div className="justify-content-center d-flex mt-1">
                        <button className="rounded-3 bg-light" onClick={() => setPageEdit(false)}>Enviar</button>
                      </div>
                    </div>
                  </li>
                )}
                <li className="list-group-item border border-top-0 border-end-0 border-3 border-bottom-2 border-start-1 mb-2">
                  <span>ID: 2, God of War, image.ulr.com</span>
                  <i class="fa-solid fa-pencil pointer float-end" onClick={() => setPageEdit(true)}></i>
                </li>


                <li className="list-group-item border border-top-0 border-end-0 border-3 border-bottom-2 border-start-1 mb-2">
                  <span>ID: 3, Cyberpunk, image.url.es</span>
                  <i class="fa-solid fa-pencil pointer float-end" onClick={() => setPageEdit(true)}></i>
                </li>
                <li className="list-group-item border border-top-0 border-end-0 border-3 border-bottom-2 border-start-1 mb-2">
                  <span>ID: 4, The Last of Us, image.ulr.com</span>
                  <i class="fa-solid fa-pencil pointer float-end" onClick={() => setPageEdit(true)}></i>
                </li>

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
                  <input type="text" className="form-control" placeholder="Nombre" id="game-name" />
                </div>

                <label className="mb-1" htmlFor="basic-url">Image URL</label>
                <div className="input-group mb-3">
                  <div className="input-group-prepend"></div>
                  <input type="text" className="form-control" id="basic-url" placeholder="URL" />
                </div>

                <label className="mb-1" htmlFor="game-description">Descripción</label>
                <div className="input-group">
                  <div className="input-group-prepend"></div>
                  <textarea className="form-control" aria-label="With textarea" placeholder="Añada una descripción"></textarea>
                </div>
              </div>
            </div>
          </>
        )}


      </div>
    </>
  );
};
