import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/landing.css";
import { useNavigate } from "react-router-dom";

export const GameDetails = () => {
  const { store, actions } = useContext(Context);

  const comments = store.currentItem.comments || [];
  const navigate = useNavigate()

  useEffect(() => {
    actions.fetchProfile();
    console.log(store.currentItem.comments);
  }, [store.currentItem, actions]); 
  

  return (
    <div className="row justify-content-center gamedet m-3">
      <div className="col-8">
        <div className="card tarjeta">
          <div className="card-header">
            <h2 className="text-light">{store.currentItem.name}</h2>
          </div>
          <img
            src={store.currentItem.background_image}
            className="card-img-top"
            alt={store.currentItem.name}
          />
          <div className="card-body">
            <p className="card-text text-light">
              <strong>Rating:</strong> {store.currentItem.metacritic}
            </p>
            <p className="card-text text-light">
              Description: {store.currentItem.description}
            </p>
          </div>
          <div className="d-flex justify-content-between align-items-end">
            <a
              href={`https://store.steampowered.com/search/?term=${store.currentItem.name}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="button m-3">
                Search in Steam
              </button>
            </a>

            <span className="text-light m-2 me-4" style={{fontSize: "1.5rem"}}>
              
              <i
 className={`far fa-heart hover-shadow ${actions.likedGameId().includes(store.currentItem.id) ? "fas text-danger" : "far text-light"}`} 
 onClick={() => store.isLogin ? actions.handleGameLike(store.currentItem.id) : navigate("/login-register")}
                style={{ cursor: "pointer", fontSize: "1.5rem" }}
              ></i>
            </span>
          </div>
        </div>
      </div>
      <div class="input-container col-8 mt-5">
      <input
  placeholder=""
  className="input-field text-light"
  type="text"
  value={store.comment} 
  onChange={(e) => actions.setComment(e.target.value)}
  onKeyDown={(e) => store.isLogin ? actions.sendGameComment(e) : navigate('/login-register')}
/>

  <label for="input-field" class="input-label ps-3 pt-3">Add comment</label>
  <span class="input-highlight"></span>
</div>

<div className="col-8 mt-5">
  <div className="d-flex flex-column align-items-center px-3">
    {comments.slice().reverse().map((comment, index) => (
      <div
        key={index}
        className="mb-2 mt-2 pt-2 w-100 px-3 bg-dark bg-opacity-25 rounded-3"
        style={{ filter: "drop-shadow(0 0 10px rgba(200, 200, 200, 0.1))" }}
      >
        <div className="d-flex align-items-center text-white">
          <img
            src={comment.user_pfp}
            className="me-2 border border-1"
            alt={comment.username}
            style={{
              aspectRatio: "1 / 1",
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          <strong>
            {comment.username.charAt(0).toUpperCase() + comment.username.slice(1).toLowerCase()}
          </strong>
        </div>
        <div className="text-white ms-5 pb-2 mt-1 border-dark border-bottom me-5 d-flex justify-content-between">
          <span>{comment.body}</span>
          <i
            className={`fa-solid fa-trash pointer ${store.admin || comment.user_id === store.user.id ? '' : 'd-none'}`}
            onClick={() => actions.deleteGameComment(comment.id)}  
          ></i>
        </div>
      </div>
    ))}
  </div>
</div>

    </div>
  );
};
