import { useEffect, useState } from "react";
import "./index.css";
import supabase from "../../helper/superBaseClient";
import { DataSelect } from "../DataTime";
import { toast } from "react-toastify";

const ModalEditDonation = ({ donation, setModalEdit }) => {
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");
  const [observation, setObservation] = useState("");

  useEffect(() => {
    setValue(donation.donation_value);
    setObservation(donation.donation_description);
  }, []);

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (value === "" || date === ""){
        toast.warning("Valor e data devem ser preenchidos!")
        return null;
    }
    try {
      const { data, error } = await supabase.from("donation").update([
        {
          donation_value: value,
          donation_day_to_receive: DataSelect(date),
          donation_description: observation,
        },
      ])
      .eq("receipt_donation_id", donation.receipt_donation_id)
      .select();

      if (error) throw error;

      if (data.length > 0){
        toast.success("Doação atualizado com sucesso")
        setModalEdit(false)
      }

    } catch (error) {
      toast.error("Erro ao atualizar doação: ", error.message);
    }
  };

  return (
    <main className="modal-editDonation-container">
      <div className="modal-editDonation">
        <form onSubmit={handleConfirm} className="form-modal-editDonation">
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
            <button type="submit" className="btn-confirm-editDonoation">
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ModalEditDonation;
