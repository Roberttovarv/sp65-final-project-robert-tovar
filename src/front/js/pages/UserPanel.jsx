import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext.js";
import "../../styles/adminpanel.css";
import { NotFound } from "../component/NotFound.jsx"


/// Poner limite de texto a la url

export const UserPanel = () => {
    const { store, actions } = useContext(Context);
    const [users, setUsers] = useState([]);


    const host = `${process.env.BACKEND_URL}`

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        const uri = host + '/api/users/';
        const options = { method: 'GET' };

        const response = await fetch(uri, options);

        if (!response.ok) {
            console.log("Error", response.status, response.statusText);
        }

        const data = await response.json();
        setUsers(data.results);
    };



   const deleteUser = async (item) => {
        const uri = host + '/api/users/' + item.id
        const options = {
            method: 'DELETE'
        }
        const response = await fetch(uri, options)

        if (!response.ok) {
            console.log("Error", response.status, response.statusText);
            return
        }
        getUsers();
    }

    

   
    return (
        <>
        {!store.admin ?
        (<NotFound />)
    :
           ( <div>
                <div className="d-flex justify-content-end mx-3 my-3">
                    <Link to="/adminpanel"><button className="admin-button">Admin Panel</button></Link>
                </div>

                <>
                    <h3 className="text-center">Lista de usuarios</h3>
                    <div className="mx-5 d-flex justify-content-center">
                        <ul className="list-group" style={{ width: "60%" }}>
                            {users.map((item) => (
                                <li key={item.id} className="list-group-item border border-top-0 border-end-0 border-3 border-bottom-2 border-start-1 mb-2">

                                    <>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div>
                                                <div>
                                                    <span><strong>ID: </strong>{item.id}, <strong>Nombre:</strong> {item.first_name}, <strong>Apellido:</strong> {item.last_name}, <strong>Email:</strong> {item.email}, <strong>Admin:</strong> {`${item.is_admin ? "Sí" : "No"}`} </span>
                                                </div>

                                            </div>
                                            <div className="d-flex">

                                                <i className="fa-solid fa-trash pointer" onClick={() => deleteUser(item)}></i>

                                            </div>
                                        </div>
                                    </>

                                </li>
                            ))}
                        </ul>
                    </div>
                </>

            </div>)
     }
        </>
    );
};
