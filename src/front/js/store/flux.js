const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            token: null,
            admin: false,
            user: null,
            currentItem: {},
            isLogin: false,
            games: [],
            posts: [],
            pfps: [],
            comment: "",
        },
        actions: {
            login: async (email, password) => {
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
                getActions().fetchProfile();
                return data;
            },

            logout: () => {
                setStore({ token: null });
                localStorage.removeItem('token');
                getActions().setIsLogin(false);
            },

            fetchProfile: async () => {
                const token = getStore().token || localStorage.getItem('token') || {};
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
                getActions().fetchProfile();
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

            getPfps: async () => {
                const token = getStore().token;
                const host = `${process.env.BACKEND_URL}`;
                const uri = host + '/api/profile_pictures';
                const options = {
                    method: 'GET',
                    headers: {}
                };

                if (token) {
                    options.headers["Authorization"] = `Bearer ${token}`;
                }

                const response = await fetch(uri, options);

                if (!response.ok) {
                    console.log("Error", response.status, response.statusText);
                    return;
                }
                const data = await response.json();

                setStore({ pfps: data.results });
            },

            getGames: async () => {
                const token = getStore().token;
                const host = `${process.env.BACKEND_URL}`;
                const uri = host + '/api/games';
                const options = {
                    method: 'GET',
                    headers: {}
                };

                if (token) {
                    options.headers["Authorization"] = `Bearer ${token}`;
                }

                const response = await fetch(uri, options);

                if (!response.ok) {
                    console.log("Error", response.status, response.statusText);
                    return;
                }
                const data = await response.json();

                setStore({ games: data.results });
            },

            addGameLike: async (itemId) => {
                const store = getStore();
                const token = store.token;
                const data = {
                    user_id: store.user.id,
                    game_id: itemId
                };

                const uri = `${process.env.BACKEND_URL}/api/like`;
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(data),
                };

                const response = await fetch(uri, options);

                if (!response.ok) {
                    console.log("Error", response.status, response.statusText);
                    return;
                }

                const result = await response.json();

                console.log("Like añadido", result, getStore().games);

                await getActions().getGames();
                await getActions().fetchProfile();
            },

            deleteGameLike: async (itemId) => {
                const token = getStore().token;
                const uri = `${process.env.BACKEND_URL}/api/like`;

                const options = {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ game_id: itemId })
                };

                const response = await fetch(uri, options);

                if (!response.ok) {
                    console.log("Error", response.status, response.statusText);
                    return;
                }

                console.log("Like eliminado");
                await getActions().getGames();
                await getActions().fetchProfile();
            },

            likedGameId: () => {
                const user = getStore().user;

                if (user && user.likes && user.likes.liked_games) {
                    return user.likes.liked_games.map(game => game.id);
                }
                return [];
            },

            handleGameLike: async (gameId) => {
                if (getActions().likedGameId().includes(gameId)) {
                    await getActions().deleteGameLike(gameId);
                } else {
                    await getActions().addGameLike(gameId);
                }
                await getActions().getGames();
                await getStore().currentItem;
            },

            getPosts: async () => {
                const token = getStore().token || localStorage.getItem('token') || {}; 
                const host = `${process.env.BACKEND_URL}`;
                const uri = host + '/api/posts';
                const options = {
                    method: 'GET',
                    headers: {}
                };

                if (token) {
                    options.headers["Authorization"] = `Bearer ${token}`;
                } else {
                    console.log("No token available for getPosts");
                }

                try {
                    const response = await fetch(uri, options);

                    if (!response.ok) {
                        console.log("Error in getPosts:", response.status, response.statusText);
                        return;
                    }

                    const data = await response.json();
                    setStore({ posts: data.results });
                } catch (error) {
                    console.error("Fetch error in getPosts:", error);
                }
            },

            addPostLike: async (itemId) => {
                const token = getStore().token;
                const data = {
                    user_id: getStore().user.id,
                    post_id: itemId
                };

                const uri = `${process.env.BACKEND_URL}/api/like`;
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(data),
                };

                const response = await fetch(uri, options);

                if (!response.ok) {
                    console.log("Error", response.status, response.statusText);
                    return;
                }

                const result = await response.json();

                console.log("Like añadido", result, getStore().posts);

                await getActions().getPosts();
                await getActions().fetchProfile();
            },

            deletePostLike: async (itemId) => {
                const token = getStore().token;
                const uri = `${process.env.BACKEND_URL}/api/like`;

                const options = {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ post_id: itemId })
                };

                const response = await fetch(uri, options);

                if (!response.ok) {
                    console.log("Error", response.status, response.statusText);
                    return;
                }

                console.log("Like eliminado");
                await getActions().getPosts();
                await getActions().fetchProfile();
            },

            likedPostId: () => {
                const user = getStore().user;

                if (user && user.likes && user.likes.liked_posts) {
                    return user.likes.liked_posts.map(post => post.id);
                }
                return [];
            },

            handlePostLike: async (postId) => {
                if (getActions().likedPostId().includes(postId)) {
                    await getActions().deletePostLike(postId);
                } else {
                    await getActions().addPostLike(postId);
                }
                await getActions().getPosts();
            },
            
           

            deleteGameComment: async (commentId) => {
                const token = getStore().token;
                const uri = `${process.env.BACKEND_URL}/api/games/${getStore().currentItem.id}/comment?comment_id=${commentId}`;
                const options = {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                };

                const response = await fetch(uri, options);

                if (!response.ok) {
                    console.log("Error", response.status, response.statusText);
                    return;
                }

                // Actualiza la lista de comentarios después de eliminar uno.
                await getActions().fetchGameComments();
            },

            addGameComment: async () => {
                const { comment, token, currentItem } = getStore();
            
                if (!comment || comment.trim() === "") {
                    console.log("Comentario vacío, no se puede enviar.");
                    return;
                }
            
                const data = { body: comment };
            
                const uri = `${process.env.BACKEND_URL}/api/games/${currentItem.id}/comment`;
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(data),
                };
            
                try {
                    const response = await fetch(uri, options);
            
                    if (!response.ok) {
                        console.log(`Error al añadir comentario: ${response.status} - ${response.statusText}`);
                        return;
                    }
            
                    const result = await response.json();
                    console.log("Comentario añadido con éxito:", result);
            
                    // Actualiza directamente la lista de comentarios en store.currentItem
                    setStore({
                        currentItem: {
                            ...currentItem,
                            comments: [...(currentItem.comments || []), result] // Añade el nuevo comentario
                        }
                    });
            
                    getActions().setComment(""); // Limpia el campo del comentario
                } catch (error) {
                    console.log("Error en la solicitud al añadir comentario:", error);
                }
            },
            
            deleteGameComment: async (commentId) => {
                const { token, currentItem } = getStore();
                const uri = `${process.env.BACKEND_URL}/api/games/${currentItem.id}/comment?comment_id=${commentId}`;
                
                const options = {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                };

                try {
                    const response = await fetch(uri, options);

                    if (!response.ok) {
                        console.log(`Error al eliminar comentario: ${response.status} - ${response.statusText}`);
                        return;
                    }

                    console.log("Comentario eliminado con éxito");
                    await getActions().fetchGameComments(); // Actualiza la lista de comentarios
                } catch (error) {
                    console.log("Error en la solicitud al eliminar comentario:", error);
                }
            },

            fetchGameComments: async () => {
                const { currentItem, token } = getStore();
                const uri = `${process.env.BACKEND_URL}/api/games/${currentItem.id}/comments`;
            
                const options = {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
            
                try {
                    const response = await fetch(uri, options);
            
                    if (response.ok) {
                        const data = await response.json();
                        setStore({ 
                            currentItem: {
                                ...currentItem,
                                comments: data.results // Actualiza los comentarios correctamente
                            }
                        });
                        console.log("Comentarios obtenidos con éxito:", data.results);
                    } else {
                        console.log(`Error al obtener comentarios: ${response.status} - ${response.statusText}`);
                    }
                } catch (error) {
                    console.log("Error en la solicitud al obtener comentarios:", error);
                }
            },
            
            setComment: (comment) => {
                setStore({ comment });
            },

            handleGameComment: (event) => {
                const comment = event.target.value;
                getActions().setComment(comment);
            },

            sendGameComment: async (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault(); 
                    await getActions().addGameComment(); 
                    await getActions().fetchGameComments(); // Asegúrate de obtener los comentarios después de agregar uno
                }
            },

            deletePostComment: async (commentId) => {
                const token = getStore().token;
                const uri = `${process.env.BACKEND_URL}/api/posts/${getStore().currentItem.id}/comment?comment_id=${commentId}`;
                const options = {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                };
            
                const response = await fetch(uri, options);
            
                if (!response.ok) {
                    console.log("Error", response.status, response.statusText);
                    return;
                }
            
                // Actualiza la lista de comentarios después de eliminar uno.
                await getActions().fetchPostComments();
            },
            
            addPostComment: async () => {
                const { comment, token, currentItem } = getStore();
            
                if (!comment || comment.trim() === "") {
                    console.log("Comentario vacío, no se puede enviar.");
                    return;
                }
            
                const data = { body: comment };
            
                const uri = `${process.env.BACKEND_URL}/api/posts/${currentItem.id}/comment`;
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(data),
                };
            
                try {
                    const response = await fetch(uri, options);
            
                    if (!response.ok) {
                        console.log(`Error al añadir comentario: ${response.status} - ${response.statusText}`);
                        return;
                    }
            
                    const result = await response.json();
                    console.log("Comentario añadido con éxito:", result);
            
                    // Actualiza directamente la lista de comentarios en store.currentItem
                    setStore({
                        currentItem: {
                            ...currentItem,
                            comments: [...(currentItem.comments || []), result] // Añade el nuevo comentario
                        }
                    });
            
                    getActions().setComment(""); // Limpia el campo del comentario
                } catch (error) {
                    console.log("Error en la solicitud al añadir comentario:", error);
                }
            },
            
            deletePostComment: async (commentId) => {
                const { token, currentItem } = getStore();
                const uri = `${process.env.BACKEND_URL}/api/posts/${currentItem.id}/comment?comment_id=${commentId}`;
                
                const options = {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                };
            
                try {
                    const response = await fetch(uri, options);
            
                    if (!response.ok) {
                        console.log(`Error al eliminar comentario: ${response.status} - ${response.statusText}`);
                        return;
                    }
            
                    console.log("Comentario eliminado con éxito");
                    await getActions().fetchPostComments(); // Actualiza la lista de comentarios
                } catch (error) {
                    console.log("Error en la solicitud al eliminar comentario:", error);
                }
            },
            
            fetchPostComments: async () => {
                const { currentItem, token } = getStore();
                const uri = `${process.env.BACKEND_URL}/api/posts/${currentItem.id}/comments`;
            
                const options = {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
            
                try {
                    const response = await fetch(uri, options);
            
                    if (response.ok) {
                        const data = await response.json();
                        setStore({ 
                            currentItem: {
                                ...currentItem,
                                comments: data.results // Actualiza los comentarios correctamente
                            }
                        });
                        console.log("Comentarios obtenidos con éxito:", data.results);
                    } else {
                        console.log(`Error al obtener comentarios: ${response.status} - ${response.statusText}`);
                    }
                } catch (error) {
                    console.log("Error en la solicitud al obtener comentarios:", error);
                }
            },
            
            setComment: (comment) => {
                setStore({ comment });
            },
            
            handlePostComment: (event) => {
                const comment = event.target.value;
                getActions().setComment(comment);
            },
            
            sendPostComment: async (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault(); 
                    await getActions().addPostComment(); 
                    await getActions().fetchPostComments(); // Asegúrate de obtener los comentarios después de agregar uno
                }
            },
            
            
        }
    }
};

export default getState;



// deletePostComment: async (commentId) => {
            //     const { token, currentItem } = getStore();
            //     const uri = `${process.env.BACKEND_URL}/api/posts/${currentItem.id}/comment?comment_id=${commentId}`;
                
            //     const options = {
            //         method: "DELETE",
            //         headers: {
                //             "Authorization": `Bearer ${token}`,
                //             "Content-Type": "application/json"
                //         }
            //     };
                
            //     try {
                //         const response = await fetch(uri, options);

            //         if (!response.ok) {
            //             console.log(`Error al eliminar comentario: ${response.status} - ${response.statusText}`);
            //             return;
            //         }

            //         console.log("Comentario eliminado con éxito");
            //         await getActions().fetchPostComments(); 
            //     } catch (error) {
            //         console.log("Error en la solicitud al eliminar comentario:", error);
            //     }
            // deleteGameComment: async (commentId) => {
            //     const { token, currentItem } = getStore();
            //     const uri = `${process.env.BACKEND_URL}/api/games/${currentItem.id}/comment?comment_id=${commentId}`;
            
            //     const options = {
            //         method: "DELETE",
            //         headers: {
            //             "Authorization": `Bearer ${token}`,
            //             "Content-Type": "application/json"
            //         }
            //     };
            
            //     try {
            //         const response = await fetch(uri, options);
            
            //         if (!response.ok) {
            //             console.log(`Error al eliminar comentario: ${response.status} - ${response.statusText}`);
            //             return;
            //         }
            
            //         console.log("Comentario eliminado con éxito");
            //         await getActions().fetchGameComments(); 
            //     } catch (error) {
            //         console.log("Error en la solicitud al eliminar comentario:", error);
            //     }
            // },
            // },