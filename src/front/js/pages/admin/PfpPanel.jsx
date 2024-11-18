import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../store/appContext.js";
import { LoadingMario } from "../../component/LoadingMario.jsx";

export const PfpPanel = () => {
  const { store } = useContext(Context);
  const [pfps, setPfps] = useState([]);
  const [pageAction, setPageAction] = useState(true);
  const [pageEdit, setPageEdit] = useState(false);
  const [currentPfp, setCurrentPfp] = useState(null);
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const host = `${process.env.BACKEND_URL}`;

  const navigate = useNavigate();

  useEffect(() => {
    getPfps();
    if (!store.admin) navigate("/*");
  }, [store.admin, navigate]);

  const getPfps = async () => {
    try {
      const uri = `${host}/api/profile_pictures`;
      const options = { method: "GET" };

      const response = await fetch(uri, options);

      if (!response.ok) {
        console.error("Error", response.status, response.statusText);
        return;
      }

      const data = await response.json();
      setPfps(data.results);
    } catch (error) {
      console.error("Error fetching pfps:", error);
    }
  };

  const handleSubmitPfp = async () => {
    const pfpData = {
      name: name,
      url: url,
    };

    const uri = `${host}/api/profile_pictures`;
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pfpData),
    };

    const response = await fetch(uri, options);

    if (!response.ok) {
      console.log("Error", response.status, response.statusText);
      return;
    }
    const result = await response.json();
    console.log("Profile picture added", result);

    setName("");
    setUrl("");

    getPfps();
  };

  const handleEdit = async (event) => {
    event.preventDefault();
    const dataToSend = {
      name: name,
      url: url,
    };

    const uri = `${host}/api/profile_pictures/${currentPfp.id}`;
    const options = {
      method: "PUT",
      body: JSON.stringify(dataToSend),
      headers: { "Content-Type": "application/json" },
    };

    const response = await fetch(uri, options);

    if (!response.ok) {
      console.log("Error", response.status, response.statusText);
      return;
    }

    getPfps();

    setCurrentPfp(null);
    setPageEdit(false);
  };

  const resetData = () => {
    setName("");
    setUrl("");
    setPageAction(true)
  }

  const deletePfp = async (item) => {
    const uri = `${host}/api/profile_pictures/${item.id}`;
    const options = {
      method: "DELETE",
    };
    const response = await fetch(uri, options);

    if (!response.ok) {
      console.log("Error", response.status, response.statusText);
      return;
    }
    getPfps();
  };

  const editPfp = (item) => {
    setCurrentPfp(item);
    setPageEdit(true);
  };

  return (
    <div className="bg-light min-vh-100 p-3">
      <div className="container-fluid bg-light">
        <div className="d-flex justify-content-end mb-3">
          <Link to="/adminpanel">
            <button className="buttonAdmin">Admin Panel</button>
          </Link>
        </div>
        <div className="d-flex justify-content-center mb-4">
          <div className="btn-group" role="group" aria-label="Basic outlined example">
            <button
              type="button"
              className={`btn btn-outline-secondary buttonAdmin ${pageAction ? "actual" : ""}`}
              onClick={() => setPageAction(true)}
            >
              View List
            </button>
            <button
              type="button"
              className={`btn btn-outline-secondary buttonAdmin ${!pageAction ? "actual" : ""}`}
              onClick={() => setPageAction(false)}
            >
              Create New
            </button>
          </div>
        </div>
        {pageAction ? (
          <>
            <h3 className="text-center mb-4">Pfps List</h3>
            <div className="d-flex justify-content-center">
              <ul className="list-group w-100" style={{ maxWidth: "800px" }}>
                {pfps.length === 0 ? (
                  <LoadingMario />
                ) : (
                  pfps.map((item) => (
                    <li
                      key={item.id}
                      className="list-group-item mb-2 bg-white d-flex justify-content-between align-items-center"
                      style={{ width: "100%" }}
                    >
                      {!pageEdit || (pageEdit && currentPfp && currentPfp.id !== item.id) ? (
                        <div className="d-flex justify-content-between w-100 flex-wrap">
                          <div style={{ minWidth: "240px" }}>
                            <div>
                              <span className="d-flex align-items-center"> 
                                <strong>Item ID: </strong>{item.id}, <strong>Name:&nbsp;</strong>{item.name},&nbsp;
                                <span
                                  className="d-inline-block text-truncate"
                                  style={{ maxWidth: "20vw" }}
                                >
                                  <strong>URL: </strong>{item.url}
                                </span>
                              </span>
                            </div>
                          </div>
                          <div className="d-flex">
                            <div className="mx-2">
                              <i className="fa-solid fa-pencil pointer" onClick={() => editPfp(item)}></i>
                            </div>
                            <div>
                              <i className="fa-solid fa-trash pointer" onClick={() => deletePfp(item)}></i>
                            </div>
                          </div>
                        </div>
                      ) : (
                        currentPfp &&
                        currentPfp.id === item.id && (
                          <div className="w-100">
                            <div className="d-flex flex-wrap mb-3">
                              <input
                                type="text"
                                value={`ID: ${currentPfp.id}`}
                                className="form-control me-2 mb-2"
                                disabled
                                style={{ maxWidth: "150px" }}
                              />
                              <input
                                type="text"
                                placeholder="Name"
                                value={currentPfp.name}
                                className="form-control me-2 mb-2"
                                style={{ flex: "1" }}
                                onChange={(event) => setCurrentPfp({ ...currentPfp, name: event.target.value })}
                              />
                              <input
                                type="text"
                                placeholder="Image URL"
                                value={currentPfp.url}
                                className="form-control me-2 mb-2"
                                style={{ maxWidth: "300px" }}
                                onChange={(event) => setCurrentPfp({ ...currentPfp, url: event.target.value })}
                              />
                            </div>

                            <div className="d-flex justify-content-center">
                              <button className="buttonAdmin" onClick={handleEdit}>
                                Send
                              </button>
                              <button className="buttonAdmin ms-2 text-danger" onClick={() => setPageEdit(false)}>Cancel</button>

                            </div>
                          </div>
                        )
                      )}
                    </li>
                  ))
                )}
              </ul>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-center my-4">Add Profile Picture</h3>
            <div className="container d-flex justify-content-center">
              <div className="w-100" style={{ maxWidth: "600px" }}>
                <label className="form-label" htmlFor="pfp-name">Name</label>
                <input type="text" className="form-control mb-3" id="pfp-name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />

                <label className="form-label" htmlFor="image-url">URL</label>
                <input type="text" className="form-control mb-3" id="image-url" placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)} />

                <div className="d-flex justify-content-center">
                  <button className="buttonAdmin" onClick={() => {handleSubmitPfp(), setPageAction(true)}}>Send</button>
                  <button className="buttonAdmin ms-2 text-danger" onClick={resetData}>Cancel</button>

                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
