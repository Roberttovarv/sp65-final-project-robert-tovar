import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/landing.css";

export const Profile = () => {
    const { store, actions } = useContext(Context);
    const [userEdit, setUserEdit] = useState(false);

    const host = `${process.env.BACKEND_URL}`;

    useEffect(() => {
        actions.fetchProfile();
    }, []);

    const handleEdit = async (event) => {
        event.preventDefault();
        const user = store.user || {}; 
        const dataToSend = {
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            email: user.email || '',
            username: user.username || '',
        };

        const uri = host + `/api/users/${user.id}`;
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

        await actions.fetchProfile();
        setUserEdit(false);
    };

    const editUser = () => {
        setUserEdit(true);
    };

    const user = store.user || {};

    return (
        <>
            <div className="container-fluid">
                <div className="container rounded bg-white mt-5 mb-5">
                    <div className="row d-flex justify-content-center rounded-5">
                        <div className="col-md-3 border-right">
                            <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                                <img className={`rounded-circle mt-5 border ${ store.admin ? "border-danger" : "border-dark" } border-5`} width="150px" height="150px" src={user.pfp} alt="profile"
                                style={{objectFit: "cover"}} />
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
                                                disabled={!userEdit}
                                                type="text"
                                                className="form-control"
                                                placeholder="Nombre"
                                                value={user.first_name || ''}
                                                onChange={(e) => actions.setUser({ ...user, first_name: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="labels">Apellido</label>
                                            <input
                                                disabled={!userEdit}
                                                type="text"
                                                className="form-control"
                                                placeholder="Apellido"
                                                value={user.last_name || ''}
                                                onChange={(e) => actions.setUser({ ...user, last_name: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-md-12">
                                            <label className="labels">Correo Electrónico</label>
                                            <input
                                                disabled={!userEdit}
                                                type="email"
                                                className="form-control"
                                                placeholder="Correo Electrónico"
                                                value={user.email || ''}
                                                onChange={(e) => actions.setUser({ ...user, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-12">
                                            <label className="labels">Nombre de usuario</label>
                                            <input
                                                disabled={!userEdit}
                                                type="text"
                                                className="form-control"
                                                placeholder="Nombre de usuario"
                                                value={user.username || ''}
                                                onChange={(e) => actions.setUser({ ...user, username: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-5 d-flex justify-content-center">
                                        {!userEdit ?
                                            <button className="comic-button" type="button" onClick={editUser}>Editar perfil</button>
                                            :
                                            <button className="comic-button" type="submit">Guardar cambios</button>
                                        }
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
