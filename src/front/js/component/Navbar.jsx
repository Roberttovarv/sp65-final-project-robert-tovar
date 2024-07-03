import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "./../store/appContext.js";
import { Carrito } from "../pages/Carrito.jsx";

export const Navbar = () => {

	const { store, actions } = useContext(Context)

	return (
		<div>
			<nav className="navbar border border-bottom-3">
				<div className="container">
					<Link to="/">
						<span className="navbar-brand mb-0 h1">Logo</span>
					</Link>
					<div className="pointer h-100 div-btn"><Link to="/store"><button className="nav-btn"> Tienda</button></Link></div>
					<div className="pointer h-100 div-btn"><button className="nav-btn">Categorías</button></div>
					<div className="pointer h-100 div-btn"><Link to="/reviews"><button className="nav-btn">Reseñas</button></Link></div>
					<div className="pointer h-100 div-btn"><Link to="/login"><button className="nav-btn">Login</button></Link></div>
					<div className="pointer h-100 div-btn"><Link to="/signup"><button className="nav-btn">Registrarse</button></Link></div>
					<Carrito />
				</div>

			</nav>
		</div>
	);
};
