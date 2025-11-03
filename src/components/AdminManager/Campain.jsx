import React, { useEffect, useState } from "react";
import { getCampains } from "../../helper/getCampains";
import { ICONS } from "../../constants/constants";
import { updateCampains } from "../../helper/updateCampains";
import { deleteCampain } from "../../helper/deleteCampain";
import { insertNewCampain } from "../../helper/insertNewCampain";
import { toast } from "react-toastify";
import styles from "../../pages/AdminManager/adminmanager.module.css";

const Campain = () => {
  const [campains, setCampains] = useState([]);
  const [newCampain, setNewCampain] = useState();
  const [inEdit, setInEdit] = useState();
  const [campainText, setCampainText] = useState("");
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const campain = async () => {
      const response = await getCampains();
      setCampains(response);
    };
    campain();
  }, [inEdit, reload]);

  const handleChange = (id, field, value) => {
    const update = campains.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setCampains(update);
  };

  const handleEdit = async (id) => {
    if (inEdit) {
      const updateCampain = campains.find((c) => c.id === id);
      await updateCampains(updateCampain);
      setInEdit();
    } else {
      setInEdit(id);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Deseja mesmo deletar esta campanha?")) {
      await deleteCampain(id);
      setReload((prev) => !prev);
    }
  };

  const handleNewCampain = async () => {
    if (newCampain === "") {
      toast.warning("Preencha o campo 'Nova Campanha' corretamente...");
      return;
    }
    await insertNewCampain(newCampain);
    setReload((prev) => !prev);
    setNewCampain("");
  };

  return (
    <div className={styles.campain}>
      <div className={styles.campainDivs}>
        <div className={styles.campainDivsBody}>
          <label>Campanhas</label>
          <div className={styles.campainDivsBodyCampains}>
            {campains?.map((cp) => (
              <div key={cp.id} className={styles.campainDivsBodyCampainsItens}>
                <input
                  type="text"
                  value={cp.campain_name || ""}
                  onChange={(e) =>
                    handleChange(cp.id, "campain_name", e.target.value)
                  }
                  readOnly={inEdit !== cp.id}
                />
                <div className={styles.campainDivsBodyCampainsItensIcons}>
                  <p onClick={() => handleEdit(cp.id)}>
                    {inEdit !== cp.id ? ICONS.EDIT : ICONS.CONFIRMED}
                  </p>
                  <p onClick={() => handleDelete(cp.id)}>{ICONS.TRASH}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.campainDivsBottom}>
          <div className="input-field">
            <label>Nova Campanha</label>
            <input
              value={newCampain}
              type="text"
              onChange={(e) => setNewCampain(e.target.value)}
            />
          </div>
          <button onClick={handleNewCampain}>Add</button>
        </div>
      </div>

      <div className={styles.campainDivs} style={{display: "flex", gap: 0}}>
        <label>Mensagens Para Campanhas</label>
        <div className="input-field" style={{maxHeight: 166}}>
          <label>Mensagem</label>
          <textarea style={{ height: 90, padding: 4 }} onChange={(e) => setCampainText(e.target.value)} />
        </div>
        <div style={{display: "flex", gap: 16, alignItems: "flex-end", border: "1px solid red"}}>
          <div className="input-field">
            <label>Campanha Associada</label>
            <select>
              <option value="" disabled>
                Selecione...
              </option>
              {campains?.map((cp) => (
                <option value={cp.id}>{cp.campain_name}</option>
              ))}
            </select>
          </div>
          <button>{campainText === "" ? "Associar" : "Atualizar"}</button>  
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default Campain;
