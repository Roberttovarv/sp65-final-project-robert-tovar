import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

export const GameDetails = () => {
    const { store } = useContext(Context);
  
   
    return (
      <div className="row justify-content-center gamedet">
        <div className="col-6">
          <div className="card">
            <div className="card-header">
              <strong>Game Title:</strong> {store.currentGame.title}
            </div>
            <img src={store.currentGame.background_image} className="card-img-top" alt={store.currentGame.name} />
            <div className="card-body">
              <p className="card-text">Rating: {store.currentGame.metacritics}</p>
              <p className="card-text">Description: {store.currentGame.description}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  