import React, { useEffect, useState } from "react";
import supabase from "../../helper/superBaseClient";
import { getEditReceipt } from "../../helper/getEditReceipt";
import { toast } from "react-toastify";

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
    <div className="receipt-config-container">
      <div className="receipt-config-content">
        <h3 className="receipt-config-title">Configuração de Recibo</h3>
        <div className="receipt-config-form">
          {/* Seção PIX */}
          <div className="receipt-config-section">
            <h4>Informações PIX</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Chave PIX</label>
                <input
                  value={editReceipt.pixKey}
                  onChange={(e) => editReceiptChange("pixKey", e.target.value)}
                  type="text"
                  disabled={!inEdit}
                  className="receipt-config-input"
                />
              </div>
              <div className="form-group">
                <label>Descrição</label>
                <input
                  value={editReceipt.description}
                  onChange={(e) =>
                    editReceiptChange("description", e.target.value)
                  }
                  type="text"
                  disabled={!inEdit}
                  className="receipt-config-input"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Nome</label>
                <input
                  value={editReceipt.pixName}
                  onChange={(e) => editReceiptChange("pixName", e.target.value)}
                  type="text"
                  disabled={!inEdit}
                  className="receipt-config-input"
                />
              </div>
              <div className="form-group">
                <label>Cidade</label>
                <input
                  value={editReceipt.pixCity}
                  onChange={(e) => editReceiptChange("pixCity", e.target.value)}
                  type="text"
                  disabled={!inEdit}
                  className="receipt-config-input"
                />
              </div>
            </div>
          </div>

          {/* Seção Redes Sociais */}
          <div className="receipt-config-section">
            <h4>Midias Sociais e Contatos</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Instagram</label>
                <input
                  type="text"
                  value={editReceipt.instagram}
                  onChange={(e) => editReceiptChange("instagram", e.target.value)}
                  disabled={!inEdit}
                  className="receipt-config-input"
                />
              </div>
              <div className="form-group">
                <label>Facebook</label>
                <input
                  type="text"
                  value={editReceipt.facebook}
                  onChange={(e) => editReceiptChange("facebook", e.target.value)}
                  disabled={!inEdit}
                  className="receipt-config-input"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="text"
                  value={editReceipt.email}
                  onChange={(e) => editReceiptChange("email", e.target.value)}
                  disabled={!inEdit}
                  className="receipt-config-input"
                />
              </div>
            </div>
          </div>

          {/* Seção Mensagem do Verso */}
          <div className="receipt-config-section">
            <h4>Verso do Recibo</h4>
            <div className="form-group">
              <label>Mensagem do verso do recibo</label>
              <textarea
                value={editReceipt.backOfReceipt}
                onChange={(e) =>
                  editReceiptChange("backOfReceipt", e.target.value)
                }
                disabled={!inEdit}
                className="receipt-config-textarea"
                placeholder="Digite a mensagem que aparecerá no verso do recibo..."
              />
            </div>
          </div>

          {/* Botão de Ação */}
          <div className="receipt-config-actions">
            <button 
              onClick={handleEditReceipt}
              className="receipt-config-btn primary"
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
