import "./App.css";

import { Routes, Route } from "react-router-dom";

import Login from "./routes/Login";
import Register from "./routes/Register";

import Navbar from "./components/Navbar";
import UserProfile from "./routes/UserProfile";
import PrivateRoute from "./components/PrivateRoute";
import CreatePost from "./routes/CreatePost";
import Home from "./routes/Home";
import Search from "./routes/Search";
import Settings from "./routes/Settings";

const App = () => {
  return (
    <>
    <Navbar/>
    
    <Routes>

      <Route element={<Login />} path="/login" />
      <Route element={<Register />} path="/register" />
      <Route
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
        path="/"
      />
      <Route
        element={
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        }
        path="/:username"
      />

      <Route
        element={
          <PrivateRoute>
            <CreatePost />
          </PrivateRoute>
        }
        path="/create/post"
      />

      <Route
        element={
          <PrivateRoute>
            <Search />
          </PrivateRoute>
        }
        path="/search"
      />
      <Route
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
        path="/settings"
      />
    </Routes>
    </>
  );
};

export default App;
