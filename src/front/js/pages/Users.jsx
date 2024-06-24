import React, { useEffect, useState } from "react";

export const Users = () => {
    const [users, setUsers] = useState('');  // Inicializar con una cadena vacía como tenías originalmente

    const getUsers = async () => {
        const uri = 'https://ideal-space-succotash-r44jgw9vgjw93w7g9-3001.app.github.dev/api/users';
        const options = {
            method: 'GET'
        };
        const response = await fetch(uri, options);
        if (!response.ok) {
            console.log('Error', response.ok, response.status, response.statusText);
            return;
        }
        const data = await response.json();
        setUsers(data.results);  // Asegúrate de acceder a la propiedad correcta en la respuesta
    };

    useEffect(() => {
        getUsers();  // Llamar a getUsers cuando el componente se monta
    }, []);

    return (
        <div className="container text-start">
            <h1 className="text-center text-success">Users</h1>
            {!users ? <p>nada</p> :
             <ul>
                {users.map((item) => <li key={item.id} className="list-group-item">{item.email}</li>)}
            </ul>}
        </div>
    );
};