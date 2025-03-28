import "./index.css";
import React, { useState, useEffect } from "react";

import { FaMoneyCheckDollar } from "react-icons/fa6";
import { IoMdArrowRoundBack } from "react-icons/io";

import TableDonor from "../../components/TableDonor";
import { useParams } from "react-router";
import { editDonor } from "../../helper/editDonor";
import { getInfoDonor } from "../../helper/getDonor";
import ModalDonation from "../../components/ModalDonation";
import Loader from "../../components/Loader";
import { BsDatabaseAdd } from "react-icons/bs";

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
  const [idDonor, setIdDonor] = useState(null);
  const [edit, setEdit] = useState(true);
  const [btnedit, setBtnedit] = useState("Editar");
  const [showbtn, setShowbtn] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [referencia, setReferencia] = useState("")

  const { id } = useParams();
  const params = {};
  if (id) params.id = id;
  useEffect(() => {
    getInfoDonor(id).then((data) => {
      setIdDonor(params.id);
      setNome(data[0].donor_name);
      setEndereco(data[0].donor_address);
      setCidade(data[0].donor_city);
      setBairro(data[0].donor_neighborhood);
      setTelefone1(data[0].donor_tel_1);

      

      try{
        setCpf(data[0].donor_cpf.donor_cpf);
      } catch {
        setCpf("")
      }

      try{
        setTelefone2(data[0].donor_tel_2.donor_tel_2);
      } catch {
        setTelefone2("")
      }

      try{
        setTelefone3(data[0].donor_tel_3.donor_tel_3);
      } catch {
        setTelefone3("")
      }

      try{
        setDia(data[0].donor_mensal.donor_mensal_day);
      } catch {
        setDia(null)
      }

      try{
        setMensalidade(data[0].donor_mensal.donor_mensal_monthly_fee)
      } catch {
        setMensalidade(null)
      }

      try{
        setObservacao(data[0].donor_observation.donor_observation);
      } catch {
        setObservacao("")
      }

      try{
        setReferencia(data[0].donor_reference.donor_reference)
      }catch {
        setReferencia("")
      }
      
      
      
      
      //setDia(data[0].dia);
      //setMensalidade(data[0].valor);
      //setMedia(data[0].media);
      

      if (data[0].donor_type === "Avulso") {
        setTipo("Avulso");
      } else if (data[0].donor_type === "Mensal") {
        setTipo("Mensal");
      } else if (data[0].donor_type === "Lista") {
        setTipo("Lista");
      }
    });

    
  }, [tipo !== setTipo]);

  // Responsável por editar e salvar as informações do doador
  const EditDonor = async () => {
    setBtnedit(<Loader />);
    if (btnedit === "Salvar") {
      if (tipo === "Mensal") {
        if(dia !== null && mensalidade !== null) {
          const data = await editDonor(
            id,
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
            observacao,
            referencia
          );
          if (data) {
            setEdit(true);
            setBtnedit("Editar");
            setShowbtn(true);
          } else {
            setBtnedit("Salvar");
          }
        } else {
          window.alert("Os campos DIA e MENSALIDADE precisam ser preenchidos corretamente!")
          setBtnedit("Salvar")
        }
        
        
        
      } else {
        const data = await editDonor(
          id,
          nome,
          tipo,
          cpf,
          endereco,
          cidade,
          bairro,
          telefone1,
          telefone2,
          telefone3,
          observacao,
          referencia
        );

        if (data) {
          setEdit(true);
          setBtnedit("Editar");
          setShowbtn(true);
        } else {
          setBtnedit("Salvar");
        }
      }
      

      
    } else {
      setEdit(!edit);
      setBtnedit("Salvar");
      setShowbtn(!showbtn);
      
    }
  };

  const handleBack = () => {
    window.history.back();
  };
  //console.log(modalShow)
  return (
    <main className="containerDonor">
      {/* Cabeçalho com botões */}
      <header className="header">
        <h2>
          <FaMoneyCheckDollar /> Doador
        </h2>
        <button onClick={handleBack} className="btn-back">
          <IoMdArrowRoundBack /> Voltar
        </button>
        <div className="btns">
          <button onClick={EditDonor} className="btn-edit">
            {btnedit}
          </button>
          {showbtn ? (
            <button
              onClick={() => setModalShow(true)}
              type="submit"
              className="btn-add"
            >
              Criar Movimento
            </button>
          ) : null}
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
            readOnly={edit}
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

        <div className="div-inputs" id="referencia">
          <label className="label" style={{ width: "100px" }}>
            Referência
          </label>
          {/* <input className="inputObservation" type="text"/> */}
          <textarea
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
            readOnly={edit}
          />
        </div>
      </form>
      {showbtn ? <TableDonor idDonor={idDonor} modalShow={modalShow}/> : null}

      {modalShow && (
        <ModalDonation
          modalShow={modalShow}
          setModalShow={setModalShow}
          mensalidade={mensalidade}
          tipo={tipo}
          donor_id={idDonor}
        />
      )}
    </main>
  );
};

export default Donor;
