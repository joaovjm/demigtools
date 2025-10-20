import React, { useState } from "react";
import { ICONS } from "../../constants/constants";
import Loader from "../Loader";

const DateSelected = ({ date, onComplete, onCancel }) => {
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
    setLoading(true);
    onComplete();
    setLoading(false);
  };

  return (
    <div className="request-step-container">
      <div className="request-step-header">
        <h3>Etapa 2: Confirmação da Data</h3>
        <p>Confirme as datas do pacote criado</p>
      </div>

      <div className="request-step-content">
        <div className="date-confirmation">
          <div className="date-confirmation-header">
            <h4>Pacote Criado com Sucesso!</h4>
            <p>As seguintes datas foram configuradas para busca:</p>
          </div>

          <div className="date-list">
            {date?.map((data, index) => (
              <div key={index} className="date-item">
                <div className="date-info">
                  <span className="date-label">Período:</span>
                  <span className="date-range">
                    {new Date(data.startDate).toLocaleDateString("pt-BR", {
                      timeZone: "UTC",
                    })}{" "}
                    até{" "}
                    {new Date(data.endDate).toLocaleDateString("pt-BR", {
                      timeZone: "UTC",
                    })}
                  </span>
                </div>
                <div className="date-status">
                  <span className="status-icon">{ICONS.CONFIRMED}</span>
                  <span className="status-text">Configurado</span>
                </div>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button onClick={onCancel} className="request-btn secondary">
              Cancelar
            </button>
            <button
              onClick={handleContinue}
              disabled={loading}
              className="request-btn primary"
            >
              {loading ? <Loader /> : "Continuar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateSelected;
