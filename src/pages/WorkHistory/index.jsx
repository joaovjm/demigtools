import React, { useState, useEffect } from "react";
import "./index.css";
import supabase from "../../helper/superBaseClient";
import { toast } from "react-toastify";

const WorkHistory = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [operatorList, setOperatorList] = useState([]);
  const [operatorSelected, setOperatorSelected] = useState("");
  const [receivedSelected, setReceivedSelected] = useState("");
  const [donationList, setDonationList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastDonationsMap, setLastDonationsMap] = useState({});

  const fetchOperatorIndividualWork = async () => {
    try {
      const { data, error } = await supabase
        .from("operator")
        .select()
        .eq("operator_active", true);
      if (error) throw error;
      if (data) setOperatorList(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchOperatorIndividualWork();
  }, []);

  const handleGenerate = async () => {
    if (
      [startDate, endDate, operatorSelected, receivedSelected].some(
        (v) => v === ""
      )
    ) {
      toast.warning("Selecione todas as opções!");
      return;
    }

    setLoading(true);
    try {
      let query = supabase
        .from("donation")
        .select("*, donor: donor_id(donor_name, donor_tel_1)")
        .eq("operator_code_id", operatorSelected);
      if (receivedSelected === "Sim") {
        query = query
          .eq("donation_received", "Sim")
          .gte("donation_day_received", startDate)
          .lte("donation_day_received", endDate);
      } else {
        query = query
          .eq("donation_received", "Não")
          .gte("donation_day_to_receive", startDate)
          .lte("donation_day_to_receive", endDate);
      }
      const { data, error } = await query;
      if (error) throw error;
      if (data) {
        setDonationList(data);
        
        // Buscar última doação de cada doador
        const donorIds = [...new Set(data.map(item => item.donor_id).filter(Boolean))];
        if (donorIds.length > 0) {
          const lastDonationsPromises = donorIds.map(async (donorId) => {
            const { data: lastDonation } = await supabase
              .from("donation")
              .select("donation_day_received, donation_value")
              .eq("donor_id", donorId)
              .eq("donation_received", "Sim")
              .order("donation_day_received", { ascending: false })
              .limit(1)
              .single();
            return { donorId, lastDonation };
          });
          
          const results = await Promise.all(lastDonationsPromises);
          const donationsMap = {};
          results.forEach(({ donorId, lastDonation }) => {
            donationsMap[donorId] = lastDonation;
          });
          setLastDonationsMap(donationsMap);
        }
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const worklistDonations = donationList.filter(
    (item) => item.donation_worklist !== null
  );
  const newDonations = donationList.filter(
    (item) => item.donation_worklist === null
  );
  const totalValue = donationList.reduce(
    (acc, item) =>
      acc + (item.donation_value || 0),
    0
  );
  const totalExtra = donationList.reduce(
    (acc, item) =>
      acc + (item.donation_extra || 0),
    0
  );
  const receivedCount = donationList.filter(
    (item) => item.donation_received === "Sim"
  ).length;
  const printedCount = donationList.filter(
    (item) => item.donation_print === "Sim"
  ).length;

  console.log({ receivedSelected, operatorSelected, startDate, endDate });
  return (
    <div className="work-history-container">
      <div className="work-history-content">
        <h3 className="work-history-title">📊 Histórico de Trabalho</h3>

        {/* Filter Form Section */}
        <div className="work-history-form-section">
          <h4>Filtros de Relatório</h4>
          <div className="work-history-form">
            <div className="form-row-single">
              <div className="form-group">
                <label>Data de Início</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="work-history-input"
                />
              </div>
              <div className="form-group">
                <label>Data de Fim</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="work-history-input"
                />
              </div>
              <div className="form-group">
                <label>Operador</label>
                <select
                  value={operatorSelected}
                  onChange={(e) => setOperatorSelected(e.target.value)}
                  className="work-history-select"
                >
                  <option value="" disabled>
                    Selecione o operador
                  </option>
                  {operatorList.map((item) => (
                    <option
                      value={item.operator_code_id}
                      key={item.operator_code_id}
                    >
                      {item.operator_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Status de Recebimento</label>
                <select
                  value={receivedSelected}
                  onChange={(e) => setReceivedSelected(e.target.value)}
                  className="work-history-select"
                >
                  <option value="" disabled>
                    Selecione...
                  </option>
                  <option value="Sim">Recebido</option>
                  <option value="Não">Não Recebido</option>
                </select>
              </div>
              <div className="form-group">
                <label>&nbsp;</label>
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="work-history-btn primary"
                >
                  {loading ? "Gerando..." : "Gerar Relatório"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {donationList.length > 0 && (
          <div className="work-history-results">
            {/* Statistics Header */}
            <div className="work-history-stats">
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Total de Registros</span>
                  <span className="stat-value">{donationList.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Valor Total</span>
                  <span className="stat-value">
                    {totalValue.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total do Extra</span>
                  <span className="stat-value">
                    {totalExtra.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Recebidos</span>
                  <span className="stat-value">{receivedCount}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Impressos</span>
                  <span className="stat-value">{printedCount}</span>
                </div>
              </div>
            </div>

            {/* Worklist Donations Table */}
            {worklistDonations.length > 0 && (
              <div className="work-history-table-section">
                <h4>📋 Doações com Work List ({worklistDonations.length})</h4>
                <div className="work-history-table-wrapper">
                  <div className="work-history-table-scroll">
                    <table className="work-history-table">
                      <thead>
                        <tr className="work-history-head-row">
                          <th className="work-history-head">Recibo</th>
                          <th className="work-history-head">Valor</th>
                          <th className="work-history-head">Extra</th>
                          <th className="work-history-head">Ult. Doação</th>
                          <th className="work-history-head">Work List</th>
                          <th className="work-history-head">Doador</th>
                          <th className="work-history-head">Contato</th>
                          <th className="work-history-head">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {worklistDonations.map((item) => (
                          <tr
                            key={item.receipt_donation_id}
                            className="work-history-row"
                          >
                            <td className="work-history-cell">
                              <span className="receipt-number">
                                {item.receipt_donation_id}
                              </span>
                            </td>
                            <td className="work-history-cell">
                              <span className="value-amount">
                                {item.donation_value?.toLocaleString("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                })}
                              </span>
                            </td>
                            <td className="work-history-cell">
                              <span className="extra-amount">
                                {item.donation_extra?.toLocaleString("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                }) || "R$ 0,00"}
                              </span>
                            </td>
                            <td className="work-history-cell">
                              <span className="last-donation-info">
                                {lastDonationsMap[item.donor_id] ? (
                                  <>
                                    <span className="last-donation-date">
                                      {new Date(lastDonationsMap[item.donor_id].donation_day_received).toLocaleDateString("pt-BR")}
                                    </span>
                                    <span className="last-donation-value">
                                      {lastDonationsMap[item.donor_id].donation_value?.toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                      })}
                                    </span>
                                  </>
                                ) : "N/A"}
                              </span>
                            </td>
                            <td className="work-history-cell">
                              <span className="worklist-info">
                                {item.donation_worklist || "N/A"}
                              </span>
                            </td>
                            <td className="work-history-cell">
                              <span className="donor-name">
                                {item.donor?.donor_name || "N/A"}
                              </span>
                            </td>
                            <td className="work-history-cell">
                              <span className="contact-info">
                                {item.donor?.donor_tel_1 || "N/A"}
                              </span>
                            </td>
                            <td className="work-history-cell">
                              <div className="status-group">
                                <span
                                  className={`status-badge ${
                                    item.donation_print === "Sim"
                                      ? "status-success"
                                      : "status-pending"
                                  }`}
                                >
                                  {item.donation_print === "Sim"
                                    ? "✓ Impresso"
                                    : "○ Não impresso"}
                                </span>
                                <span
                                  className={`status-badge ${
                                    item.donation_received === "Sim"
                                      ? "status-success"
                                      : "status-pending"
                                  }`}
                                >
                                  {item.donation_received === "Sim"
                                    ? "✓ Recebido"
                                    : "○ Em Aberto"}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* New Donations Table */}
            {newDonations.length > 0 && (
              <div className="work-history-table-section">
                <h4>🆕 Novas Doações ({newDonations.length})</h4>
                <div className="work-history-table-wrapper">
                  <div className="work-history-table-scroll">
                    <table className="work-history-table">
                      <thead>
                        <tr className="work-history-head-row">
                          <th className="work-history-head">Recibo</th>
                          <th className="work-history-head">Valor</th>
                          <th className="work-history-head">Extra</th>
                          <th className="work-history-head">Ult. Doação</th>
                          <th className="work-history-head">Doador</th>
                          <th className="work-history-head">Contato</th>
                          <th className="work-history-head">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {newDonations.map((item) => (
                          <tr
                            key={item.receipt_donation_id}
                            className="work-history-row"
                          >
                            <td className="work-history-cell">
                              <span className="receipt-number">
                                {item.receipt_donation_id}
                              </span>
                            </td>
                            <td className="work-history-cell">
                              <span className="value-amount">
                                {item.donation_value?.toLocaleString("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                })}
                              </span>
                            </td>
                            <td className="work-history-cell">
                              <span className="extra-amount">
                                {item.donation_extra?.toLocaleString("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                }) || "R$ 0,00"}
                              </span>
                            </td>
                            <td className="work-history-cell">
                              <span className="last-donation-info">
                                {lastDonationsMap[item.donor_id] ? (
                                  <>
                                    <span className="last-donation-date">
                                      {new Date(lastDonationsMap[item.donor_id].donation_day_received).toLocaleDateString("pt-BR")}
                                    </span>
                                    <span className="last-donation-value">
                                      {lastDonationsMap[item.donor_id].donation_value?.toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                      })}
                                    </span>
                                  </>
                                ) : "N/A"}
                              </span>
                            </td>
                            <td className="work-history-cell">
                              <span className="donor-name">
                                {item.donor?.donor_name || "N/A"}
                              </span>
                            </td>
                            <td className="work-history-cell">
                              <span className="contact-info">
                                {item.donor?.donor_tel_1 || "N/A"}
                              </span>
                            </td>
                            <td className="work-history-cell">
                              <div className="status-group">
                                <span
                                  className={`status-badge ${
                                    item.donation_print === "Sim"
                                      ? "status-success"
                                      : "status-pending"
                                  }`}
                                >
                                  {item.donation_print === "Sim"
                                    ? "✓ Impresso"
                                    : "○ Não impresso"}
                                </span>
                                <span
                                  className={`status-badge ${
                                    item.donation_received === "Sim"
                                      ? "status-success"
                                      : "status-pending"
                                  }`}
                                >
                                  {item.donation_received === "Sim"
                                    ? "✓ Recebido"
                                    : "○ Em Aberto"}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {donationList.length === 0 && !loading && (
          <div className="work-history-empty">
            <div className="empty-icon">📊</div>
            <h4>Nenhum registro encontrado</h4>
            <p>
              Selecione os filtros e gere um relatório para visualizar os dados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkHistory;
