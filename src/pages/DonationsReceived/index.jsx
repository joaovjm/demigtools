import React, { useEffect, useState } from "react";
import "./index.css";
import supabase from "../../helper/superBaseClient";
import { DataSelect } from "../../components/DataTime";
import Loader from "../../components/Loader";

const DonationsReceived = () => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [donationReceived, setDonationReceived] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [totalValue, setTotalValue] = useState(0);

  const fetchDonationReceived = async (i) => {
    let dateAdd;

    if (i >= 0) {
      const newDate = new Date(startDate);
      newDate.setDate(newDate.getDate() + i);
      const newDateAdd = newDate;
      dateAdd = DataSelect(newDateAdd, "noformated");
    } else {
      dateAdd = startDate;
    }
    try {
      const { data, error } = await supabase
        .from("donation")
        .select("donation_value")
        .eq("donation_day_received", dateAdd);
      console.log(data)
      if (error) throw error;
      if (data) {
        const valueDonation = data.reduce(
          (acc, item) => {return acc + item?.donation_value}, 0
        );
        const count = data.length; 

        return { valueDonation, count, dateAdd };
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDonationReceived = async () => {
    setIsLoading(true);
    setDonationReceived([]);
    let totalCount = 0;
    let totalValue = 0;
    const diffTime = Math.abs(new Date(endDate) - new Date(startDate));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      const { valueDonation, count, dateAdd } = await fetchDonationReceived();
      setDonationReceived([{ valueDonation, count, dateAdd }]);
    } else {
      for (let i = 0; i <= diffDays; i++) {
        const { valueDonation, count, dateAdd } = await fetchDonationReceived(
          i
        );
        setDonationReceived((prev) => [
          ...prev,
          { valueDonation, count, dateAdd },
        ]);

        totalValue = totalValue + valueDonation;
        totalCount = totalCount + count;
      }
    }
    
    setTotalValue(totalValue);
    setTotalCount(totalCount);
    setIsLoading(false);
  };

  return (
    <main className="donations-received-container">
      <div className="donations-received-content">
        {/* Cabeçalho com título e ações */}
        <header className="donations-received-header">
          <h2 className="donations-received-title">💰 Doações Recebidas</h2>
          <div className="donations-received-actions">
            <button 
              onClick={() => window.history.back()} 
              className="donations-received-btn secondary"
            >
              ← Voltar
            </button>
          </div>
        </header>

        {/* Seção de Filtros */}
        <div className="donations-received-filters">
          <h3>Filtros de Período</h3>
          <div className="filters-form">
            <div className="form-row">
              <div className="form-group">
                <label>Data Início</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="donations-received-input"
                />
              </div>
              <div className="form-group">
                <label>Data Fim</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="donations-received-input"
                />
              </div>
              <div className="form-group">
                <button 
                  onClick={handleDonationReceived}
                  disabled={isLoading || !startDate || !endDate}
                  className="donations-received-btn primary"
                >
                  {isLoading ? <Loader /> : "Gerar Relatório"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cards de Resumo */}
        {donationReceived.length > 0 && (
          <div className="donations-received-summary">
            <div className="summary-cards">
              <div className="summary-card">
                <div className="summary-card-icon">📊</div>
                <div className="summary-card-content">
                  <h4>Total de Fichas</h4>
                  <span className="summary-card-value">{totalCount}</span>
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-card-icon">💰</div>
                <div className="summary-card-content">
                  <h4>Valor Total</h4>
                  <span className="summary-card-value">
                    {totalValue?.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-card-icon">📅</div>
                <div className="summary-card-content">
                  <h4>Período</h4>
                  <span className="summary-card-value">
                    {donationReceived.length} {donationReceived.length === 1 ? 'dia' : 'dias'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabela de Resultados */}
        <div className="donations-received-table-section">
          {donationReceived.length > 0 ? (
            <div className="donations-received-table-wrapper">
              <h3>Relatório Diário</h3>
              <div className="table-container">
                <table className="donations-received-table">
                  <thead>
                    <tr className="donations-received-table-header">
                      <th>Data</th>
                      <th>Quantidade de Fichas</th>
                      <th>Valor Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donationReceived?.map((item, index) => (
                      <tr key={index} className="donations-received-table-row">
                        <td className="date-cell">
                          <span className="date-value">
                            {new Date(item.dateAdd).toLocaleDateString("pt-BR", {
                              timeZone: "UTC",
                            }) || "—"}
                          </span>
                        </td>
                        <td className="count-cell">
                          <span className="count-value">{item.count || 0}</span>
                        </td>
                        <td className="value-cell">
                          <span className="value-amount">
                            {item.valueDonation?.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }) || "R$ 0,00"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="donations-received-empty">
              <div className="empty-icon">📊</div>
              <h4>Nenhum dado encontrado</h4>
              <p>Selecione um período e clique em "Gerar Relatório" para visualizar as doações recebidas.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default DonationsReceived;
