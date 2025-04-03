// Dashboard.jsx

import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Avatar } from "../ui/Avatar";

const Dashboard = () => {
  const [investimentos, setInvestimentos] = useState([]);
  const [newInvestment, setNewInvestment] = useState({
    nome: "",
    valor: "",
    quantidade: "",
    rendimento: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    setUser(auth.currentUser);
    fetchInvestimentos();
  }, []);

  const fetchInvestimentos = async () => {
    const querySnapshot = await getDocs(collection(db, "investimentos"));
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setInvestimentos(data);
  };

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    window.location.href = "/login";
  };

  const saveInvestment = async () => {
    const confirmMessage = editingId ? "Deseja salvar as alterações?" : "Deseja adicionar este ativo?";
    if (!window.confirm(confirmMessage)) return;

    if (editingId) {
      const docRef = doc(db, "investimentos", editingId);
      await updateDoc(docRef, newInvestment);
    } else {
      await addDoc(collection(db, "investimentos"), newInvestment);
    }
    setNewInvestment({ nome: "", valor: "", quantidade: "", rendimento: "" });
    setEditingId(null);
    fetchInvestimentos();
  };

  const editInvestment = (inv) => {
    setNewInvestment({
      nome: inv.nome,
      valor: inv.valor,
      quantidade: inv.quantidade,
      rendimento: inv.rendimento,
    });
    setEditingId(inv.id);
  };

  const deleteInvestment = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este ativo?")) return;
    await deleteDoc(doc(db, "investimentos", id));
    fetchInvestimentos();
  };

  const searchAssets = async (query) => {
    if (query.length < 1) return setSearchResults([]);
    try {
      const res = await fetch(`https://brapi.dev/api/quote/list?search=${query}`);
      const data = await res.json();
      setSearchResults(data.stocks || []);
    } catch (error) {
      console.error("Erro na busca de ativos", error);
    }
  };

  return (
    <div className="p-6 space-y-4">
      {user && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar src={user.photoURL} />
            <span>Olá, {user.displayName}</span>
          </div>
          <Button onClick={handleLogout}>Sair</Button>
        </div>
      )}

      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold mb-2">
            {editingId ? "Editar Investimento" : "Adicionar Investimento"}
          </h2>
          <Input placeholder="Pesquisar ativo" onChange={(e) => searchAssets(e.target.value)} />
          {searchResults.length > 0 && (
            <div className="bg-gray-100 p-2 mt-2 rounded">
              {searchResults.map((asset) => (
                <p
                  key={asset.stock}
                  className="cursor-pointer hover:bg-gray-200 p-1 rounded"
                  onClick={() => setNewInvestment({ ...newInvestment, nome: asset.stock })}
                >
                  {asset.stock} - {asset.name}
                </p>
              ))}
            </div>
          )}
          <Input
            placeholder="Nome"
            value={newInvestment.nome}
            onChange={(e) => setNewInvestment({ ...newInvestment, nome: e.target.value })}
          />
          <Input
            placeholder="Valor"
            type="number"
            value={newInvestment.valor}
            onChange={(e) => setNewInvestment({ ...newInvestment, valor: e.target.value })}
          />
          <Input
            placeholder="Quantidade"
            type="number"
            value={newInvestment.quantidade}
            onChange={(e) => setNewInvestment({ ...newInvestment, quantidade: e.target.value })}
          />
          <Input
            placeholder="Dividendos/mês"
            type="number"
            value={newInvestment.rendimento}
            onChange={(e) => setNewInvestment({ ...newInvestment, rendimento: e.target.value })}
          />
          <Button onClick={saveInvestment} className="mt-2">
            {editingId ? "Salvar" : "Adicionar"}
          </Button>
        </CardContent>
      </Card>

      <h2 className="text-lg font-semibold">Meus Investimentos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {investimentos.map((inv) => (
          <Card
            key={inv.id}
            className={`bg-white ${editingId === inv.id ? "border-2 border-yellow-500" : ""}`}
          >
            <p>{inv.nome}: <strong>R${inv.valor}</strong></p>
            <p>Quantidade: {inv.quantidade}</p>
            <p>Dividendos: <strong>R${inv.rendimento}/mês</strong></p>
            <div className="flex gap-2 mt-2">
              <Button onClick={() => editInvestment(inv)} className="bg-yellow-500 hover:bg-yellow-600">
                Editar
              </Button>
              <Button onClick={() => deleteInvestment(inv.id)} className="bg-red-500 hover:bg-red-600">
                Excluir
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
