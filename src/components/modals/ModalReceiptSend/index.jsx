import React, { useState } from "react";
import "./index.css";
import { FaDollarSign } from "react-icons/fa6";
const ModalReceiptSend = ({ setSendModalOpen, deposit, setDeposit }) => {
  const [whatsapp, setWhatsapp] = useState();
  const [inEdit, setInEdit] = useState("");

  const handleEdit = (item, index) => {
    if (inEdit === item.receipt_donation_id) {
      setInEdit("");
    } else {
      setInEdit(item.receipt_donation_id);
    }

    /*if (itemClicked) {
      setDeposit(
        deposit.map((dp) => {
          if (dp.receipt_donation_id === item.receipt_donation_id) {
            return { ...dp, donor: { ...dp.donor, donor_tel_1: whatsapp } };
          }
          return dp;
        })
      );
      setItemClicked();
    } else {
      setWhatsapp(item.donor?.donor_tel_1);
      setItemClicked(item.receipt_donation_id);
    }*/
  };
  return (
    <div className="modal-area">
      <div className="modal-send-container">
        <div className="modal-send-head">
          <h3>
            <FaDollarSign />
            Comprovantes de Depositos
          </h3>
          <button
            className="modal-send-head-btn"
            onClick={() => setSendModalOpen(false)}
          >
            Fechar
          </button>
        </div>
        <div className="modal-send-body">
          {deposit?.map((item, index) => (
            <div
              key={item.receipt_donation_id}
              className="modal-send-body-receipt"
            >
              <div className="input-field">
                <label>Recibo</label>
                <p>{item.receipt_donation_id}</p>
              </div>
              <div className="input-field">
                <label>Nome</label>
                <p style={{ width: "300px" }}>{item.donor?.donor_name}</p>
              </div>

              <div className="input-field">
                <label>Whatsapp</label>
                <input
                  type="text"
                  style={{ width: "160px" }}
                  value={item.donor.donor_tel_1}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  readOnly={inEdit !== item.receipt_donation_id}
                />
              </div>
              <div className="modal-send-body-receipt-btn">
                <button
                  onClick={() => handleEdit(item, index)}
                  className="modal-send-body-receipt-btn-edit"
                >
                  {inEdit === item.receipt_donation_id ? "Salvar" : "Editar"}
                </button>
                <button className="modal-send-body-receipt-btn-send">
                  Enviar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModalReceiptSend;
