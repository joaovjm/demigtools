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
    const { pixKey, pixName, pixCity, description, backOfReceipt } =
      response[0];
    setEditReceipt({ pixKey, pixName, pixCity, description, backOfReceipt });
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
        console.log(error);
      }
    } else {
      setInEdit(!inEdit);
    }
  };
  return (
    <>
      <div>
        <div className="receiptconfig-pix">
          <h4>PIX</h4>
          <div className="receiptconfig-pix-inputs">
            <div className="input-field">
              <label>Chave PIX</label>
              <input
                value={editReceipt.pixKey}
                onChange={(e) => editReceiptChange("pixKey", e.target.value)}
                type="text"
                disabled={!inEdit}
              />
            </div>
            <div className="input-field">
              <label>Descrição</label>
              <input
                value={editReceipt.description}
                onChange={(e) =>
                  editReceiptChange("description", e.target.value)
                }
                type="text"
                disabled={!inEdit}
              />
            </div>
            <div className="input-field">
              <label>Nome</label>
              <input
                value={editReceipt.pixName}
                onChange={(e) => editReceiptChange("pixName", e.target.value)}
                type="text"
                disabled={!inEdit}
              />
            </div>
            <div className="input-field">
              <label>Cidade</label>
              <input
                value={editReceipt.pixCity}
                onChange={(e) => editReceiptChange("pixCity", e.target.value)}
                type="text"
                disabled={!inEdit}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <hr style={{ marginTop: 24, marginBottom: 20 }} />
        <div className="receiptconfig-socialmedia">
          <h4>Midias Sociais e Contatos</h4>
          <div className="receiptconfig-pix-inputs">
            <div className="input-field">
              <label>Instagram</label>
              <input
                type="text"
                value={editReceipt.instagram}
                onChange={(e) => editReceiptChange("instagram", e.target.value)}
                disabled={!inEdit}
              />
            </div>
            <div className="input-field">
              <label>Facebook</label>
              <input
                type="text"
                value={editReceipt.facebook}
                onChange={(e) => editReceiptChange("facebook", e.target.value)}
                disabled={!inEdit}
              />
            </div>
            <div className="input-field">
              <label>Email</label>
              <input
                type="text"
                value={editReceipt.email}
                onChange={(e) => editReceiptChange("email", e.target.value)}
                disabled={!inEdit}
              />
            </div>
          </div>
        </div>
      </div>
      <div style={{height: 240}}>
        <hr style={{ marginTop: 24, marginBottom: 20 }} />
        <div className="receiptconfig-message">
          <h4>Verso do Recibo</h4>
          <div className="input-field">
            <label>Mensagem do verso do recibo</label>
            <input
              value={editReceipt.backOfReceipt}
              onChange={(e) =>
                editReceiptChange("backOfReceipt", e.target.value)
              }
              type="text"
              disabled={!inEdit}
            />
          </div>
        </div>
      </div>

      <div style={{ display: "Flex", width: "100%", justifyContent: "center" }}>
        <button style={{ width: "60%" }} onClick={handleEditReceipt}>
          {inEdit ? "Salvar" : "Editar"}
        </button>
      </div>
    </>
  );
};

export default ReceiptConfig;
