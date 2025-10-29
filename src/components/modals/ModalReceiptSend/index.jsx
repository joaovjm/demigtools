import React, { useEffect, useState } from "react";
import styles from "./modalreceiptsend.module.css";
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
      <div className={styles.modalReceiptSendContainer}>
        <div className={styles.modalReceiptSendHeader}>
          <h3>
            <FaDollarSign />
            Comprovantes de Depósitos
          </h3>
          <button
            className={styles.modalReceiptSendHeaderButtonExit}
            onClick={() => setSendModalOpen(false)}
          >
            <FaTimes />
            Fechar
          </button>
        </div>
        
        <div className={styles.modalReceiptSendBody}>
          {deposit?.length === 0 ? (
            <div className={styles.modalReceiptSendEmpty}>
              <p>Nenhum comprovante de depósito encontrado.</p>
            </div>
          ) : (
            deposit?.map((item, index) => (
              <div key={item.receipt_donation_id} className={styles.modalReceiptSendItem}>
                <div className={styles.modalReceiptSendItemInfo}>
                  <div className={styles.inputField}>
                    <label>Recibo</label>
                    <p>{item.receipt_donation_id}</p>
                  </div>
                  <div className={styles.inputField}>
                    <label>Nome</label>
                    <p>{item.donor?.donor_name}</p>
                  </div>
                  <div className={styles.inputField}>
                    <label>WhatsApp</label>
                    <input
                      type="text"
                      value={item.donor.donor_tel_1}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      readOnly={inEdit !== item.receipt_donation_id}
                      className={inEdit === item.receipt_donation_id ? styles.editable : styles.readonly}
                    />
                  </div>
                </div>
                
                <div className={styles.modalReceiptSendItemActions}>
                  <button
                    onClick={() => handleEdit(item, index)}
                    className={`${styles.modalReceiptSendActionBtn} ${inEdit === item.receipt_donation_id ? styles.save : styles.edit}`}
                    title={inEdit === item.receipt_donation_id ? "Salvar alterações" : "Editar WhatsApp"}
                  >
                    {inEdit === item.receipt_donation_id ? <FaSave /> : <FaEdit />}
                  </button>
                  {/* <GenerateDepositPDF data={item} config={config}/> */}
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
