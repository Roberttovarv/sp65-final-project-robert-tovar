import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "./../store/appContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

export const Navbar = () => {
    const { store } = useContext(Context);

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

                    <div>
                        <button data-quantity="0" className="btn-cart me-4 position-relative">
                            <FontAwesomeIcon icon={faShoppingCart} className="icon-cart" />
                            <span className="quantity">{store.cart.length}</span>
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success mt-1">
                                {store.cart.length}
                            </span>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            {store.cart.map((item, index) => 
                                (<li key={index} className="dropdown-item"> {item.name}</li>)
                            )}                    
                            <li><a className="dropdown-item" href="#">Something else here</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
};