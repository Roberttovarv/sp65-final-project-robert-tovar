const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            token: null,
            admin: null,
            user: null,
            currentGame: {},
            isLogin: false,
        },
        actions: {

            login: async (email, password) => {
                console.log("Intentando iniciar sesión con email:", email);
                console.log("Contraseña:", password);
                const url = process.env.BACKEND_URL + '/api/login';

                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password })
                });

                if (!response.ok) {
                    console.log("Error logging in", response.status, response.statusText);
                    return null;
                }

                const data = await response.json();
                if (data.access_token) {
                    setStore({ token: data.access_token });
                    localStorage.setItem('token', data.access_token);
                    getActions().setIsLogin(true);

                    setStore({ admin: data.is_admin });
                    localStorage.setItem('admin', data.is_admin);
                }
                return data;
            },
            
            logout: () => {
                setStore({ token: null });
                localStorage.removeItem('token');
                getActions().setIsLogin(false);
            },

            fetchProfile: () => {

            },

            setCurrentGame: (game) => {
                setStore({ currentGame: game });
            },
            
            setIsLogin: (login) => {
                setStore({ isLogin: login });
            },

            setUser: (user) => {
                const store = getStore();
                setStore({ user });
            },

            setCurrentUser: (user) => {
                setStore({ user });
            },

        },
    };
};

export default getState;
