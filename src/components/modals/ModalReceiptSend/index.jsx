import React, { useEffect, useState } from "react";
import "./index.css";
import { FaDollarSign, FaEdit, FaSave, FaTimes } from "react-icons/fa";
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
      <div className="modal-receipt-send-container">
        <div className="modal-receipt-send-header">
          <h3>
            <FaDollarSign />
            Comprovantes de Depósitos
          </h3>
          <button
            className="modal-receipt-send-header-button-exit"
            onClick={() => setSendModalOpen(false)}
          >
            <FaTimes />
            Fechar
          </button>
        </div>
        
        <div className="modal-receipt-send-body">
          {deposit?.length === 0 ? (
            <div className="modal-receipt-send-empty">
              <p>Nenhum comprovante de depósito encontrado.</p>
            </div>
          ) : (
            deposit?.map((item, index) => (
              <div key={item.receipt_donation_id} className="modal-receipt-send-item">
                <div className="modal-receipt-send-item-info">
                  <div className="input-field">
                    <label>Recibo</label>
                    <p>{item.receipt_donation_id}</p>
                  </div>
                  <div className="input-field">
                    <label>Nome</label>
                    <p>{item.donor?.donor_name}</p>
                  </div>
                  <div className="input-field">
                    <label>WhatsApp</label>
                    <input
                      type="text"
                      value={item.donor.donor_tel_1}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      readOnly={inEdit !== item.receipt_donation_id}
                      className={inEdit === item.receipt_donation_id ? "editable" : "readonly"}
                    />
                  </div>
                </div>
                
                <div className="modal-receipt-send-item-actions">
                  <button
                    onClick={() => handleEdit(item, index)}
                    className={`modal-receipt-send-action-btn ${inEdit === item.receipt_donation_id ? "save" : "edit"}`}
                    title={inEdit === item.receipt_donation_id ? "Salvar alterações" : "Editar WhatsApp"}
                  >
                    {inEdit === item.receipt_donation_id ? <FaSave /> : <FaEdit />}
                  </button>
                  <GenerateDepositPDF data={item} config={config}/>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalReceiptSend;
