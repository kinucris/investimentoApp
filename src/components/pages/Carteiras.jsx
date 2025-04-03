// Carteiras.jsx
import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";

const Carteiras = () => {
  const [carteiras, setCarteiras] = useState([]);
  const [novaCarteira, setNovaCarteira] = useState({ nome: "", cor: "#4f46e5" });
  const navigate = useNavigate();

  useEffect(() => {
    buscarCarteiras();
  }, []);

  const buscarCarteiras = async () => {
    const snapshot = await getDocs(collection(db, "carteiras"));
    const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setCarteiras(lista);
  };

  const adicionarCarteira = async () => {
    if (!novaCarteira.nome.trim()) return;
    if (carteiras.length >= 3) {
      alert("Limite de 3 carteiras atingido.");
      return;
    }

    await addDoc(collection(db, "carteiras"), novaCarteira);
    setNovaCarteira({ nome: "", cor: "#4f46e5" });
    buscarCarteiras();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Minhas Carteiras</h1>

      <div className="bg-gray-800 p-4 rounded-md space-y-4">
        <h2 className="text-lg font-semibold">Nova Carteira</h2>
        <div className="flex gap-3 flex-wrap">
          <Input
            placeholder="Nome da carteira"
            value={novaCarteira.nome}
            onChange={(e) => setNovaCarteira({ ...novaCarteira, nome: e.target.value })}
          />
          <Input
            type="color"
            value={novaCarteira.cor}
            onChange={(e) => setNovaCarteira({ ...novaCarteira, cor: e.target.value })}
            className="w-12 h-10 p-0"
          />
          <Button onClick={adicionarCarteira}>Adicionar</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {carteiras.map((c) => (
          <div
            key={c.id}
            className="cursor-pointer p-4 rounded-md shadow-md hover:shadow-lg transition space-y-2"
            style={{ backgroundColor: c.cor || "#4f46e5" }}
            onClick={() => navigate(`/carteiras/${c.id}`)}
          >
            <h3 className="text-lg font-semibold text-white">{c.nome}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carteiras;
