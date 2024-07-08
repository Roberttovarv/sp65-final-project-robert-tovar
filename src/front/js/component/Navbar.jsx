import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Carrito } from "./Carrito.jsx";
import { Context } from "./../store/appContext";


export const Navbar = () => {
    const [user, setUser] = useState(null);
    const { store, actions } = useContext(Context);

	const host = `${process.env.BACKEND_URL}`
	
    const getUser = async (id) => {
		const uri = host + '/api/users/' + id;
        const options = { method: 'GET' };
		
        const response = await fetch(uri, options);
		
        if (!response.ok) {
			console.log("Error", response.status, response.statusText);
        }
		
        const data = await response.json();
        setUser(data.results);
    };
	
	useEffect(() => {
		getUser();
	}, []);


	return (
		<div>
			<nav className="navbar border border-bottom-3">
				<div className="container">
					<Link to="/">
						<span className="navbar-brand mb-0 h1">Logo</span>
					</Link>                    
                    <div className="pointer h-100 div-btn"><Link to="/store"><span className="sombra-text"><button className="nav-btn  bordered-text">Tienda</button></span></Link></div>
                    <div className="pointer h-100 div-btn"><Link to="/categories"><button className="nav-btn  bordered-text">Categorías</button></Link></div> 
                    <div className="pointer h-100 div-btn"><Link to="/reviews"><button className="nav-btn  bordered-text">Reseñas</button></Link></div>
                   { !store.auth ? ( <div className="pointer h-100 div-btn"><Link to="/login-register"><button className="nav-btn bordered-text">Ingresar</button></Link></div>
				    ) : (
                    <div className="pointer h-100 div-btn"><Link to="/adminpanel"><button className="nav-btn  bordered-text">Hola!</button></Link></div> )}
				</div>

			</nav>
		</div>
	);
};

