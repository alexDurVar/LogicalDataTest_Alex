import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import {Home} from './Home';
import {Articles} from './Articles';
import {Invoices} from './Invoices';
import { BrowserRouter, Route, Switch, NavLink, Redirect } from 'react-router-dom';
import Login from './Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Verificar si la página se está recargando
    if (window.performance && window.performance.navigation.type === window.performance.navigation.TYPE_RELOAD) {
      // Redirigir al usuario a la página de inicio de sesión si la página se está recargando
      setIsLoggedIn(false);
    }
  }, []);

  // Función para manejar el inicio de sesión exitoso
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <BrowserRouter>
      <div className="App container">
        <h3 className="d-flex justify-content-center m-3">
          React JS Frontend
        </h3>
        <nav className="navbar navbar-expand-sm bg-light navbar-dark">
          <ul className="navbar-nav">
            {!isLoggedIn ? (
              <li className="nav-item m-1">
                <NavLink className="btn btn-light btn-outline-primary" to="/login">
                  Login
                </NavLink>
              </li>
            ) : (
              <>
                <li className="nav-item m-1">
                  <NavLink className="btn btn-light btn-outline-primary" to="/home">
                    Home
                  </NavLink>
                </li>
                <li className="nav-item m-1">
                  <NavLink className="btn btn-light btn-outline-primary" to="/articles">
                    Articles
                  </NavLink>
                </li>
                <li className="nav-item m-1">
                  <NavLink className="btn btn-light btn-outline-primary" to="/invoices">
                    Facturar
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
        <Switch>
          <Route path='/home' component={Home}/>
          <Route path='/articles' component={Articles}/>
          <Route path='/invoices' component={Invoices}/>
          <Route path='/login'>
            <Login onLogin={handleLogin} />
          </Route>
        </Switch>
        {!isLoggedIn && <Redirect to="/login" />}
      </div>
    </BrowserRouter>
  );
}

export default App;