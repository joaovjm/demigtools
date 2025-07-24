import React, { useState } from "react";
import "./index.css";
import { FaDollarSign } from "react-icons/fa6";
const ModalReceiptSend = ({ setSendModalOpen, deposit, setDeposit }) => {
  console.log(deposit);
  const [whatsapp, setWhatsapp] = useState();
  const [itemClicked, setItemClicked] = useState()

  const handleEdit = (item, index) => {
    if (itemClicked){
        setDeposit(deposit.map((dp) => {
            if (dp.receipt_donation_id === item.receipt_donation_id){
                return {...dp, donor: {...dp.donor, donor_tel_1: whatsapp} }
            }
            return dp;
        }))
        setItemClicked()
    } else {
        setWhatsapp(item.donor?.donor_tel_1)
        setItemClicked(item.receipt_donation_id)
    }
    
  }
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
              <label>{item.receipt_donation_id}</label>
              <label>{item.donor?.donor_name}</label>
              <label>{item.donor?.donor_tel_1}</label>
              <div className="modal-send-body-receipt-btn">
                <button
                  onClick={() => handleEdit(item, index)}
                  className="modal-send-body-receipt-btn-edit"
                >
                  {itemClicked === item.receipt_donation_id ? "Salvar" : "Editar"}
                </button>
                <button className="modal-send-body-receipt-btn-send">
                  Enviar
                </button>
              </div>
              {itemClicked === item.receipt_donation_id && (
                <div className="modal-send-body-receipt-edit">
                  <div className="input-field">
                    <label>Mensagem</label>
                    <textarea style={{ padding: "6px" }} />
                  </div>
                  <div className="input-field">
                    <label>Whatsapp</label>
                    <input
                      type="text"
                      style={{ padding: "6px" }}
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModalReceiptSend;
