import React, { useContext } from 'react';
import { Context } from '../store/appContext';

const Logout = () => {
	const { actions } = useContext(Context);

	const handleLogout = () => {
		actions.logout();
		// Aquí podríamos hacer algo para redirigir a la página de inicio u otra página relevante después del logout
	};

	return (
		<button onClick={handleLogout}>Logout</button>
	);
};

export default Logout;