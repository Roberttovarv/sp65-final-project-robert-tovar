import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/landing.css";
import { useNavigate } from "react-router-dom";
import { LoginRegister } from "./LoginRegister.jsx";

export const Profile = () => {
    const { store, actions } = useContext(Context);
    const [userEdit, setUserEdit] = useState(false);
    const [selected, setSelected] = useState('');

    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [name, setName] = useState("")
    const [lastName, setLastName] = useState("")

    const navigate = useNavigate();

    const host = `${process.env.BACKEND_URL}`;

    useEffect(() => {

        !store.user ? navigate("/login-register") : null;
        actions.fetchProfile();
        actions.getPfps();
        userData();
    }, []);
    const userData = () => {
        setEmail(store.user.email);
        setName(store.user.first_name);
        setLastName(store.user.last_name);
        setUsername(store.user.username);
    }
    const resetData = () => {
        setEmail(store.user.email)
        setUsername(store.user.username)
        setName(store.user.first_name)
        setLastName(store.user.last_name)
        console.log(store.user)
        
    }

    const handleEdit = async (event) => {
        event.preventDefault();
        const pfpId = store.currentItem ? store.currentItem.id : user.pfp;
        const user = store.user || {};
        const dataToSend = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            username: user.username,
            pfp: pfpId,
        };

        const uri = host + `/api/users/${user.id}`;
        const options = {
            method: 'PUT',
            body: JSON.stringify(dataToSend),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${store.token}`
            }

        };

        const response = await fetch(uri, options);

        if (!response.ok) {
            console.log("Error", response.status, response.statusText);
            return;
        }

        await actions.fetchProfile();
    };

    const editUser = () => {
        setUserEdit(true);
    };

    const user = store.user || {};

    return (
        <>
            <div className="container-fluid">
                <div className="container rounded bgc mt-5 mb-5">
                    <div className="row d-flex justify-content-center rounded-5">
                        <div className="col-md-3 border-right d-block align-items-center justify-content-center">
                            <div className="d-flex flex-column align-items-center justify-content-center text-center p-3 py-5 position-relative">
                                <div className="position-relative">
                                    <img
                                        className={`rounded-circle mt-5 border ${store.admin ? "border-danger" : "border-secondary"} border-5`}
                                        width="250px"
                                        height="250px"
                                        src={user.pfp}
                                        alt="profile"
                                        style={{ objectFit: "cover" }}
                                    />
                                    <i
                                        type="button"
                                        className="fa-solid fa-pencil position-absolute top-0 start-0 m-2 bg-dark text-white p-2 rounded-circle"
                                        data-bs-toggle="modal"
                                        data-bs-target="#exampleModal"
                                        style={{ cursor: "pointer", boxShadow: "0 0 5px rgba(0,0,0,0.5)" }}
                                    ></i>
                                </div>
                                <h3 className="text-center text-light mt-3">{user.username}</h3>
                            </div>
                        </div>
                        <div className="col-md-5 border-right">
                            <div className="p-3 py-5">
                                <div className="d-block justify-content-between align-items-center mb-3">
                                    <h3 className="text-start mb-2 text-light">User Profile</h3>
                                    {(!user.username || !user.first_name || !user.last_name) &&
                                        <h6 className="text-start mb-5 text-warning">Please complete your profile</h6>}
                                </div>
                                <div>
                                    <div className="row mt-2">
                                        <div className="col-md-6">
                                            <label className="mt-2 labels text-light">Name</label>
                                            <input
                                                disabled={!userEdit}
                                                type="text"
                                                className={`my-2 form-control bg-black ${!userEdit ? "text-secondary" : "text-light"}`}
                                                placeholder="Name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="mt-2 labels text-light">Last Name</label>
                                            <input
                                                disabled={!userEdit}
                                                type="text"
                                                className={`my-2 form-control bg-black ${!userEdit ? "text-secondary" : "text-light"}`}
                                                placeholder="Last name"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-md-12">
                                            <label className="mt-2 labels text-light">E-mail</label>
                                            <input
                                                disabled={!userEdit}
                                                type="email"
                                                className={`my-2 form-control bg-black ${!userEdit ? "text-secondary" : "text-light"}`}
                                                placeholder="E-mail"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-12">
                                            <label className="mt-2 labels text-light">Username</label>
                                            <input
                                                disabled={!userEdit}
                                                type="text"
                                                className={`my-2 form-control bg-black ${!userEdit ? "text-secondary" : "text-light"}`}
                                                placeholder="Username"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-5 d-flex justify-content-center">
                                        {!userEdit ?
                                            (<button className="button" type="button" onClick={editUser}>Edit Profile</button>)
                                            :
                                            (<>
                                            <button className="button me-2" type="submit" onClick={(e) => { handleEdit(e); setUserEdit(false) }}>Save changes</button>
                                            <button className="button" type="button" onClick={(e) => { resetData(e); setUserEdit(false); }}>Cancel</button>
                                            </>)
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog text-light">
                    <div className="modal-content bg-dark">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Change Profile Picture</h5>
                            <button type="button" className="btn-close text-light" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body d-flex flex-wrap justify-content-center">
                            {store.pfps.slice(0, store.pfps.length + 1).map((pfp, index) => (
                                <div key={index} className="p-2">
                                    <img
                                        src={pfp.url}
                                        alt={pfp.name}
                                        className="border border-2 rounded-circle"
                                        style={{ width: "100px", height: "100px", objectFit: "cover", cursor: "pointer", ...(selected == pfp ? { filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))" } : {}) }}
                                        onClick={() => { actions.setCurrentItem(pfp); setSelected(pfp) }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="button" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="button" data-bs-dismiss="modal" onClick={(e) => handleEdit(e)}>Change</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
