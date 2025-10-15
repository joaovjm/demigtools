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
  const [mesref, setMesref] = useState(() => {
    if (tipo === "Mensal") {
      return DataNow("noformated");
    } else {
      return "";
    }
  });
 
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
    <main className="modal-donation-container">
      <div className="modal-donation">
        <div className="modal-donation-content">
          <div className="modal-donation-header">
            <div className="modal-title-section">
              <h2 className="modal-title">
                <FaDollarSign />
                Nova Doação
              </h2>
            </div>
            <button
              onClick={() => setModalShow(!modalShow)}
              className="btn-close-modal"
              title="Fechar"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="modal-donation-body">

            <div className="form-section">
              <h3>Dados da Doação</h3>
              <div className="form-grid">
                <div className="input-group">
                  <label>Valor *</label>
                  <input
                    type="number"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    placeholder="0,00"
                    required
                  />
                </div>

                {tipo === "Mensal" && (
                  <div className="input-group">
                    <label>Extra</label>
                    <input
                      type="number"
                      placeholder="0,00"
                      value={comissao}
                      onChange={(e) => setComissao(e.target.value)}
                    />
                  </div>
                )}

                <div className="input-group">
                  <label>Data para Receber *</label>
                  <input
                    type="date"
                    value={data_receber}
                    onChange={handleDate}
                    required
                  />
                </div>

                {tipo === "Mensal" && (
                  <div className="input-group">
                    <label>Mês Referente</label>
                    <input
                      type="text"
                      placeholder="Mês de referência"
                      value={mesref ? new Date(mesref).toLocaleDateString("pt-BR", {
                        timeZone: "UTC",
                        month: "numeric",
                        year: "numeric",
                      }) : ""}
                      onChange={(e) => setMesref(e.target.value)}
                      readOnly
                    />
                  </div>
                )}

                <div className="input-group">
                  <label>Operador *</label>
                  <select
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Selecione um operador...
                    </option>
                    {operators.map((op) => (
                      <option key={op.operator_code_id} value={op.operator_code_id}>
                        {op.operator_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label>Campanha *</label>
                  <select
                    value={campainSelected}
                    onChange={(e) => setCampainSelect(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Selecione uma campanha...
                    </option>
                    {campain.map((cp) => (
                      <option key={cp.id} value={cp.campain_name}>
                        {cp.campain_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group full-width">
                  <label>Descrição</label>
                  <textarea
                    placeholder="Observações sobre a doação..."
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    rows="3"
                  />
                </div>
              </div>

              {operatorData.operator_type === "Admin" && (
                <div className="status-section">
                  <h4>Status da Doação</h4>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={impresso}
                        onChange={(e) => setImpresso(e.target.checked)}
                      />
                      <span className="checkmark"></span>
                      Impresso
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={recebido}
                        onChange={(e) => setRecebido(e.target.checked)}
                      />
                      <span className="checkmark"></span>
                      Recebido
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-donation-footer">
              <button type="submit" className="btn-create-donation">
                💰 Criar Doação
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ModalDonation;
