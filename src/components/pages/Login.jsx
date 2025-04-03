// Login.jsx
import React from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Button } from "../ui/Button";

const Login = ({ onLogin }) => {
  const handleLogin = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      onLogin(result.user);
    } catch (error) {
      console.error("Erro no login:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-2xl font-bold mb-4">Faça login para acessar</h1>
      <Button onClick={handleLogin}>Login com Google</Button>
    </div>
  );
};

export default Login;
