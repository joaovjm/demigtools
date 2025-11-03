import React, { useEffect, useState } from "react";
import supabase from "../../helper/superBaseClient";
import { getEditReceipt } from "../../helper/getEditReceipt";
import { toast } from "react-toastify";
import styles from "../../pages/AdminManager/adminmanager.module.css";

const ReceiptConfig = () => {
  const [inEdit, setInEdit] = useState(false);
  const [receipt, setReceipt] = useState([]);
  const [editReceipt, setEditReceipt] = useState({
    pixKey: "",
    description: "",
    pixName: "",
    pixCity: "",
    instagram: "",
    facebook: "",
    email: "",
    backOfReceipt: "",
  });

  const fetchReceipt = async () => {
    const response = await getEditReceipt();
    const { pixKey, pixName, pixCity, description, backOfReceipt, instagram, facebook, email } =
      response[0];
    setEditReceipt({ pixKey, pixName, pixCity, description, backOfReceipt, instagram, facebook, email });
  };
  useEffect(() => {
    fetchReceipt();
  }, []);

  const editReceiptChange = (field, value) => {
    setEditReceipt((item) => ({ ...item, [field]: value }));
  };

  const handleEditReceipt = async () => {
    if (inEdit) {
      try {
        const { error } = await supabase
          .from("receipt_config")
          .update(editReceipt)
          .eq("id", 1);
        if (error) {
          toast.error("Erro ao atualizar recibo: ", error.message);
        } else {
          toast.success("Recibo atualizado com sucesso!");
          setInEdit(!inEdit);
        }
      } catch (error) {
      }
    } else {
      setInEdit(!inEdit);
    }
  };
  return (
    <div className={styles.receiptConfigContainer}>
      <div className={styles.receiptConfigContent}>
        <h3 className={styles.receiptConfigTitle}>Configuração de Recibo</h3>
        <div className={styles.receiptConfigForm}>
          {/* Seção PIX */}
          <div className={styles.receiptConfigSection}>
            <h4>Informações PIX</h4>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Chave PIX</label>
                <input
                  value={editReceipt.pixKey}
                  onChange={(e) => editReceiptChange("pixKey", e.target.value)}
                  type="text"
                  disabled={!inEdit}
                  className={styles.receiptConfigInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Descrição</label>
                <input
                  value={editReceipt.description}
                  onChange={(e) =>
                    editReceiptChange("description", e.target.value)
                  }
                  type="text"
                  disabled={!inEdit}
                  className={styles.receiptConfigInput}
                />
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Nome</label>
                <input
                  value={editReceipt.pixName}
                  onChange={(e) => editReceiptChange("pixName", e.target.value)}
                  type="text"
                  disabled={!inEdit}
                  className={styles.receiptConfigInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Cidade</label>
                <input
                  value={editReceipt.pixCity}
                  onChange={(e) => editReceiptChange("pixCity", e.target.value)}
                  type="text"
                  disabled={!inEdit}
                  className={styles.receiptConfigInput}
                />
              </div>
            </div>
          </div>

          {/* Seção Redes Sociais */}
          <div className={styles.receiptConfigSection}>
            <h4>Midias Sociais e Contatos</h4>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Instagram</label>
                <input
                  type="text"
                  value={editReceipt.instagram}
                  onChange={(e) => editReceiptChange("instagram", e.target.value)}
                  disabled={!inEdit}
                  className={styles.receiptConfigInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Facebook</label>
                <input
                  type="text"
                  value={editReceipt.facebook}
                  onChange={(e) => editReceiptChange("facebook", e.target.value)}
                  disabled={!inEdit}
                  className={styles.receiptConfigInput}
                />
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input
                  type="text"
                  value={editReceipt.email}
                  onChange={(e) => editReceiptChange("email", e.target.value)}
                  disabled={!inEdit}
                  className={styles.receiptConfigInput}
                />
              </div>
            </div>
          </div>

          {/* Seção Mensagem do Verso */}
          <div className={styles.receiptConfigSection}>
            <h4>Verso do Recibo</h4>
            <div className={styles.formGroup}>
              <label>Mensagem do verso do recibo</label>
              <textarea
                value={editReceipt.backOfReceipt}
                onChange={(e) =>
                  editReceiptChange("backOfReceipt", e.target.value)
                }
                disabled={!inEdit}
                className={styles.receiptConfigTextarea}
                placeholder="Digite a mensagem que aparecerá no verso do recibo..."
              />
            </div>
          </div>

          {/* Botão de Ação */}
          <div className={styles.receiptConfigActions}>
            <button 
              onClick={handleEditReceipt}
              className={`${styles.receiptConfigBtn} ${styles.primary}`}
            >
              {inEdit ? "Salvar Configurações" : "Editar Configurações"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptConfig;
