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
              <p className="card-text text-light">Rating: {store.currentGame.metacritics}</p>
              <p className="card-text text-light">Description: {store.currentGame.description}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  