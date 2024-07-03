import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import "./styles/home.css"
export const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const dataToSend = { email, password };
    const url = `${process.env.BACKEND_URL}/api/signup`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToSend)
    };
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json();
      setError(errorData.error);
      return;
    }
    const data = await response.json();
    console.log(data);
    localStorage.setItem('token', data.access_token);
    navigate('/');
    console.log(dataToSend);
  };
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-3 display-5">Registro</h2>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-group mt-3 h6">
                  <label htmlFor="email" className="mb-1">Correo electrónico:</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                </div>
                <div className="form-group mt-3 h6">
                  <label htmlFor="password" className="mb-1">Contraseña:</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-primary mt-5">Registrarse</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};