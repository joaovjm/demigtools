import React, { useEffect, useState } from "react";
import "./index.css"
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { insertDonor, insertDonor_cpf, insertDonor_mensal, insertDonor_observation, insertDonor_reference, insertDonor_tel_2, insertDonor_tel_3 } from "../../helper/insertDonor";

const index = () => {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [cpf, setCpf] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [telefone1, setTelefone1] = useState("");
  const [telefone2, setTelefone2] = useState("");
  const [telefone3, setTelefone3] = useState("");
  const [dia, setDia] = useState(null);
  const [mensalidade, setMensalidade] = useState(null);
  const [media, setMedia] = useState(null);
  const [observacao, setObservacao] = useState("");
  const [referencia, setReferencia] = useState("");

  const navigate = useNavigate();

  const handleChange = (event) => {
    setTipo(event.target.value);
  };

  const OnClickNewDonor = async () => {
    if ((dia !== null && mensalidade !== null && tipo === "Mensal") || tipo === "Avulso" || tipo === "Lista"){
      try{
        const data = await insertDonor(
          nome,
          tipo,
          endereco,
          cidade,
          bairro,
          telefone1,
          dia,
          mensalidade,
        );
        if (cpf !== "") {
          insertDonor_cpf(data[0].donor_id, cpf)
        }
        if (telefone2 !== ""){
          insertDonor_tel_2(data[0].donor_id, telefone2)
        }
        if (telefone3 !== "") {
          insertDonor_tel_3(data[0].donor_id, telefone3)
        }
        if (tipo === "Mensal") {
          insertDonor_mensal(data[0].donor_id, dia, mensalidade)
        }
        if (observacao !== ""){
          insertDonor_observation(data[0].donor_id, observacao)
        }
        if (referencia !== ""){
          insertDonor_reference(data[0].donor_id, referencia)
        }
        navigate("/donor/" + data[0].donor_id);
      } catch (error) { 
        window.alert("Erro ao criar doador: ", error);
      }
    } else {
      window.alert ("Os campos DIA e MENSALIDADE precisam ser preenchidos corretamente!")
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
      <header className="header-new-donor">
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
          <textarea
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
          />
        </div>

        <div className="div-inputs" id="referencia">
          <label className="label" style={{ width: "100px" }}>
            Referência
          </label>
          <textarea
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
          />
        </div>
      </form>
    </main>
  );
};

export default index;
