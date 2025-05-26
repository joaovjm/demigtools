import React, { useState } from "react";
import "./index.css";
import { operatorWorkService } from "../../services/operatorWorkService";
import TableOperatorWork from "../../components/TableOperatorWork";
import { toast } from "react-toastify";
import { collectorWorkService } from "../../services/collectorWorkService";
import TableCollectorWork from "../../components/TableCollectorWork";

const OperatorWork = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filter, setFilter] = useState("");
  const [relatoryOperator, setRelatoryOperator] = useState();
  const [relatoryCollector, setRelatoryCollector] = useState();

  const handleGenerate = async () => {
    if ([startDate, endDate, filter].some((v) => v === "")) {
      toast.warning("Selecione as datas de inicio e fim!");
      return;
    }
    if (endDate < startDate) {
      toast.warning("A data final não pode ser menor que a data inicial");
      return;
    }

    if (filter === "Operadores") {
      const response = await operatorWorkService(startDate, endDate);
      setRelatoryCollector(null)
      setRelatoryOperator(response);
    } else if (filter === "Coletadores") {
      const response = await collectorWorkService(startDate, endDate);
      setRelatoryOperator(null)
      setRelatoryCollector(response);
    }
  };

  return (
    <div className="operator-work">
      <div className="operator-work-header">
        <div className="input-field">
          <label>Inicio</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="input-field">
          <label>Fim</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="input-field">
          <label>Filtro</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">Selecione....</option>
            <option value="Operadores">Operadores</option>
            <option value="Coletadores">Coletadores</option>
          </select>
        </div>
        <div className="operator-work-geral-button">
          <button onClick={handleGenerate} className="btn-gerar">
            Gerar
          </button>
        </div>
      </div>
      {relatoryOperator && relatoryOperator.names.length !== 0 && (
        <TableOperatorWork relatory={relatoryOperator} />
      )}
      {relatoryCollector && relatoryCollector.names.length !== 0 && (
        <TableCollectorWork relatory={relatoryCollector} />
      )}
    </div>
  );
};

export default OperatorWork;
