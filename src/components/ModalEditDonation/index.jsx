import { useContext, useEffect, useState } from "react";
import "./index.css";
import supabase from "../../helper/superBaseClient";
import { toast } from "react-toastify";
import { ICONS } from "../../constants/constants";
import { getCampains } from "../../helper/getCampains";
import { getOperators } from "../../helper/getOperators";
import { UserContext } from "../../context/UserContext";

const ModalEditDonation = ({ donation, setModalEdit }) => {
  const { operatorData } = useContext(UserContext);
  const [value, setValue] = useState(donation.donation_value);
  const [date, setDate] = useState(donation.donation_day_to_receive);
  const [observation, setObservation] = useState(donation.donation_description);
  const [campaign, setCampaign] = useState(donation.campaign_id);
  const [campaigns, setCampaigns] = useState([]);
  const [operator, setOperator] = useState(donation.operator_code_id);
  const [impresso, setImpresso] = useState(donation.donation_print === "Sim" ? true : false);
  const [recebido, setRecebido] = useState(donation.donation_received === "Sim" ? true : false);

  const [operators, setOperators] = useState([]);
  useEffect(() => {
    const fetchCampaigns = async () => {
      const response = await getCampains();
      setCampaigns(response);
    };
    fetchCampaigns();
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

  return (
    <main className="modal-editDonation-container">
      <div className="modal-editDonation">
        <div onSubmit={handleConfirm} className="form-modal-editDonation">
          <div className="form-modal-editDonation-header">
            <h5>Recibo: </h5>
            <button
              onClick={() => setModalEdit(false)}
              className="btn-exit-editDonation"
            >
              Fechar
            </button>
          </div>
          <div className="form-modal-editDonation-body">
            <div className="input-field">
              <label>Valor</label>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
            <div className="input-field">
              <label>Data</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
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
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
              >
                <option value="" disabled>
                  Selecione uma campanha
                </option>
                {campaigns?.map((campaign) => (
                  <option key={campaign.id} value={campaign.campain_name}>
                    {campaign.campain_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-field">
              <label>Observação</label>
              <input
                type="text"
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
              />
            </div>
            {operatorData.operator_type === "Admin" && (
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
            )}
          </div>

          <div className="form-modal-editDonation-footer">
            <button
              onClick={handleConfirm}
              className="btn-confirm-editDonoation"
            >
              Confirmar
            </button>
            <button
              onClick={handleDelete}
              className="btn-confirm-deleteDonoation"
            >
              {ICONS.TRASH}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ModalEditDonation;
