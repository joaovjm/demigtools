import "./index.css";
import React, { useEffect } from "react";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { useState } from "react";
import TableDonor from "../../assets/components/TableDonor";
import { useNavigate, useParams } from "react-router";
import { deleteDonor, editDonor, searchDonor } from "../../helper/supabase";

const Donor = () => {
  const [nome, setNome] = useState(null);
  const [tipo, setTipo] = useState("");
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

  const [edit, setEdit] = useState(true);
  const [btnedit, setBtnedit] = useState("Editar");
  const [showbtn, setShowbtn] = useState(true);



  const { id } = useParams();
  const params = {};
  if (id) params.telefone1 = id;

  const navigate = useNavigate();

  useEffect(() => {
    searchDonor(id).then((data) => {
      setNome(data[0].nome);
      setCpf(data[0].cpf);
      setEndereco(data[0].endereco);
      setCidade(data[0].cidade);
      setBairro(data[0].bairro);
      setTelefone1(data[0].telefone_1);
      setTelefone2(data[0].telefone_2);
      setTelefone3(data[0].telefone_3);
      setDia(data[0].dia);
      setMensalidade(data[0].mensalidade);
      setMedia(data[0].media);
      setObservacao(data[0].observacao);

      if (data[0].tipo === "Avulso") {
        setTipo("Avulso");
      } else if (data[0].tipo === "Mensal") {
        setTipo("Mensal");
      } else if (data[0].tipo === "Lista") {
        setTipo("Lista");
      }
    });
  }, [tipo !== setTipo]);

  // Responsável por editar e salvar as informações do doador
  const EditDonor = async () => {
    if (btnedit === "Salvar") {
      try {
        editDonor(
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

        window.alert("Doador atualizado com sucesso!");
      } catch (error) {
        window.alert("Erro ao atualizar doador: ", error);
      }

      setEdit(true);
      setBtnedit("Editar");
      setShowbtn(true);
    } else {
      setEdit(!edit);
      setBtnedit("Salvar");
      setShowbtn(!showbtn);
    }
  };

  return (
    <main className="containerDonor">
      {/* Cabeçalho com botões */}
      <header className="header">
        <h2>
          <FaMoneyCheckDollar /> Doador
        </h2>
        <div className="btns">
          <button onClick={EditDonor} className="btn-edit">
            {btnedit}
          </button>
          {showbtn ? (
            <button type="submit" className="btn-add">
              Criar Movimento
            </button>
          ) : (
            null
          )}
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
            readOnly={edit}
          />
        </div>

        <div className="div-inputs">
          <label htmlFor="dropdown" className="label">
            Tipo
          </label>
          <select
            id="dropdown"
            onChange={(e) => setTipo(e.target.value)}
            value={tipo}
            disabled={edit}
            defaultValue={setTipo}
          >
            <option value="Avulso">Avulso</option>
            <option value="Mensal">Mensal</option>
            <option value="Lista">Lista</option>
          </select>
        </div>

        <div className="div-inputs">
          <label className="label">CPF</label>
          <input
            type="text"
            defaultValue={cpf}
            onChange={(e) => setCpf(e.target.value)}
            readOnly={edit}
          />
        </div>

        <div className="div-inputs">
          <label className="label">Endereço</label>
          <input
            type="text"
            defaultValue={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            readOnly={edit}
          />
        </div>

        <div className="div-inputs">
          <label className="label">Cidade</label>
          <input
            type="text"
            defaultValue={cidade}
            onChange={(e) => setCidade(e.target.value)}
            readOnly={edit}
          />
        </div>

        <div className="div-inputs">
          <label className="label">bairro</label>
          <input
            type="text"
            defaultValue={bairro}
            onChange={(e) => setBairro(e.target.value)}
            readOnly={edit}
          />
        </div>

        <div className="div-inputs">
          <label className="label">Telefone 1</label>
          <input
            type="text"
            defaultValue={telefone1}
            onChange={(e) => setTelefone1(e.target.value)}
            readOnly={edit}
          />
        </div>

        <div className="div-inputs">
          <label className="label">Telefone 2</label>
          <input
            type="text"
            defaultValue={telefone2}
            readOnly={edit}
            onChange={(e) => setTelefone2(e.target.value)}
          />
        </div>

        <div className="div-inputs">
          <label className="label">Telefone 3</label>
          <input
            type="text"
            defaultValue={telefone3}
            onChange={(e) => setTelefone3(e.target.value)}
            readOnly={edit}
          />
        </div>

        <div className="div-inputs" style={{ width: 180 }}>
          <label className="label">dia</label>
          <input
            type="text"
            defaultValue={dia}
            onChange={(e) => setDia(e.target.value)}
            disabled={tipo === "Mensal" ? false : true}
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
            readOnly={edit}
            disabled={tipo === "Mensal" ? false : true}
          />
        </div>

        <div className="div-inputs" style={{ width: 180 }}>
          <label className="label">Media</label>
          <input
            type="text"
            defaultValue={media}
            onChange={(e) => setMedia(e.target.value)}
            readOnly={edit}
            disabled={tipo === "Mensal" ? false : true}
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
            readOnly={edit}
          />
        </div>
      </form>
      {showbtn ? <TableDonor /> : null}
    </main>
  );
};

export default Donor;
