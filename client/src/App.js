import React, { useState, createContext, useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./components/navbar";
import WatchList from "./components/watchlist";
import Search from "./components/search";
import Profile from "./components/profile";
import Home from "./components/home";
import Login from "./components/login";
import Register from "./components/register";
import NoMatch from "./components/nomatch";
import "./App.css";

export const AuthContext = createContext();
export const UserContext = createContext();

const getToken = () => {
  return JSON.parse(localStorage.getItem("token")) || null;
}

function App () {
  const [token, setToken] = useState(getToken);
  const [user, setUser] = useState({
    id: "",
    username: "",
  });

  useEffect(() => {
    if (token !== null) {
      // Get user from token
      const { id, username } = JSON.parse(atob(token.split('.')[1]));
      const userDto = { id, username };
      setUser({ id, username });
    }
  }, [token]);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e, form) => {
    try {
      e.preventDefault();

      const user = { ...form };
  
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user)
      });
  
      if (!res.ok) return alert(`${res.status} ${res.statusText}`);
  
      const data = await res.json();
      const jwt = data.token;
  
      localStorage.setItem("token", JSON.stringify(jwt));
      setToken(jwt);
  
      const path = location.state?.from?.pathname || '/';
      navigate(path);
    } catch (err) {
      alert(err);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser({
      id: "",
      username: "",
    });
    setToken(null);
  }

  const deleteUser = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/delete`, {
        method: "DELETE",
        headers: {
          "x-access-token": token,
        },
      });

      if (!res.ok) return alert(res.status);
  
      localStorage.removeItem("token");
      setUser({
        id: "",
        username: "",
      });
      setToken(null);
      navigate("/");
    } catch (err) {
      alert(err)
    }
  }

  return (
    <>
      <AuthContext.Provider value={token}>
        <UserContext.Provider value={user}>
          <Navbar onLogout={handleLogout}/>
          <Routes>
            <Route exact path="/" element={token ? <WatchList />
            :  <Home onLogin={handleLogin}/>}/>
            <Route path="/login" element={<Login onLogin=  {handleLogin}/>}/>
            <Route path="/register" element={<Register />}/>
            <Route path="/search" element={<Search />}/>
            <Route path="/profile" element={<Profile handleLogout={handleLogout} deleteUser={deleteUser}/>}/>
            <Route path="*" element={<NoMatch />} />
          </Routes>
        </UserContext.Provider>
      </AuthContext.Provider>
    </>
  );
};

export default App;