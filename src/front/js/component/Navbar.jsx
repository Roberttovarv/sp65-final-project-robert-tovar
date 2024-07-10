import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "./../store/appContext";
import { useNavigate } from "react-router-dom"; 



export const Navbar = () => {
    const [user, setUser] = useState(null);
    const { store, actions } = useContext(Context);

	const host = `${process.env.BACKEND_URL}`
	
    useEffect(() => {

        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log("No token found in localStorage");
                return;
            }
            
            const response = await fetch(`${host}/api/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            
            if (response.ok) {
                const data = await response.json();
                setUser(data.results);
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('is_admin', data.results.is_admin);
            } else {
                console.log("Failed to fetch profile");
            }
        };
        fetchProfile();
    }, [
    ]);

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
                   { !store.token ? (
                     <div className="pointer h-100 div-btn"><Link to="/login-register"><button className="nav-btn bordered-text">Ingresar</button></Link></div>
				    ) : ( store.admin == true ? (
                    <div className="pointer h-100 div-btn"><Link to="/adminpanel"><button className="admin-button">Admin Panel</button></Link></div> 
                        ) : (
                            <div className="pointer h-100 div-btn"><Link to="/profile"><button className="nav-btn  bordered-text">Perfil</button></Link></div>

                        )
                    )}
				</div>

			</nav>
		</div>
	);
};

