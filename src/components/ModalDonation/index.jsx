import React, { useEffect, useState } from "react";
import "./index.css";

import { FaDollarSign } from "react-icons/fa";
import { insertDonation } from "../../helper/insertDonation";
import { DataNow, DataSelect } from "../DataTime";

const ModalDonation = ({
  modalShow,
  setModalShow,
  mensalidade,
  tipo,
  donor_id,
}) => {
  const [comissao, setComissao] = useState("");
  const [valor, setValor] = useState("");
  const [data_receber, setData_receber] = useState("");
  const [formatedData, setFormatedData] = useState("")
  const [descricao, setDescricao] = useState("");
  const [impresso, setImpresso] = useState("");
  const [recebido, setRecebido] = useState("");
  const [mesref, setMesref] = useState("");
  const [operator, setOperator] = useState(null)

  const data_contato = DataNow();

  useEffect(() => {
    const operatorData = JSON.parse(localStorage.getItem("operatorData"))
    setOperator(operatorData.operator_code_id)
  }, [])

  useEffect(() => {
    if (mensalidade && comissao == "") {
      setValor(mensalidade);
    } else if (mensalidade && comissao != "") {
      setValor(Number(mensalidade) + Number(comissao));
    }
  }, [comissao]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = insertDonation(
      donor_id,
      operator,
      valor,
      comissao,
      data_contato,
      formatedData,
      impresso,
      recebido,
      descricao,
      mesref,
      setModalShow
    );
  };

  const handleDate = (e) => {
    var value = e.target.value;
    const now = DataNow("noformated")
    if (now > value){
      value = now;
    }
    setFormatedData(`${(DataSelect(value))}`);
    setData_receber(value);
    

    const monthYear = `${DataSelect(value, "month")}/${DataSelect(
      value,
      "year"
    )}`;

    setMesref(monthYear)
  };

  return (
    <main className="modal-container">
      <div className="modal">
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-title">
            <h2 className="modal-title-text">
              <FaDollarSign />
              Nova Doação
            </h2>
            <button
              onClick={() => setModalShow(!modalShow)}
              className="modal-close-button"
            >
              Fechar
            </button>
          </div>

          {/* Valor */}
          <div className="modal-form-imputs">
            <label className="label">Valor</label>
            <input
              type="text"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              readOnly={tipo === "Mensal" ? true : false}
            />
          </div>

          {/* Comissão */}
          {tipo === "Mensal" && (
            <div className="modal-form-imputs">
              <label className="label">Extra</label>
              <input
                type="text"
                placeholder="R$ 0,00"
                value={comissao}
                onChange={(e) => setComissao(e.target.value)}
              />
            </div>
          )}

          {/* Data */}
          <div className="modal-form-imputs">
            <label className="label">Data</label>
            <input
              type="date"
              placeholder="dd/mm/yyyy"
              value={data_receber}
              onChange={handleDate}
            />
          </div>

          {/* Mês Referente */}
          <div className="modal-form-imputs">
            <label className="label">Mês Referente</label>
            <input
              type="text"
              placeholder="Mês"
              value={mesref}
              onChange={(e) => setMesref(e.target.value)}
            />
          </div>

          {/* Descrição */}
          <div className="modal-form-imputs">
            <label
              style={{ borderRadius: "6px 0px 0px 6px" }}
              className="label"
            >
              Descrição
            </label>
            <textarea
              type="text"
              placeholder="Observação"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          <div className="checkboxs">
            <div>
              <label className="label_checkbox">
                {" "}
                Impresso:{" "}
                <input
                  className="checkbox"
                  type="checkbox"
                  checked={impresso}
                  onChange={(e) => setImpresso(e.target.checked)}
                />
              </label>
            </div>
            <div>
              <label className="label_checkbox">
                {" "}
                Recebido:{" "}
                <input
                  className="checkbox"
                  checked={recebido}
                  type="checkbox"
                  onChange={(e) => setRecebido(e.target.checked)}
                />
              </label>
            </div>
          </div>

          {/* Botão */}
          <button type="submit" className="modal-form-button">
            Doar
          </button>
        </form>
      </div>
    </main>
  );
};

export default ModalDonation;
