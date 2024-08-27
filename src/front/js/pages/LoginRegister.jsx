import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/loginregister.css";
import { Arrow } from "./../component/Arrow.jsx"

export const LoginRegister = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [success, setSuccess] = useState(null); 

  useEffect(() => {
    if (store.token) {
      navigate('/');
    }
  }, [store, navigate]);

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleUsername = (event) => {
    setUsername(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    if (!email || !password) {
      setError("Email y contraseña son requeridos");
      setLoading(false);
      return;
    }

    const data = await actions.login(email, password);
    setLoading(false);
    if (data) {
      navigate(-1);
    } else {
      setError("Credenciales incorrectas");
    }
  };

  const handleSubmitSignup = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    if (!email || !password || !username) {
      setError("Todos los campos son requeridos");
      setLoading(false);
      return;
    }

    const dataToSend = { email, password, username };
    const url = `${process.env.BACKEND_URL}/api/signup`;

    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend),
      };

      const response = await fetch(url, options);

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          setError(errorData.error || "Error en los datos enviados");
        } else if (response.status === 500) {
          setError("Error del servidor. Inténtelo más tarde.");
        } else {
          setError("Algo salió mal. Intente nuevamente.");
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      setSuccess("Registro exitoso. Redirigiendo...");

      setLoading(false);
      navigate('/profile');

    } catch (error) {
      setError("No se pudo conectar con el servidor. Por favor, verifique su conexión o intente más tarde.");
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" >
      <div className="col-8 col-md-6">
        <div className="d-flex justify-content-start align-items-start">
          <Arrow />
        </div>
        <div className="wrapper">
          <div className="card-switch">
            <label className="switch">
              <input type="checkbox" className="toggle" />
              <span className="slider"></span>
              <span className="card-side"></span>
              <div className="flip-card__inner">
                <div className="flip-card__front">
                  <div className="title">Log in</div>
                  <form className="flip-card__form" action="">
                    <input className="flip-card__input" name="email" placeholder="Email" type="email" value={email} onChange={handleEmail} />
                    <input className="flip-card__input" name="password" placeholder="Password" type="password" value={password} onChange={handlePassword} />
                    <button className="flip-card__btn" onClick={handleLogin} disabled={loading}>
                      {loading ? "Cargando..." : "Ingresar"}
                    </button>
                  </form>
                </div>
                <div className="flip-card__back">
                  <div className="title">Registrarse</div>
                  <form className="flip-card__form" action="">
                    <input className="flip-card__input" placeholder="Username" type="name" value={username} onChange={handleUsername} />
                    <input className="flip-card__input" name="email" placeholder="Email" type="email" value={email} onChange={handleEmail} />
                    <input className="flip-card__input" name="password" placeholder="Password" type="password" value={password} onChange={handlePassword} />
                    <button className="flip-card__btn" onClick={handleSubmitSignup} disabled={loading}>
                      {loading ? "Cargando..." : "Enviar"}
                    </button>
                  </form>
                </div>
              </div>
            </label>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};
