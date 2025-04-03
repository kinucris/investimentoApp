// CarteiraDetalhe.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Trash2, Plus, Pencil } from "lucide-react";

const CarteiraDetalhe = () => {
  const { id } = useParams();
  const [ativos, setAtivos] = useState([]);
  const [carteiraNome, setCarteiraNome] = useState("");
  const [carteiraCor, setCarteiraCor] = useState("#4f46e5");
  const [ativo, setAtivo] = useState({ nome: "", quantidade: "" });
  const [editandoId, setEditandoId] = useState(null);
  const [editData, setEditData] = useState({ nome: "", quantidade: "" });
  const navigate = useNavigate();
  const [dadosAtivos, setDadosAtivos] = useState({});
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    buscarCarteira();
    buscarAtivos();
  }, [id]);

  useEffect(() => {
    if (ativos.length > 0) buscarDadosBrapi();
  }, [ativos]);

  const buscarCarteira = async () => {
    const snapshot = await getDocs(query(collection(db, "carteiras"), where("__name__", "==", id)));
    if (!snapshot.empty) {
      const dados = snapshot.docs[0].data();
      setCarteiraNome(dados.nome || "Carteira");
      setCarteiraCor(dados.cor || "#4f46e5");
    }
  };

  const buscarAtivos = async () => {
    const q = query(collection(db, "ativos"), where("carteiraId", "==", id));
    const snapshot = await getDocs(q);
    const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setAtivos(lista);
  };

  const buscarDadosBrapi = async () => {
    const codigos = ativos.map((a) => a.nome).join(",");
    try {
      const res = await fetch(`https://brapi.dev/api/quote/${codigos}?range=1d&interval=1d&token=3vHM46d3djUVYb5t9mDDxQ`);
      const json = await res.json();
      const dados = {};
      json.results.forEach((ativo) => {
        dados[ativo.symbol] = {
          preco: ativo.regularMarketPrice,
          dy: ativo.dividendYield,
          provento: ativo.lastDividends?.[0]?.value || 0,
          nome: ativo.longName,
        };
      });
      setDadosAtivos(dados);
    } catch (err) {
      console.error("Erro ao buscar dados BRAPI", err);
    }
  };

  const searchAssets = async (query) => {
    if (!query) return setSearchResults([]);
    try {
      const res = await fetch(`https://brapi.dev/api/quote/list?token=3vHM46d3djUVYb5t9mDDxQ&search=${query}`);
      const data = await res.json();
      setSearchResults((data.stocks || []).slice(0, 4));
    } catch (err) {
      console.error("Erro na busca de ativos", err);
    }
  };

  const adicionarAtivo = async () => {
    const nome = ativo.nome?.trim().toUpperCase();
    const quantidade = Number(ativo.quantidade);
  
    if (!nome || !quantidade || quantidade <= 0) return;
  
    // Verifica se o ativo já existe na carteira atual
    const q = query(
      collection(db, "ativos"),
      where("carteiraId", "==", id),
      where("nome", "==", nome)
    );
  
    const snapshot = await getDocs(q);
  
    if (!snapshot.empty) {
      // Update da quantidade no documento existente
      const docRef = doc(db, "ativos", snapshot.docs[0].id);
      await updateDoc(docRef, { quantidade });
    } else {
      // Novo registro
      await addDoc(collection(db, "ativos"), {
        nome,
        quantidade,
        carteiraId: id,
      });
    }
  
    setAtivo({ nome: "", quantidade: "" });
    setSearchResults([]);
  
    // Atualiza lista e dados da BRAPI manualmente
    await buscarAtivos();
    await buscarDadosBrapi();
  };

  const excluirAtivo = async (ativoId) => {
    const confirm = window.confirm("Excluir este ativo?");
    if (!confirm) return;
    await deleteDoc(doc(db, "ativos", ativoId));
    buscarAtivos();
  };

  const iniciarEdicao = (ativo) => {
    setEditandoId(ativo.id);
    setEditData({ nome: ativo.nome, quantidade: ativo.quantidade });
  };

  const salvarEdicao = async () => {
    const ref = doc(db, "ativos", editandoId);
    await updateDoc(ref, editData);
    setEditandoId(null);
    buscarAtivos();
  };

  const excluirCarteira = async () => {
    const confirm = window.confirm("Tem certeza que deseja excluir esta carteira?");
    if (!confirm) return;
  
    await deleteDoc(doc(db, "carteiras", id));
    navigate("/carteiras");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-md p-4 mb-4" style={{ backgroundColor: carteiraCor }}>
        <h1 className="text-2xl font-bold text-white">Carteira: {carteiraNome}</h1>
      </div>

      <div className="bg-gray-800 p-4 rounded-md space-y-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Plus size={18} /> Adicionar Ativo
        </h2>
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="w-full">
            <Input
              placeholder="Pesquisar ativo (ex: MXRF11)"
              value={ativo.nome}
              onChange={(e) => {
                setAtivo({ ...ativo, nome: e.target.value.toUpperCase() });
                searchAssets(e.target.value.toUpperCase());
              }}
            />
            {searchResults.length > 0 && (
              <div className="bg-gray-700 rounded mt-1 max-h-40 overflow-auto">
                {searchResults.map((s) => (
                  <div
                    key={s.stock}
                    className="px-3 py-2 hover:bg-gray-600 cursor-pointer text-white text-sm"
                    onClick={() => {
                      setAtivo({ ...ativo, nome: s.stock });
                      setSearchResults([]);
                    }}
                  >
                    {s.stock} - {s.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <Input
            placeholder="Quantidade"
            type="number"
            value={ativo.quantidade}
            onChange={(e) => setAtivo({ ...ativo, quantidade: e.target.value })}
            className="max-w-xs"
          />
          <Button onClick={adicionarAtivo}>Salvar</Button>
        </div>
      </div>

      
      <div className="bg-gray-800 p-4 rounded-md">
        <h2 className="text-white font-semibold mb-2">Opções</h2>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={() => alert("Em breve!")}>Compartilhar Carteira</Button>
          <Button onClick={() => setEditandoCarteira(true)} className="bg-yellow-500 hover:bg-yellow-600">Editar Carteira</Button>
          <Button onClick={excluirCarteira} className="bg-red-600 hover:bg-red-700">Excluir Carteira</Button>
        </div>
      </div>


      <div className="grid gap-4 md:grid-cols-2">
        {ativos.map((a) => {
          const dados = dadosAtivos[a.nome] || {};
          const valorInvestido = dados.preco && a.quantidade ? (dados.preco * a.quantidade).toFixed(2) : null;

          return (
            <div key={a.id} className="bg-gray-800 p-4 rounded-md space-y-2 shadow hover:shadow-lg">
              {editandoId === a.id ? (
                <>
                  <Input
                    value={editData.nome}
                    onChange={(e) => setEditData({ ...editData, nome: e.target.value })}
                  />
                  <Input
                    type="number"
                    value={editData.quantidade}
                    onChange={(e) => setEditData({ ...editData, quantidade: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <Button onClick={salvarEdicao}>Salvar</Button>
                    <Button onClick={() => setEditandoId(null)} className="bg-gray-600">Cancelar</Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-semibold">{a.nome}</p>
                      {dados.nome && <p className="text-sm text-gray-400">{dados.nome}</p>}
                      <p className="text-sm text-gray-300">Cotas: {a.quantidade}</p>
                      {dados.preco && (
                        <>
                          <p className="text-sm text-gray-300">Valor atual: R$ {dados.preco.toFixed(2)}</p>
                          <p className="text-sm text-gray-300">Valor investido: R$ {valorInvestido}</p>
                          <p className="text-sm text-gray-300">DY: {dados.dy ? `${dados.dy.toFixed(2)}%` : "N/D"}</p>
                          <p className="text-sm text-gray-300">Provento por cota: R$ {dados.provento?.toFixed(2)}</p>
                        </>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button onClick={() => iniciarEdicao(a)} className="bg-yellow-500 hover:bg-yellow-600">
                        <Pencil size={16} />
                      </Button>
                      <Button onClick={() => excluirAtivo(a.id)} className="bg-red-600 hover:bg-red-700">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CarteiraDetalhe;
