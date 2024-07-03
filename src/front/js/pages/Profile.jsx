import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext.js";
import "../../styles/index.css";


export const Profile = () => {
    const { store, actions } = useContext(Context);
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [userEdit, setUserEdit] = useState(false);

    const host = `${process.env.BACKEND_URL}`;

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        const uri = host + '/api/users';
        const options = { method: 'GET' };

        const response = await fetch(uri, options);

        if (!response.ok) {
            console.log("Error", response.status, response.statusText);
        }

        const data = await response.json();
        setUsers(data.results);
    };

    const handleEdit = async (event) => {
        event.preventDefault();
        const dataToSend = {
            name: currentUser.name,
            background_image: currentUser.background_image,
            description: currentUser.description,
        };

        const uri = host + `/api/users/${currentUser.id}`;
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

        getUsers();
        setCurrentUser(null);
        setUserEdit(false);
    };

    const editUser = (item) => {
        setCurrentUser(item);
        setUserEdit(true);
    };

    return (
        <>
            <div className="container-fluid">
                <div className="container rounded bg-white mt-5 mb-5">
                    <div className="row d-flex justify-content-center">
                        <div className="col-md-3 border-right">
                            <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                                <img className="rounded-circle mt-5" width="150px" src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" alt="profile" />
                            </div>
                        </div>
                        <div className="col-md-5 border-right">
                            <div className="p-3 py-5">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h3 className="text-center mb-5">Perfil de usuario</h3>
                                </div>
                                <form onSubmit={handleEdit}>
                                    <div className="row mt-2">
                                        <div className="col-md-6">
                                            <label className="labels">Nombre</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Nombre"
                                                value={currentUser?.name || ''}
                                                onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="labels">Apellido</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Apellido"
                                                value={currentUser?.apellido || ''}
                                                onChange={(e) => setCurrentUser({ ...currentUser, apellido: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-md-12">
                                            <label className="labels">Correo Electrónico</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                placeholder="Correo Electrónico"
                                                value={currentUser?.email || ''}
                                                onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-12">
                                            <label className="labels">Edad</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Edad"
                                                value={currentUser?.edad || ''}
                                                onChange={(e) => setCurrentUser({ ...currentUser, edad: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-5 d-flex justify-content-center">
                                        <button className="comic-button" type="submit" onClick={() => editUser }>
                                            {`${!userEdit ? "Editar perfil" : "Guardar cambios"}`}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
