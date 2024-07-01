import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "./../store/appContext.js"


export const Navbar = () => {

	const { store, actions } = useContext(Context)

	return ( <div>
		<nav className="navbar border border-bottom-3">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">Logo</span>
				</Link>		
				<div className="pointer h-100 div-btn"><button className="nav-btn">Tienda</button></div>
				<div className="pointer h-100 div-btn"><button className="nav-btn">Categorías</button></div>
				<div className="pointer h-100 div-btn"><Link to="/reviews"><button className="nav-btn">Reseñas</button></Link></div>
				<div className="pointer h-100 div-btn"><Link to="/login"><button className="nav-btn">Login</button></Link></div>
				<div className="pointer h-100 div-btn"><Link to="/signup"><button className="nav-btn">Registrarse</button></Link></div>

			<div>
			<button data-quantity="0" className="btn-cart me-4 position-relative">
				<svg className="icon-cart" viewBox="0 0 24.38 30.52" height="30.52" width="24.38" xmlns="http://www.w3.org/2000/svg">
					<title>icon-cart</title>
					<path transform="translate(-3.62 -0.85)" d="M28,27.3,26.24,7.51a.75.75,0,0,0-.76-.69h-3.7a6,6,0,0,0-12,0H6.13a.76.76,0,0,0-.76.69L3.62,27.3v.07a4.29,4.29,0,0,0,4.52,4H23.48a4.29,4.29,0,0,0,4.52-4ZM15.81,2.37a4.47,4.47,0,0,1,4.46,4.45H11.35a4.47,4.47,0,0,1,4.46-4.45Zm7.67,27.48H8.13a2.79,2.79,0,0,1-3-2.45L6.83,8.34h3V11a.76.76,0,0,0,1.52,0V8.34h8.92V11a.76.76,0,0,0,1.52,0V8.34h3L26.48,27.4a2.79,2.79,0,0,1-3,2.44Zm0,0">{store.counter}</path>
				</svg>
				<span className="quantity">{store.counter}</span>

				<span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success mt-1">
					{store.cart.length}
				</span>
				</button>
				<ul className="dropdown-menu dropdown-menu-end">
					{store.cart.map((item, index) => 
						{<li key={index} className="dropdown-item"> {item}</li>})}					
					<li><a className="dropdown-item" href="#">Something else here</a></li>
				</ul>
			</div>
			</div>
		</nav>
		</div>
	);
};
