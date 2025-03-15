import React, { useEffect, useState } from "react";
import "./index.css";

import { FaDollarSign } from "react-icons/fa";
import { insertDonation } from "../../../helper/supabase";

const ModalDonation = ({ modalShow, setModalShow, mensalidade, tipo, idDonor }) => {
  const [comissao, setComissao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    if (mensalidade && comissao == "") {
      setValor(mensalidade);
    } else if (mensalidade && comissao != "") {
      setValor(Number(mensalidade) + Number(comissao));
    }
  }, [comissao]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    insertDonation(valor, data, descricao, idDonor);
  }

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
              value={data}
              onChange={(e) => setData(e.target.value)}
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

          {/* Botão */}
          <button type="submit" className="modal-form-button">Doar</button>
        </form>
      </div>
    </main>
  );
};

export default ModalDonation;
