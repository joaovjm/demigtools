import React, { useEffect, useState } from "react";
import "./index.css";
import { getDonationsPrint, getDonationsPrinted } from "../../services/printService";
import { FaAngleRight } from "react-icons/fa";
import { getCollector } from "../../helper/getCollector";
import supabase from "../../helper/superBaseClient";
import { toast } from "react-toastify";
import { getReceiptPrint } from "../../helper/getReceiptPrint";
import GenerateReceiptPDF from "../../components/GenerateReceiptPDF";
import ModalPrintedPackages from "../../components/modals/ModalPrintedPackages";

const CheckPrint = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(startDate);
  const [selectType, setSelectType] = useState("Todos");
  const [printers, setPrinters] = useState([]);
  const [collectors, setCollectors] = useState([]);
  const [config, setConfig] = useState([]);
  const [isOpen, setIsOpen] = useState();
  const [receiptPrint, setReceiptPrint] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [donationsPrinted, setDonationsPrinted] = useState([]);
  const [printedPackagesModalOpen, setPrintedPackagesModalOpen] = useState(false);
  const fetchCollectors = async () => {
    const response = await getCollector();
    setCollectors(response);
  };

  const fetchReceiptPrint = async () => {
    const response = await getReceiptPrint();
    setReceiptPrint(response);
  };

  const fetchDonationsPrinted = async () => {
    const response = await getDonationsPrinted();
    setDonationsPrinted(response);
  }

  useEffect(() => {
    fetchCollectors();
    fetchReceiptPrint();
    fetchDonationsPrinted();
  }, []);

  const handleDate = async (item, date) => {
    if (item === "startDate") {
      setStartDate(date);
      setEndDate(date);
    }
    if (item === "endDate") {
      setEndDate(date);
    }
  };

  const fetchDonationsNoPrint = async () => {
    setLoading("search");
    if (startDate === "" || endDate === "") {
      toast.warning("Data de início e fim são obrigatórias");
      setLoading("");
      return;
    }
    setPrinters([]);
    const response = await getDonationsPrint(startDate, endDate);
    setPrinters(response);
    const { data, error } = await supabase.from("receipt_config").select();
    if (error) throw error;
    if (!error) {
      setConfig(data[0]);
    }
    setLoading("");
  };

  const selected = (id, collector) => {
    const collectorName = collectors.find(
      (f) => f.collector_code_id === Number(collector)
    );
    setPrinters((prev) =>
      prev.map((item) =>
        item.receipt_donation_id === id
          ? {
              ...item,
              collector_code_id: collector,
              collector: { collector_name: collectorName.collector_name },
            }
          : item
      )
    );
  };

  const handlePrint = () => {
    if (isOpen) {
      setIsOpen(null);
      return;
    }
    setIsOpen(true);
  };
  
  const handleGenerateReceiptPDF = async () => {
    await GenerateReceiptPDF({
      cards: printers,
      receiptConfig: config,
      setOk: setOk,
    });
    
  };

  return (
    <main className="checkprint-container">
      <div className="checkprint-content">
        {/* Header Section */}
        <header className="checkprint-header">
          <h2 className="checkprint-title">🖨️ Verificação de Impressão</h2>
          <div className="checkprint-actions">
            <div 
              className="checkprint-stats-card" 
              onClick={() => setPrintedPackagesModalOpen(true)}
            >
              <div className="stats-icon">📦</div>
              <div className="stats-content">
                <span className="stats-label">Pacotes Impressos</span>
                <span className="stats-value">{donationsPrinted?.length || 0}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Search Section */}
        <div className="checkprint-search-section">
          <div className="checkprint-search-form">
            <div className="form-row">
              <div className="form-group">
                <label>Data Início</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => handleDate("startDate", e.target.value)}
                  className="checkprint-input"
                />
              </div>
              <div className="form-group">
                <label>Data Fim</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => handleDate("endDate", e.target.value)}
                  className="checkprint-input"
                />
              </div>
              <div className="form-group">
                <label>Tipo</label>
                <select
                  value={selectType}
                  onChange={(e) => setSelectType(e.target.value)}
                  className="checkprint-select"
                >
                  <option value="Todos">Todos</option>
                  <option value="Avulso">Avulso</option>
                  <option value="Mensal">Mensal</option>
                </select>
              </div>
              <div className="form-group">
                <button 
                  onClick={fetchDonationsNoPrint} 
                  disabled={loading}
                  className="checkprint-btn primary"
                >
                  {loading === "search" ? "Buscando..." : "🔍 Buscar"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {printers?.length > 0 && (
          <div className="checkprint-results-section">
            <div className="checkprint-results-header">
              <div className="results-stats">
                <div className="stats-item">
                  <span className="stats-label">Fichas Encontradas</span>
                  <span className="stats-value">{printers?.length}</span>
                </div>
              </div>
              <div className="results-actions">
                <button
                  className={`checkprint-btn ${ok ? "success" : "primary"}`}
                  onClick={handleGenerateReceiptPDF}
                  disabled={ok}
                >
                  {ok ? "✅ Impresso" : "🖨️ Gerar e Imprimir"}
                </button>
                <button
                  onClick={handlePrint}
                  className={`checkprint-toggle-btn ${isOpen ? "open" : ""}`}
                  title={isOpen ? "Ocultar detalhes" : "Mostrar detalhes"}
                >
                  <FaAngleRight />
                </button>
              </div>
            </div>

            {isOpen && (
              <div className="checkprint-results-content">
                <div className="checkprint-cards-grid">
                  {printers?.map((print) => (
                    <div
                      key={print.receipt_donation_id}
                      className="checkprint-card"
                    >
                      <div className="card-header">
                        <div className="receipt-badge">
                          #{print.receipt_donation_id}
                        </div>
                        <div className="value-amount">
                          {print.donation_value.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </div>
                      </div>
                      
                      <div className="card-content">
                        <div className="card-section">
                          <h4>Doador</h4>
                          <div className="donor-info">
                            <span className="donor-name">{print.donor.donor_name}</span>
                            <span className="donor-address">{print.donor.donor_address}</span>
                            <span className="donor-neighborhood">{print.donor.donor_neighborhood}</span>
                          </div>
                        </div>

                        {print.donation_description && (
                          <div className="card-section">
                            <h4>Observação</h4>
                            <p className="donation-description">{print.donation_description}</p>
                          </div>
                        )}

                        <div className="card-section">
                          <h4>Coletador</h4>
                          <select
                            value={print.collector_code_id || ""}
                            onChange={(e) =>
                              selected(print.receipt_donation_id, e.target.value)
                            }
                            disabled={ok}
                            className="checkprint-select"
                          >
                            <option value="" disabled>
                              Selecione um coletador...
                            </option>
                            {collectors?.map((collector) => (
                              <option
                                key={collector.collector_code_id}
                                value={collector.collector_code_id || ""}
                              >
                                {collector.collector_name || ""}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de Pacotes Impressos */}
      {printedPackagesModalOpen && (
        <ModalPrintedPackages setModalOpen={setPrintedPackagesModalOpen} />
      )}

    </main>
  );
};

export default CheckPrint;
