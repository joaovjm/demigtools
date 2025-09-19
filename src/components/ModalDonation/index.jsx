import React, { useContext, useEffect, useState } from "react";
import "./index.css";

import { FaDollarSign } from "react-icons/fa";
import { insertDonation } from "../../helper/insertDonation";
import { DataNow, DataSelect } from "../DataTime";
import { toast } from "react-toastify";
import { getCampains } from "../../helper/getCampains";
import { UserContext } from "../../context/UserContext";
import { getOperators } from "../../helper/getOperators";

const ModalDonation = ({
  modalShow,
  setModalShow,
  mensalidade,
  tipo,
  donor_id,
}) => {
  const [comissao, setComissao] = useState("");
  const [valor, setValor] = useState("");
  const [data_receber, setData_receber] = useState(DataNow("noformated"));
  const { operatorData } = useContext(UserContext);
  const [descricao, setDescricao] = useState("");
  const [impresso, setImpresso] = useState("");
  const [recebido, setRecebido] = useState("");
  const [mesref, setMesref] = useState(DataNow("noformated"));
  const [operator, setOperator] = useState(operatorData.operator_code_id);
  const [campain, setCampain] = useState([]);
  const [campainSelected, setCampainSelect] = useState("");
  const [operators, setOperators] = useState([]);

  const data_contato = DataNow("noformated");

  const fetchCampains = async () => {
    const response = await getCampains();
    setCampain(response);
  };

  const fetchOperators = async () => {
    const response = await getOperators({
      active: "true",
      item: "operator_code_id, operator_name",
    });

    setOperators(response);
  };

  useEffect(() => {
    fetchCampains();
    fetchOperators();
  }, []);

  useEffect(() => {
    if (mensalidade && comissao == "") {
      setValor(mensalidade);
    } else if (mensalidade && comissao != "") {
      setValor(Number(mensalidade) + Number(comissao));
    }
  }, [comissao]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (campainSelected === "") {
      toast.warning("Selecione a campanha");
      return;
    }

    const promise = insertDonation(
      donor_id,
      operator,
      valor,
      comissao,
      data_contato,
      data_receber,
      impresso,
      recebido,
      descricao,
      mesref,
      campainSelected
    );

    toast.promise(promise, {
      pending: "Criando doação...",
      success: "Doação criada com sucesso!",
      error: "Erro ao criar doação!",
    });

    try {
      await promise;

      setModalShow(false);
      setValor("");
      setComissao("");
      setData_receber("");
      setDescricao("");
      setImpresso("");
      setRecebido("");
      setMesref("");
    } catch (_) {}
  };

  const handleDate = (e) => {
    var value = e.target.value;
    const now = DataNow("noformated");

    setData_receber(value);
    if (tipo === "Mensal") {
      const monthYear = `${DataSelect(value, "year")}-${DataSelect(
        value,
        "month"
      )}-01`;
      setMesref(monthYear);
    }
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
          <div className="input-field">
            <label>Valor</label>
            <input
              type="text"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
          </div>

          {/* Comissão */}
          {tipo === "Mensal" && (
            <div className="input-field">
              <label>Extra</label>
              <input
                type="text"
                placeholder="R$ 0,00"
                value={comissao}
                onChange={(e) => setComissao(e.target.value)}
              />
            </div>
          )}

          {/* Data */}
          <div className="input-field">
            <label>Data</label>
            <input
              type="date"
              placeholder="dd/mm/yyyy"
              value={data_receber}
              onChange={handleDate}
            />
          </div>

          {/* Mês Referente */}
          {tipo === "Mensal" && (
          <div className="input-field">
            <label>Mês Referente</label>
            <input
              type="text"
              placeholder="Mês"
              value={new Date(mesref).toLocaleDateString("pt-BR", {
                timeZone: "UTC",
                month: "numeric",
                year: "numeric",
              })}
                onChange={(e) => setMesref(e.target.value)}
              />
            </div>
          )}

          <div className="input-field">
            <label>Operador</label>
            <select
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
            >
              <option value="" disabled>
                Selecione...
              </option>
              {operators.map((op) => (
                <option key={op.operator_code_id} value={op.operator_code_id}>
                  {op.operator_name}
                </option>
              ))}
            </select>
          </div>

          <div className="input-field">
            <label>Campanha</label>
            <select
              type="text"
              value={campainSelected}
              onChange={(e) => setCampainSelect(e.target.value)}
            >
              <option value="" disabled>
                Selecione...
              </option>
              {campain.map((cp) => (
                <option key={cp.id} value={cp.campain_name}>
                  {cp.campain_name}
                </option>
              ))}
            </select>
          </div>

          {/* Descrição */}
          <div className="input-field">
            <label>Descrição</label>
            <textarea
              type="text"
              placeholder="Observação"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              style={{ height: "40px" }}
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
