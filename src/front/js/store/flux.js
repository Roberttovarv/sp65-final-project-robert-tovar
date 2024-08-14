const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            token: null,
            admin: false,
            user: null,
            currentItem: {},
            isLogin: false,
            likes: [],
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
                getActions().fetchProfile()
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
                    setStore({ user: data.results }); 
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
                setStore({ user });
            },

            setCurrentUser: (user) => {
                setStore({ user });
            },
            getLikes: async () => {
                const host = `${process.env.BACKEND_URL}`

                const uri = host + 'api/likes';
                const options = {method: 'GET'}

                const response = await fetch(uri, options)

                if (!response.ok) {
                    console.log("Error", response.status, response.statusText);
                    return;                                      
                }

                const data = await response.json();
                setStore({ likes: data.results})
            },
        },
    };
};
export default getState;