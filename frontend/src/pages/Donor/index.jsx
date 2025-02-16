import "./index.css";
import React, { useEffect } from "react";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { useState } from "react";
import TableDonor from "../../assets/components/TableDonor";
import axios from "axios";
import { useParams } from "react-router";

const Donor = () => {
  const [nome, setNome] = useState(null);
  const [tipo, setTipo] = useState(null);
  const [cpf, setCpf] = useState(null);
  const [endereco, setEndereco] = useState(null);
  const [cidade, setCidade] = useState(null);
  const [bairro, setBairro] = useState(null);
  const [telefone1, setTelefone1] = useState(null);
  const [telefone2, setTelefone2] = useState(null);
  const [telefone3, setTelefone3] = useState(null);
  const [dia, setDia] = useState(null);
  const [mensalidade, setMensalidade] = useState(null);
  const [media, setMedia] = useState(null);
  const [observacao, setObservacao] = useState(null);

  const handleChange = (event) => {
    setTipo(event.target.value);
  };

  const { id } = useParams();
  const params = {};
  if (id) params.telefone1 = id;

  useEffect(() => {
    
    axios
      .get("http://localhost:3001/donor", { params })
      .then((response) => {
        setNome(response.data[0].nome);
        setCpf(response.data[0].cpf);
        setEndereco(response.data[0].endereco);
        setCidade(response.data[0].cidade);
        setBairro(response.data[0].bairro);
        setTelefone1(response.data[0].telefone1);
        setTelefone2(response.data[0].telefone2);
        setTelefone3(response.data[0].telefone3);
        setDia(response.data[0].dia);
        setMensalidade(response.data[0].mensalidade);
        setMedia(response.data[0].media);
        setObservacao(response.data[0].observacao);

        if(response.data[0].tipo === "Avulso") {
          setTipo("Avulso");
        }else if(response.data[0].tipo === "Mensal") {
          setTipo("Mensal");
        }else {
          setTipo("Lista");
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar doador: ", error);
      });
    
  }, []);

  return (
    <main className="containerDonor">
      {/* Cabeçalho com botões */}
      <header className="header">
        <h2>
          <FaMoneyCheckDollar /> Doador
        </h2>
        <div className="btns">
          <button type="submit" className="btn-edit">
            Editar
          </button>
          <button type="submit" className="btn-add">
            Criar Movimento
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
            defaultValue={nome}
            onChange={(e) => setNome(e.target.value)}
            readOnly={true}
          />
        </div>

        <div className="div-inputs">
          <label htmlFor="dropdown" className="label">
            Tipo
          </label>
          <select
            id="dropdown"
            onChange={handleChange}
            defaultValue={tipo}
            readOnly={true}
            disabled={true}
          >
            <option value="Avulso" >Avulso</option>
            <option value="Mensal" >Mensal</option>
            <option value="Lista" >Lista</option>
          </select>
        </div>

        <div className="div-inputs">
          <label className="label">CPF</label>
          <input
            type="text"
            defaultValue={cpf}
            onChange={(e) => setCpf(e.target.value)}
            readOnly={true}
          />
        </div>

        <div className="div-inputs">
          <label className="label">Endereço</label>
          <input
            type="text"
            defaultValue={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            readOnly={true}
          />
        </div>

        <div className="div-inputs">
          <label className="label">Cidade</label>
          <input
            type="text"
            defaultValue={cidade}
            onChange={(e) => setCidade(e.target.value)}
            readOnly={true}
          />
        </div>

        <div className="div-inputs">
          <label className="label">bairro</label>
          <input
            type="text"
            defaultValue={bairro}
            onChange={(e) => setBairro(e.target.value)}
            readOnly={true}
          />
        </div>

        <div className="div-inputs">
          <label className="label">Telefone 1</label>
          <input
            type="text"
            defaultValue={telefone1}
            onChange={(e) => setTelefone1(e.target.value)}
            readOnly={true}
          />
        </div>

        <div className="div-inputs">
          <label className="label">Telefone 2</label>
          <input
            type="text"
            defaultValue={telefone2}
            readOnly={true}
            onChange={(e) => setTelefone2(e.target.value)}
          />
        </div>

        <div className="div-inputs">
          <label className="label">Telefone 3</label>
          <input
            type="text"
            defaultValue={telefone3}
            onChange={(e) => setTelefone3(e.target.value)}
            readOnly={true}
          />
        </div>

        <div className="div-inputs" style={{ width: 180 }}>
          <label className="label">dia</label>
          <input
            type="text"
            defaultValue={dia}
            onChange={(e) => setDia(e.target.value)}
            disabled={tipo === "Avulso" ? false : true}
          />
        </div>

        <div className="div-inputs" style={{ width: 180 }}>
          <label className="label" style={{ width: 100 }}>
            Mensalidade
          </label>
          <input
            type="text"
            defaultValue={mensalidade}
            onChange={(e) => setMensalidade(e.target.value)}
            readOnly={true}
            disabled={tipo === "Avulso" ? false : true}
          />
        </div>

        <div className="div-inputs" style={{ width: 180 }}>
          <label className="label">Media</label>
          <input
            type="text"
            defaultValue={media}
            onChange={(e) => setMedia(e.target.value)}
            readOnly={true}
            disabled={tipo === "Avulso" ? false : true}
          />
        </div>

        <div className="div-inputs" id="observation">
          <label className="label" style={{ width: "100px" }}>
            Observação
          </label>
          {/* <input className="inputObservation" type="text"/> */}
          <textarea
            defaultValue={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            readOnly={true}
          />
        </div>
      </form>
      <TableDonor />
    </main>
  );
};

export default Donor;
