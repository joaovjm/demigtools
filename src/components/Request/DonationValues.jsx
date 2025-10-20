import React, { useEffect, useState } from "react";
import { ICONS } from "../../constants/constants";
import Loader from "../Loader";

const DonationValues = ({ createPackage, onComplete, onCancel }) => {
  const [packageCount, setPackageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const countPackage = () => {
      const count = createPackage?.reduce((acc, item) => {
        return acc + item.donation_value;
      }, 0);

      setPackageCount(count);
    };
    countPackage();
  }, [createPackage]);

  const handleContinue = () => {
    setLoading(true);
    onComplete();
    setLoading(false);
  };

  return (
    <div className="request-step-container">
      <div className="request-step-header">
        <h3>Etapa 3: Valores e Quantidade do Pacote</h3>
        <p>Visualize os valores e quantidade de doações encontradas</p>
      </div>
      
      <div className="request-step-content">
        <div className="package-summary">
          <div className="summary-cards">
            <div className="summary-card">
              <div className="card-icon">{ICONS.MONEY}</div>
              <div className="card-content">
                <h4>Quantidade de Doações</h4>
                <span className="card-value">{createPackage.length}</span>
                <span className="card-label">registros encontrados</span>
              </div>
            </div>
            
            <div className="summary-card">
              <div className="card-icon">{ICONS.CONFIRMED}</div>
              <div className="card-content">
                <h4>Valor Total</h4>
                <span className="card-value">
                  {packageCount.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
                <span className="card-label">valor total arrecadado</span>
              </div>
            </div>
          </div>

          <div className="package-details">
            <h4>Detalhes do Pacote</h4>
            <div className="details-grid">
              <div className="detail-item">
                <label>Status</label>
                <div className="status-badge success">
                  <span className="status-icon">{ICONS.CONFIRMED}</span>
                  <span>Pacote Processado</span>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              onClick={onCancel}
              className="request-btn secondary"
            >
              Cancelar
            </button>
            <button 
              onClick={handleContinue}
              disabled={loading}
              className="request-btn primary"
            >
              {loading ? <Loader /> : "Continuar para Distribuição"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationValues;
