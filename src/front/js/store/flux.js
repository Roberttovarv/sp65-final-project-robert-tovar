

const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            message: null,
            counter: 2,
            token: null,
            admin: false,
            review: null,
            games: [],
            topGames: [],
            bestRatedGames: [],
            user: null,
            auth: false,
            currentGame: {},

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
                    setStore({auth: true})
                }
                if (data.is_admin) {
                    setStore({ admin: data.is_admin});
                    localStorage.setItem('admin', data.is_admin);
                    setStore({admin: true})
                }
                return data;
            },
            
            logout: () => {
                setStore({ token: null });
                localStorage.removeItem('token');
                setStore({auth: false})
            },

            setCurrentGame: (game) => {
             
                setStore({currentGame: game});
            },


            changeColor: (index, color) => {
                const store = getStore();  // Get the store
                // We have to loop the entire demo array to look for the respective index and change its color
                const demo = store.demo.map((element, i) => {
                    if (i === index) element.background = color;
                    return element;
                });
                setStore({ demo: demo });  // Reset the global store
            },
          }
    };

}
export default getState;