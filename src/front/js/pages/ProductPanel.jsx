import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext.js";
import "../../styles/adminpanel.css";

export const ProductPanel = () => {
  const { store, actions } = useContext(Context);
  const [products, setProducts] = useState([]);
  const [pageAction, setPageAction] = useState(true);
  const [pageEdit, setPageEdit] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [showPlatformId, setShowPlatformId] = useState(false);

  const [platform, setPlatform] = useState("");
  const [price, setPrice] = useState("");
  const [gameId, setGameId] = useState("");
  const [cdk, setCdk] = useState("");

  const host = `${process.env.BACKEND_URL}`;

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    const uri = host + '/api/products';
    const options = { method: 'GET' };

    const response = await fetch(uri, options);

    if (!response.ok) {
      console.log("Error", response.status, response.statusText);
    }

    const data = await response.json();
    setProducts(data.results);
  };

  const handleSubmitProduct = async () => {
    const gameData = {
      cdk: cdk,
      price: price,
      platform: platform,
      game_id: gameId,
    };

    const uri = host + '/api/products';
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

    setCdk("");
    setPrice("");
    setPlatform("");
    setGameId("");

    getProducts();
  };

  const handleEdit = async (event) => {
    event.preventDefault();
    const dataToSend = {
      cdk: currentProduct.cdk,
      price: currentProduct.price,
      platform: currentProduct.platform,
      game_id: currentProduct.game_id,
    };

    const uri = host + `/api/products/${currentProduct.id}`;
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

    getProducts();

    setCurrentProduct(null);
    setPageEdit(false);
  };

  const deleteProduct = async (item) => {
    const uri = host + '/api/products/' + item.id
    const options = {
      method: 'DELETE'
    }
    const response = await fetch(uri, options)

    if (!response.ok) {
      console.log("Error", response.status, response.statusText);
      return
    }
    getProducts();
  }

  const editProduct = (item) => {
    setCurrentProduct(item);
    setPageEdit(true);
  };

  const togglePlatform = (id) => {
    if (showPlatformId === id) {
      setShowPlatformId(null);
    } else {
      setShowPlatformId(id);
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
                {products.map((item) => (
                  <li key={item.id} className="list-group-item border border-top-0 border-end-0 border-3 border-bottom-2 border-start-1 mb-2">
                    {
                      !pageEdit || (pageEdit && currentProduct && currentProduct.id !== item.id) ? (
                        <>
                          <div className="d-flex align-items-center justify-content-between">
                            <div>
                              <div>
                                <span>{item.id},, {item.name} {item.cdk}, {item.platform}, {item.price}</span>
                              </div>
                            </div>
                            <div className="d-flex">
                              <div className="mx-3">
                                <i className="fa-solid fa-pencil pointer" onClick={() => editProduct(item)}></i>
                              </div>
                              <div>
                                <i className="fa-solid fa-trash pointer" onClick={() => deleteProduct(item)}></i>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        currentProduct && currentProduct.id === item.id && (
                          <div className="d-block w-100">
                            <div className="d-flex">
                              <input type="text" value={`ID: ${currentProduct.id}`} className="flex-input" readOnly style={{ width: "15%" }} />
                              <input type="number" value={currentProduct.game_id} className="flex-input" style={{ width: "15%" }} onChange={(event) => setCurrentProduct({ ...currentProduct, game_id: event.target.value })} />
                              <input type="text" placeholder="cdk" value={currentProduct.cdk} className="flex-input" style={{ width: "60%" }} onChange={(event) => setCurrentProduct({ ...currentProduct, cdk: event.target.value })} />
                              <input type="text" placeholder="price" value={currentProduct.price} className="flex-input" style={{ width: "30%" }} onChange={(event) => setCurrentProduct({ ...currentProduct, price: event.target.value })} />
                            </div>
                            <div>
                              <select className="form-select" aria-label="Default select example" value={currentProduct.platform} onChange={(event) => setCurrentProduct({ ...currentProduct, platform: event.target.value })}>
                                <option value="">Seleccionar Plataforma</option>
                                <option value="computer">PC</option>
                                <option value="playstation">PlayStation</option>
                                <option value="xbox">Xbox</option>
                                <option value="switch">Nintendo Switch</option>
                              </select>
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
            <h3 className="text-center my-4">Crear un producto</h3>
            <div className="container-fluid d-flex justify-content-center" style={{ width: "60%" }}>
              <div className="w-100">
                <label className="mb-1" htmlFor="create-product"></label>
                <div className="input-group mb-3">
                  <div className="input-group-prepend"></div>
                  <input type="text" className="form-control" placeholder="CDK"
                    id="create-product" value={cdk} onChange={(e) => setCdk(e.target.value)} />
                  <input type="number" className="form-control" placeholder="Game ID"
                    id="create-product" value={gameId} onChange={(e) => setGameId(e.target.value)} />
                  
                    <div className="input-group-prepend"></div>
                    <input type="text" className="form-control" id="basic-url"
                      placeholder="Precio" value={price} onChange={(e) => setPrice(e.target.value)} />

                  
                </div>

                <select className="form-select" aria-label="Default select example" value={platform} onChange={(e) => setPlatform(e.target.value)}>
                  <option value="">Seleccionar Plataforma</option>
                  <option value="computer">PC</option>
                  <option value="playstation">PlayStation</option>
                  <option value="xbox">Xbox</option>
                  <option value="switch">Nintendo Switch</option>
                </select>

                <div className="d-flex justify-content-center mt-3">
                  <button className="rounded-3 bg-light" onClick={handleSubmitProduct}>Enviar</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
