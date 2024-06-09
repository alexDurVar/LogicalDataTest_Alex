import React, { useState } from 'react';
import { variables } from './Variables';
import { useHistory } from 'react-router-dom';

function Login({ onLogin }) {
  const [name, setName] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleLogin = () => {
    // Enviar solicitud HTTP POST al endpoint de login
    fetch(variables.API_URL + 'Users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, login, password })
    })
    .then(response => {
      if (response.ok) {
        // Si la respuesta es exitosa, llamar a la función onLogin para establecer el estado de inicio de sesión
        onLogin();
        // Redirigir al usuario a la página principal
        history.push('/home');
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    })
    .catch(error => {
      console.error('Error de conexión:', error);
      setError('Error de conexión, por favor inténtalo de nuevo');
    });
  };

  return (
    <div className="login-container">
      <h2 className="mt-3">Login</h2>
      <div className="mb-3">
        <input type="text" className="form-control" placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div className="mb-3">
        <input type="text" className="form-control" placeholder="Nombre de usuario" value={login} onChange={e => setLogin(e.target.value)} />
      </div>
      <div className="mb-3">
        <input type="password" className="form-control" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <button className="btn btn-primary" onClick={handleLogin}>Iniciar sesión</button>
      {error && <p className="error mt-2">{error}</p>}

      
    </div>
  );
}

export default Login;
