import { useEffect, useState } from "react";
import "./index.css";
import supabase from "../../helper/superBaseClient";
import { toast } from "react-toastify";
import { ICONS } from "../../constants/constants";

const ModalEditDonation = ({ donation, setModalEdit }) => {
  const [value, setValue] = useState(donation.donation_value);
  const [date, setDate] = useState(donation.donation_day_to_receive);
  const [observation, setObservation] = useState(donation.donation_description);

  const handleConfirm = async () => {
    if (value === "" || date === "") {
      toast.warning("Valor e data devem ser preenchidos!");
      return null;
    }
    try {
      const { data, error } = await supabase
        .from("donation")
        .update([
          {
            donation_value: value,
            donation_day_to_receive: date,
            donation_description: observation,
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
    ;
    if (window.confirm("Deseja deletar a doação?")) {
      const { error } = await supabase
        .from("donation")
        .delete()
        .eq("receipt_donation_id", donation.receipt_donation_id);
      if (error) throw error;
      if (!error) {
        toast.success("Doação deletada com sucesso!")
        setModalEdit(false)
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
              <label>Observação</label>
              <input
                type="text"
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
              />
            </div>
          </div>
          <div className="form-modal-editDonation-footer">
            <button onClick={handleConfirm} className="btn-confirm-editDonoation">
              Confirmar
            </button>
            <button onClick={handleDelete} className="btn-confirm-deleteDonoation">{ICONS.TRASH}</button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ModalEditDonation;
