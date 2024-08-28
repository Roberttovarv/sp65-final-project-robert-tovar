import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";


export const Arrow = () => {
    const navigate = useNavigate();

	return (
		<div className="text-center mt-5 text-white">
			<i 
            className="fa-solid fa-arrow-left" 
            onClick={() => navigate(-1)}
            style={{cursor: "pointer"}}></i>
		</div>
	);
};
