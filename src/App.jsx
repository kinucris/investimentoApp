import React, { useEffect, useState, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import Login from "./components/pages/Login";
import Dashboard from "./components/pages/Dashboard";
import Carteiras from "./components/pages/Carteiras";
import CarteiraDetalhe from "./components/pages/CarteiraDetalhe";
import NotFound from "./components/pages/NotFound";
import AppLayout from "./components/layout/AppLayout";

const AuthContext = createContext();

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-white">Carregando...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/carteiras"
            element={
              <PrivateRoute>
                <AppLayout>
                  <Carteiras />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/carteiras/:id"
            element={
              <PrivateRoute>
                <AppLayout>
                  <CarteiraDetalhe />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
