import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/landing.css";

export const PostsDetails = () => {
    const { store } = useContext(Context);

      const comments = store.currentItem.comments || [];
  const navigate = useNavigate()

  useEffect(() => {
    actions.fetchProfile();
    console.log(store.currentItem.comments);
  }, [store.currentItem, actions]); 

    return (
        <div className="row justify-content-center gamedet m-3">
            <div className="col-6">
                <div className="card tarjeta">
                    <div className="card-header">
                        <h2 className="text-light">{store.currentItem.title}</h2>
                    </div>
                    <img src={store.currentItem.image_url} className="card-img-top" alt={store.currentItem.name} />
                    <div className="card-body">
                        <p className="card-text text-light">{store.currentItem.body}</p>
                    </div>
                    <div className="d-flex justify-content-center m-3">
                        <div style={{ width: "70%", height: "60%", overflow: "hidden" }} className="d-flex justify-content-center align-items-center">
                            <img
                                src="https://i.ytimg.com/vi/fj245xMr-BM/maxresdefault.jpg"
                                className="img-fluid"
                                alt="Nvidia Publicidad"
                                style={{ objectFit: "cover", height: "100%", width: "auto" }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div class="input-container col-8 mt-5">
  <input placeholder="" class="input-field text-light" type="text"
      value={store.comment} 
      onChange={(e) => actions.handlePostComment(e)} 
      onKeyDown={(e) => {store.isLogin ? actions.sendPostComent(e) : navigate('/login-register')}} />
  <label for="input-field" class="input-label ps-3 pt-3">Add comment</label>
  <span class="input-highlight"></span>
</div>

      <div className="col-8 mt-5">
        <div className="d-flex flex-column align-items-center px-3">
          {comments.map((comment, index) => (
            <div key={index} className="mb-2 mt-2 pt-2 w-100 px-3 bg-dark bg-opacity-25 rounded-3"
            style={{filter: "drop-shadow(0 0 10px rgba(200, 200, 200, 0.1))"}}>
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
              <div className="text-white ms-5 pb-2 mt-1 border-dark border-bottom me-5">
                <span> {comment.body}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
        </div>
    );
};
