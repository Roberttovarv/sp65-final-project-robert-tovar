const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            message: null,
            demo: [{ title: "FIRST", background: "white", initial: "white" }],
            counter: 2,
            token: null,
            reviews: [],
            review: null,
            games: [],
            topGames: [],
            bestRatedGames: [],
            user: null,
            cart: [], // Añadido para almacenar los juegos en el carrito
            actionGames: [], // Añadido para los juegos de acción
			      rpgGames: [] // Añadido para los juegos RPG
            // Hay que añadir un usuario para que lo devuelva cuando hagamos login
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
                }
                // Hay que guardar los datos del usuario(data.results) en el localStorage y en el store
                // Hay que guardar el data.cart también el localStorage y en el store
                return data;
            },

            logout: () => {
                setStore({ token: null });
                localStorage.removeItem('token');
            },

            exampleFunction: () => { getActions().changeColor(0, "green"); },

            fetchTopGames: async () => {
                const url = 'https://api.rawg.io/api/games?key=bf752f88a1074c599e4be40330ae959e';
                const response = await fetch(url);
                const data = await response.json();
                setStore({ topGames: data.results });
            },

            fetchBestRatedGames: async () => {
                const url = 'https://api.rawg.io/api/games?key=bf752f88a1074c599e4be40330ae959e';
                const response = await fetch(url);
                const data = await response.json();
                setStore({ bestRatedGames: data.results });
            },

            fetchGames: async () => {
                const url = 'https://api.rawg.io/api/games?key=bf752f88a1074c599e4be40330ae959e';
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    setStore({ games: data.results });
                } else {
                    console.error('Error fetching games:', response.status, response.statusText);
                }
            },

            removeFromCart: (gameId) => {
                const store = getStore();
                const updatedCart = store.cart.filter(game => game.id !== gameId);
                setStore({ cart: updatedCart });
            },

            addFavorites: (gameTitle) => {
                const store = getStore();
                const favorites = [...store.favorites, gameTitle];
                setStore({ favorites });
            },

            setReviews: (reviews) => {
                setStore({ reviews: reviews });
            },

            getReview: (reviewId) => {
                const store = getStore();
                const review = store.reviews.find(r => r.id === parseInt(reviewId));
                setStore({ review: review });
            },

            addToCart: async ()  => {
                    const uri = host + '/api/login';
                    const options = { method: 'POST'}
                    const response = await fetch (uri, options)
        
            
                if (!response.ok) {
                    console.log("Error", response.status, response.statusText);
                }
                const data = await response.json();
                setStore({cart: data.cart})
                console.log(data);
            },

            getGameDetails: async (gameId) => {
                const url = `https://api.rawg.io/api/games/${gameId}?key=bf752f88a1074c599e4be40330ae959e`;
                const response = await fetch(url);
                if (!response.ok) {
                    console.log('Error al obtener detalles del juego', response.status, response.statusText);
                    return;
                }
                const data = await response.json();
                setStore({ selectedGame: data });
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
            getMessage: async () => {
                const response = await fetch(process.env.BACKEND_URL + "/api/hello")
                if (!response.ok) {
                    console.log("Error loading message from backend", response.status, response.statusText)
                    return
                }
                const data = await response.json()
                setStore({ message: data.message })
                return data;  // Don't forget to return something, that is how the async resolves
            },

            increase: () => { setStore({ counter: getStore().counter + 1 }) },
            decrease: () => { setStore({ counter: getStore().counter - 1 }) },
            addToCartd: (newGameToCart) => { setStore({ cart: [...getStore().cart, newGameToCart] }) },
            removeCart: (removeGame) => { setStore({ cart: getStore().cart.filter((item) => item != removeGame) }) }
        }
    };

}
export default getState;