import React, { useEffect, useState } from "react";
import "./index.css";
import { FaDollarSign } from "react-icons/fa6";
import GenerateDepositPDF from "../../GenerateDepositPDF";
import supabase from "../../../helper/superBaseClient";
const ModalReceiptSend = ({ setSendModalOpen, deposit, setDeposit }) => {
  const [whatsapp, setWhatsapp] = useState();
  const [inEdit, setInEdit] = useState("");
  const [config, setConfig] = useState([])

  const handleEdit = (item) => {
    if (inEdit === item.receipt_donation_id) {
      setInEdit("");
    } else {
      setInEdit(item.receipt_donation_id);
    }

  };

  const fetchReceiptConfig = async () => {
    const { data, error } = await supabase.from("receipt_config").select();
    if (error) throw error;
    if (!error) {
      setConfig(data[0]);
    }
  }

  useEffect(() => {
    fetchReceiptConfig()
  }, [])
  
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

                <GenerateDepositPDF data={item} config={config}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModalReceiptSend;
