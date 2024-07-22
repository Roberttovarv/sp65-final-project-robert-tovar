import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/landing.css"

export const GameDetails = () => {
    const { store } = useContext(Context);
  
   
    return (
      <div className="row justify-content-center gamedet m-3 ">
         <div className="col-6">
          <div className="card tarjeta">
            <div className="card-header">
              <h2 className="text-light">{store.currentGame.name}</h2>
            </div>
            <img src={store.currentGame.background_image} className="card-img-top" alt={store.currentGame.name} />
            <div className="card-body ">
              <p className="card-text text-light"><strong>Rating:</strong> {store.currentGame.metacritic}</p>
              <p className="card-text text-light">Description: {store.currentGame.description}</p>
            </div>
            <div>
            <a
              href={`https://store.steampowered.com/search/?term=${store.currentGame.name}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button type="button" className="btn btn-secondary m-3">
                Search in Steam
              </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };
  