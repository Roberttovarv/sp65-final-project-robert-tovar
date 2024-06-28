const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,

			demo: [{title: "FIRST", background: "white", initial: "white"}],
  			counter: 2,
			token: null,
			reviews: [], 
			review: null,
            games: [],
			cart: [] 
		},
		actions: {
			login: async (email, password) => {
				console.log("Intentando iniciar sesión con email:", email);
				console.log("Contraseña:", password);
				const url = process.env.BACKEND_URL + '/api/login'

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

				return data;
			},

			logout: () => {
				setStore({ token: null }); // Limpio el token del estado global
				localStorage.removeItem('token'); // Remover el token del almacenamiento local si lo estoy usando
			},

			exampleFunction: () => { getActions().changeColor(0, "green"); },  // Use getActions to call a function within a fuction

			// fetchTopGames: async () => {
            //     const url = process.env.BACKEND_URL + '/api/top-games'; // aqui tengo que meter la url de la API para los juegos top
            //     const response = await fetch(url);
            //     const data = await response.json();
            //     setStore({ topGames: data });
            // },
            // fetchBestRatedGames: async () => {
            //     const url = process.env.BACKEND_URL + '/api/best-rated-games'; // aqui tengo que meter ejemplo para los juegos mejor valorados
            //     const response = await fetch(url);
            //     const data = await response.json();
            //     setStore({ bestRatedGames: data });
            // },
            // addFavorites: (gameTitle) => {
            //     const store = getStore();
            //     const favorites = [...store.favorites, gameTitle];
            //     setStore({ favorites });
            // },
			setReviews: (reviews) => {
                setStore({ reviews: reviews });
            },
            getReview: (reviewId) => {
                const store = getStore();
                const review = store.reviews.find(r => r.id === parseInt(reviewId));
                setStore({ review: review });
            },
            addToCart: (gameId) => {
                const store = getStore();
                const game = store.reviews.find(r => r.gameId === gameId);
                if (game) {
                    const newCart = [...store.cart, game];
                    setStore({ cart: newCart });
                }
			},
			getGames: async () => {
                const url = process.env.BACKEND_URL + '/api/games'; // Cambiar la URL de la API para obtener los juegos
                const response = await fetch(url);
				if (!response.ok) {
					console.log('Error al obtener categorias de juegos', response.status, response.statusText);
					return
				}
                const data = await response.json();
                setStore({ games: data });
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

			increase: () => {setStore({counter: getStore().counter + 1})

			},
			decrease : () => {

			},
		}
	};
};


export default getState;
