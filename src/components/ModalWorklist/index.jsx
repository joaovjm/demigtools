import { toast } from "react-toastify";
import supabase from "../../helper/superBaseClient";
import "./index.css";
import updateRequestSelected from "../../helper/updateRequestSelected";
import { newDonation } from "../../services/worklistService";
import { useState } from "react";

const ModalWorklist = ({ setModalOpen, workListSelected, setActive }) => {
  console.log(workListSelected);
  const [newDonationOpen, setNewDonationOpen] = useState(false);
  const {
    id,
    donor: { donor_name, donor_tel_1 },
    donor_tel_2b: {
      donor_tel_2: { donor_tel_2 },
    },
    donor_tel_3b: {
      donor_tel_3: { donor_tel_3 },
    },
  } = workListSelected;
  console.log(donor_tel_2);
  const handleClose = () => {
    setModalOpen(false);
    setActive("");
  };

  const handleNP = async () => {
    updateRequestSelected("NP", id, setModalOpen, setActive);
  };

  const handleNA = () => {
    updateRequestSelected("NA", id, setModalOpen, setActive);
  };

  const handleNewDonation = () => {
    setNewDonationOpen(true);
    newDonation();
  };

  const handleCancel = () => {
    setNewDonationOpen(false);
  };
  return (
    <div className="modal-worklist">
      <div className="modal-worklist-main">
        <div className="modal-worklist-main-header">
          <h3>{donor_name}</h3>
          <button onClick={handleClose}>Fechar</button>
        </div>
        <div className="modal-worklist-main-body">
          <label>telefone 1: {donor_tel_1}</label>
          <label>telefone 2:{donor_tel_2 ? donor_tel_2 : "*****-****"}</label>
          <label>telefone 3: {donor_tel_3 ? donor_tel_3 : "*****-****"}</label>
        </div>

        {!newDonationOpen ? (
          <div className="modal-worklist-main-buttons">
            <button onClick={handleNP}>Não pode ajudar</button>
            <button onClick={handleNA}>Não atendeu</button>
            <button onClick={handleNewDonation}>Nova doação</button>
          </div>
        ) : (
          <>
            <hr />
            <div className="modal-worklist-main-newdonation">
              <div className="modal-worklist-main-newdonation-header">
                <h4> Nova Doação</h4>
              </div>
              <div className="modal-worklist-main-newdonation-body">
                <div className="input-group">
                  <div className="input-field">
                    <label>Valor</label>
                    <input type="text" />
                  </div>
                  <div className="input-field">
                    <label>Dt. Receber</label>
                    <input type="date" />
                  </div>
                  <div className="input-field">
                    <label>Campanha</label>
                    <select>
                      <option value="" disabled>
                        Selecione...
                      </option>
                    </select>
                  </div>
                  <div className="input-field" style={{ gridColumn: "span 2" }}>
                    <label>Observação</label>
                    <input type="text" />
                  </div>
                </div>
                <div className="modal-worklist-main-newdonation-footer">
                  <button onClick={handleCancel}>Cancelar</button>
                  <button onClick={handleCancel}>Salvar</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ModalWorklist;
