import { useContext, useEffect, useState } from "react";
import "./index.css";
import supabase from "../../helper/superBaseClient";
import { toast } from "react-toastify";
import { ICONS } from "../../constants/constants";
import { getCampains } from "../../helper/getCampains";
import { getOperators } from "../../helper/getOperators";
import { getCollector } from "../../helper/getCollector";
import { UserContext } from "../../context/UserContext";
import GenerateReceiptPDF from "../GenerateReceiptPDF";
import { getEditReceipt } from "../../helper/getEditReceipt";

const ModalEditDonation = ({ donation, setModalEdit, donorData }) => {
  const { operatorData } = useContext(UserContext);
  const [value, setValue] = useState(donation.donation_value);
  const [date, setDate] = useState(donation.donation_day_to_receive);
  const [monthReferent, setMonthReferent] = useState(
    donation.donation_monthref
  );
  const [observation, setObservation] = useState(donation.donation_description);
  const [campaign, setCampaign] = useState(donation.campaign_id);
  const [campaigns, setCampaigns] = useState([]);
  const [operator, setOperator] = useState(donation.operator_code_id);
  const [impresso, setImpresso] = useState(
    donation.donation_print === "Sim" ? true : false
  );
  const [recebido, setRecebido] = useState(
    donation.donation_received === "Sim" ? true : false
  );
  const [collectors, setCollectors] = useState([]);
  const [collector, setCollector] = useState(donation.collector_code_id);
  const [operators, setOperators] = useState([]);
  const [receiptConfig, setReceiptConfig] = useState([]);
  useEffect(() => {
    const fetchCampaigns = async () => {
      const response = await getCampains();
      setCampaigns(response);
    };
    fetchCampaigns();
  }, []);

  useEffect(() => {
    const fetchReceiptConfig = async () => {
      const response = await getEditReceipt();
      setReceiptConfig(response[0]);
    };
    fetchReceiptConfig();
  }, []);

  useEffect(() => {
    const fetchOperators = async () => {
      const response = await getOperators({
        active: true,
        item: "operator_code_id, operator_name",
      });
      setOperators(response);
    };
    fetchOperators();
  }, []);

  useEffect(() => {
    const fetchCollectors = async () => {
      const response = await getCollector();
      setCollectors(response);
    };
    fetchCollectors();
  }, [])
  const handleConfirm = async () => {
    if (operator === "") {
      toast.warning("Operador deve ser preenchido!");
      return;
    }

    if (value === "" || date === "") {
      toast.warning("Valor e data devem ser preenchidos!");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("donation")
        .update([
          {
            donation_value: value,
            donation_day_to_receive: date,
            donation_description: observation,
            operator_code_id: operator,
            donation_print: impresso ? "Sim" : "Não",
            donation_received: recebido ? "Sim" : "Não",
            donation_monthref: monthReferent,
          },
        ])
        .eq("receipt_donation_id", donation.receipt_donation_id)
        .select();

      if (error) throw error;

      if (data.length > 0) {
        toast.success("Doação atualizado com sucesso");
        setModalEdit(false);
        setObservation("");
      }
    } catch (error) {
      toast.error("Erro ao atualizar doação: ", error.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Deseja deletar a doação?")) {
      const { error } = await supabase
        .from("donation")
        .delete()
        .eq("receipt_donation_id", donation.receipt_donation_id);
      if (error) throw error;
      if (!error) {
        toast.success("Doação deletada com sucesso!");
        setModalEdit(false);
      }
    }
  };

  const handleDownloadPDF = async () => {
    try {
      // Prepara os dados no formato esperado pelo GenerateReceiptPDF
      const donationData = {
        ...donation,
        donor: {
          donor_name: donorData.nome,
          donor_tel_1: donorData.telefone1,
          donor_tel_2: donorData.telefone2,
          donor_tel_3: donorData.telefone3,
          donor_address: donorData.endereco,
          donor_city: donorData.cidade,
          donor_neighborhood: donorData.bairro,
          donor_type: donorData.tipo,
          donor_reference: donorData.referencia,
          donor_observation: donorData.observacao,
        },
        donation_campain: donation.donation_campain || "Campanha Geral",
      };

      // Chama o GenerateReceiptPDF com o nome do colaborador no arquivo
      await GenerateReceiptPDF({
        cards: [donationData],
        receiptConfig,
        setOk: () => {},
      });

      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar PDF");
    }
  };

  return (
    <main className="modal-editDonation-container">
      <div className="modal-editDonation">
        <div className="modal-editDonation-content">
          <div className="modal-editDonation-header">
            <div className="modal-title-section">
              <h3 className="modal-title">Detalhes da Doação</h3>
              <span className="receipt-number">
                Recibo: #{donation.receipt_donation_id}
              </span>
            </div>
            <button
              onClick={() => setModalEdit(false)}
              className="btn-close-modal"
              title="Fechar"
            >
              ✕
            </button>
          </div>
          <div className="modal-editDonation-body">
            <div className="form-section">
              <h3>Editar Doação</h3>
              <div className="form-grid">
                <div className="input-group">
                  <label>Valor *</label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="0,00"
                  />
                </div>
                <div className="input-group">
                  <label>Data para Receber *</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                {donation.operator_code_id && (
                  <div className="input-group">
                    <label>Mes Referente *</label>
                    <input
                      type="date"
                      value={monthReferent}
                      onChange={(e) => setMonthReferent(e.target.value)}
                    />
                  </div>
                )}

                <div className="input-group">
                  <label>Operador *</label>
                  <select
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                  >
                    <option value="" disabled>
                      Selecione um operador...
                    </option>
                    {operators.map((op) => (
                      <option
                        key={op.operator_code_id}
                        value={op.operator_code_id}
                      >
                        {op.operator_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label>Coletador *</label>
                  <select
                    value={collector}
                    onChange={(e) => setCollector(e.target.value)}
                  >
                    <option value="" disabled>
                      Selecione um coletador...
                    </option>
                    {collectors.map((op) => (
                      <option
                        key={op.collector_code_id}
                        value={op.collector_code_id}
                      >
                        {op.collector_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label>Campanha</label>
                  <select
                    value={campaign}
                    onChange={(e) => setCampaign(e.target.value)}
                  >
                    <option value="" disabled>
                      Selecione uma campanha...
                    </option>
                    {campaigns?.map((campaign) => (
                      <option key={campaign.id} value={campaign.campain_name}>
                        {campaign.campain_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-group full-width">
                  <label>Observação</label>
                  <textarea
                    value={observation}
                    onChange={(e) => setObservation(e.target.value)}
                    placeholder="Observações sobre a doação..."
                    rows="3"
                  />
                </div>
              </div>

              {/*{operatorData.operator_type === "Admin" && (
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
              )}*/}
            </div>
          </div>

          <div className="modal-editDonation-footer">
            <div className="action-buttons">
              <button
                onClick={handleDownloadPDF}
                className="btn-pdf"
                title="Baixar PDF do Recibo"
              >
                📄 Baixar PDF
              </button>
              <button
                onClick={handleDelete}
                className="btn-delete"
                title="Excluir Doação"
              >
                🗑️ Excluir
              </button>
            </div>
            <div className="primary-buttons">
              <button onClick={handleConfirm} className="btn-confirm">
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ModalEditDonation;
