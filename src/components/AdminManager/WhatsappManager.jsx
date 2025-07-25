import { useState } from "react";
import { toast } from "react-toastify";

const WhatsappManager = () => {
  const [whatsappNumber, setWhatsappNumber] = useState();
  const [whatsappAPI, setWhatsappAPI] = useState();
  const [messageWhatsapp, setMessageWhatsapp] = useState();
  const [edit, setEdit] = useState(false);
  const [messageEdit, setMessageEdit] = useState(false);
  const [name, setName] = useState();
  const [value, setValue] = useState();
  const [campain, setCampain] = useState();

  const text = "${****}";
  const handleAddEdit = () => {
    if (edit) {
      toast.success("Whatsapp adicionado com sucesso");
      setEdit(!edit);
    } else {
      setEdit(!edit);
    }
  };
  const handleMessageEdit = () => {
    if (messageEdit) {
      setMessageEdit(!messageEdit);
    } else {
      setMessageEdit(!messageEdit);
    }
  };
  return (
    <div className="whatsappmanager">
      <div className="whatsappmanager-header">
        <div className="whatsappmanager-header-content">
          <div className="input-field">
            <label>Nº Whatsapp</label>
            <input
              disabled={edit === false}
              type="text"
              style={{ width: 200 }}
            />
          </div>
          <div className="input-field">
            <label>Codigo Whatsapp API</label>
            <input
              value={whatsappAPI}
              onChange={(e) => setWhatsappAPI(e.target.value)}
              disabled={!edit}
              type="text"
            />
          </div>
        </div>
        <button onClick={handleAddEdit}>
          {edit ? "Salvar" : whatsappNumber ? "Editar" : "Adicionar"}
        </button>
      </div>
      <hr />
      <div>
        <div className="input-field">
          <label>Mensagem Personalizada</label>
          <textarea
            value={messageWhatsapp}
            onChange={(e) => setMessageWhatsapp(e.target.value)}
            style={{ padding: "6px" }}
            disabled={!messageEdit}
          />
        </div>
      </div>

      <div className="whatsappmanager-tips">
        <label>
          Aqui você personaliza a mensagem que será enviada ao colaborador.
        </label>
        <label>
          1 - Escreva "{text}" (sem as aspas) onde quer que exiba algo,
          substituindo os asteriscos por uma das seguintes opções:
        </label>
        <label>1.1 - name = Para exibir o nome do colaborador</label>
        <label>1.2 - value = Para exibir o valor da doação</label>
        <label>
          1.3 - campain = Para exibir a campanha à qual o colaborador participou
        </label>
        <label></label>
      </div>
      <button onClick={handleMessageEdit}>
        {messageEdit ? "Salvar" : messageWhatsapp ? "Editar" : "Adicionar"}
      </button>
    </div>
  );
};

export default WhatsappManager;
