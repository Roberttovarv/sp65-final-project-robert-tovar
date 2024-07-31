const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            token: null,
            admin: null,
            user: null,
            currentItem: {},
            isLogin: false,
            filterItem: [],
            currentFilter: [],
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

            fetchProfile: async () => {
                const token = getStore().token || localStorage.getItem('token');
                if (!token) {
                    console.log("No token found in localStorage");
                    return;
                }

                const response = await fetch(`${process.env.BACKEND_URL}/api/profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data.results);
                    setStore({ user: data.results }); // Assuming the profile data should be stored in user
                } else {
                    console.log("Failed to fetch profile");
                }
            },

            setCurrentItem: (item) => {
                setStore({ currentItem: item });
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
            setFilterItem: (item) => {
                setStore({ filterItem: item });
            },

            setCurrentFilter: (results) => {
                setStore({ currentFilter: results });
            },

            filterSet: (item) => {
                const store = getStore();
                if (!Array.isArray(store.filterItem)) {
                    console.error("filterItem is not an array");
                    return;
                }
                const results = store.filterItem.filter((element) => {
                    return (
                        element.name.toString().toLowerCase().includes(item.toLowerCase()) ||
                        element.title.toString().toLowerCase().includes(item.toLowerCase()) ||
                        element.game_name.toString().toLowerCase().includes(item.toLowerCase()) ||
                        element.username.toString().toLowerCase().includes(item.toLowerCase())
                    );
                });
                getActions().setCurrentFilter(results);
            },

            handleChange: (event) => {
                getActions().filterSet(event.target.value);
                getActions().setFilterItem(event.target.value);
            },
        },
    };
};

export default getState;
