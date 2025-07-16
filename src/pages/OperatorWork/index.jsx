import React, { useState } from "react";
import "./index.css";
import { operatorWorkService } from "../../services/operatorWorkService";
import TableOperatorAndCollectorWork from "../../components/TableOperatorAndCollectorWork";
import { toast } from "react-toastify";
import { collectorWorkService } from "../../services/collectorWorkService";
import ModalOperatorsAndCollectorsWork from "../../components/modals/ModalOperatorsAndCollectorsWork";

const OperatorWork = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filter, setFilter] = useState("");
  const [relatory, setRelatory] = useState();
  const [click, setClick] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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
      setRelatory(response);
    } else if (filter === "Coletadores") {
      const response = await collectorWorkService(startDate, endDate);
      setRelatory(response);
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
      {relatory && relatory.names.length !== 0 && (
        <TableOperatorAndCollectorWork
          relatory={relatory}
          setClick={setClick}
          setTableDonationOpen={setModalOpen}
          filter={filter}
        />
      )}

      {modalOpen && (
        <ModalOperatorsAndCollectorsWork
          click={click}
          startDate={startDate}
          endDate={endDate}
          filter={filter}
          setModalOpen={setModalOpen}
        />
      )}
    </div>
  );
};

export default OperatorWork;
