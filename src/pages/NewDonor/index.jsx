import React, { useEffect, useState } from "react";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { insertDonor } from "../../helper/supabase";

const index = () => {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [cpf, setCpf] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [telefone1, setTelefone1] = useState("");
  const [telefone2, setTelefone2] = useState();
  const [telefone3, setTelefone3] = useState();
  const [dia, setDia] = useState();
  const [mensalidade, setMensalidade] = useState();
  const [media, setMedia] = useState();
  const [observacao, setObservacao] = useState("");

  const navigate = useNavigate();

  const handleChange = (event) => {
    setTipo(event.target.value);
  };

  const OnClickNewDonor = async () => {
    try{
      insertDonor(
        nome,
        tipo,
        cpf,
        endereco,
        cidade,
        bairro,
        telefone1,
        telefone2,
        telefone3,
        dia,
        mensalidade,
        media,
        observacao
      );

      navigate("/donor/" + telefone1);
    } catch (error) { 
      window.alert("Erro ao criar doador: ", error);
    }
    
  };

  useEffect(() => {
    if (tipo === "Avulso") {
      setTipo("Avulso");
    } else if (tipo === "Mensal") {
      setTipo("Mensal");
    } else {
      setTipo("Lista");
    }
  }, [tipo]);

  return (
    <main className="containerDonor">
      {/* Cabeçalho com botões */}
      <header className="header">
        <h2>
          <FaMoneyCheckDollar /> Novo Doador
        </h2>
        <div className="btns">
          <button onClick={OnClickNewDonor} className="btn-add">
            Criar Doador
          </button>
        </div>
      </header>

      {/* Formulario com informações do doador */}
      <form className="formDonor">
        <div className="div-inputs">
          <label className="label">Nome</label>
          <input
            type="text"
            name="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div className="div-inputs">
          <label htmlFor="dropdown" className="label">
            Tipo
          </label>
          <select id="dropdown" onChange={handleChange} value={tipo}>
            <option value="Avulso">Avulso</option>
            <option value="Mensal">Mensal</option>
            <option value="Lista">Lista</option>
          </select>
        </div>

        <div className="div-inputs">
          <label className="label">CPF</label>
          <input
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />
        </div>

        <div className="div-inputs">
          <label className="label">Endereço</label>
          <input
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
          />
        </div>

        <div className="div-inputs">
          <label className="label">Cidade</label>
          <input
            type="text"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
          />
        </div>

        <div className="div-inputs">
          <label className="label">bairro</label>
          <input
            type="text"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
          />
        </div>

        <div className="div-inputs">
          <label className="label">Telefone 1</label>
          <input
            type="text"
            value={telefone1}
            onChange={(e) => setTelefone1(e.target.value)}
          />
        </div>

        <div className="div-inputs">
          <label className="label">Telefone 2</label>
          <input
            type="text"
            value={telefone2}
            onChange={(e) => setTelefone2(e.target.value)}
          />
        </div>

        <div className="div-inputs">
          <label className="label">Telefone 3</label>
          <input
            type="text"
            value={telefone3}
            onChange={(e) => setTelefone3(e.target.value)}
          />
        </div>

        <div className="div-inputs" style={{ width: 180 }}>
          <label className="label">dia</label>
          <input
            type="text"
            value={dia}
            onChange={(e) => setDia(e.target.value)}
            disabled={tipo === "Avulso" || tipo === "Lista" ? true : false}
          />
        </div>

        <div className="div-inputs" style={{ width: 180 }}>
          <label className="label" style={{ width: 100 }}>
            Mensalidade
          </label>
          <input
            type="text"
            value={mensalidade}
            onChange={(e) => setMensalidade(e.target.value)}
            disabled={tipo === "Avulso" || tipo === "Lista" ? true : false}
          />
        </div>

        <div className="div-inputs" style={{ width: 180 }}>
          <label className="label">Media</label>
          <input
            type="text"
            value={media}
            onChange={(e) => setMedia(e.target.value)}
            disabled={tipo === "Avulso" || tipo === "Lista" ? true : false}
          />
        </div>

        <div className="div-inputs" id="observation">
          <label className="label" style={{ width: "100px" }}>
            Observação
          </label>
          {/* <input className="inputObservation" type="text"/> */}
          <textarea
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
          />
        </div>
      </form>
    </main>
  );
};

export default index;
