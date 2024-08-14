import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/landing.css"

export const GameDetails = () => {
    const { store } = useContext(Context);
    console.log(store.currentItem)
  
   
    return (
      <div className="row justify-content-center gamedet m-3 ">
         <div className="col-6">
          <div className="card tarjeta">
            <div className="card-header">
              <h2 className="text-light">{store.currentItem.name}</h2>
            </div>
            <img src={store.currentItem.background_image} className="card-img-top" alt={store.currentItem.name} />
            <div className="card-body ">
              <p className="card-text text-light"><strong>Rating:</strong> {store.currentItem.metacritic}</p>
              <p className="card-text text-light">Description: {store.currentItem.description}</p>
            </div>
            <div>
            <a
              href={`https://store.steampowered.com/search/?term=${store.currentItem.name}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="button m-3">
 Search in Steam
</button>
              </a>

              <span className="text-light">
                                        {store.currentItem.likes} &nbsp; <i className={`far fa-heart ${store.currentItem.is_liked ? "fas text-warning" : "far"}`} style={{ cursor: 'pointer' }}></i> 
                                        </span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  